import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    console.log(request);
    const teams = await prisma.team.findMany();

    return new Response(JSON.stringify(teams), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
    });
}