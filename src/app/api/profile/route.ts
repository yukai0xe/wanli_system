import { fetchUser } from '@/lib/supabaseClient';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {

    try {
        const authHeader = request.headers.get('authorization');
        const user = await fetchUser(authHeader);
        const userProfile = await prisma.profile.findUnique({
            where: {
                id: user?.id
            }
        });
        console.log(userProfile)
        return new Response(JSON.stringify(userProfile), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Unauthorized', message: err }), {
            status: 401,
        });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, reason } = body;
        const authHeader = request.headers.get('authorization');
        const user = await fetchUser(authHeader);
        const existingProfile = await prisma.profile.findUnique({
            where: { id: user?.id },
        });

        if (!existingProfile) {
            if (!username || !reason) return Response.json({ error: '缺少 username 或 reason' }, { status: 400 });
            await prisma.profile.create({
                data: {
                    id: user?.id,
                    username,
                    reason,
                },
            });
        }
        return new Response(JSON.stringify({ data: "success" }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            }
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: 'Unauthorized', message: err }), {
            status: 401,
        });
    }
};