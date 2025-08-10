import PlanTeamService from '@/lib/service/planTeamService';
import { authenticate } from '@/lib/middleware/auth';

export async function GET(request: Request) {
  try {
    const user = await authenticate(request);
    const id = new URL(request.url).searchParams.get('id');

    let data = null;
    if (!id) data = await PlanTeamService.getPlanTeamMetas(user.id);
    else {
      data = await PlanTeamService.getPlanTeamById(Number(id));
      if (!data) {
        return new Response(JSON.stringify({ error: 'Plan team not found' }), { status: 404 });
      }
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === 'Unauthorized') {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
      }
    }
    return new Response(JSON.stringify({ error: 'Internal Server Error', message: String(err) }), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await authenticate(request);
    const planTeamData: PlanTeam = await request.json();

    if (!planTeamData.mainName || !planTeamData.type || !planTeamData.dateType || !planTeamData.startDate || !planTeamData.endDate || !planTeamData.prepareDate || !planTeamData.members) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const createdPlanTeam = await PlanTeamService.createPlanTeam(planTeamData);
    const createdMeta = await PlanTeamService.createPlanTeamMeta(createdPlanTeam.id, planTeamData, user);

    return new Response(JSON.stringify({
      id: createdPlanTeam.id,
      metaData: createdMeta
     }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === 'Unauthorized') {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
      }
    }
    return new Response(JSON.stringify({ error: 'Internal Server Error', message: String(err) }), { status: 500 });
  }
}