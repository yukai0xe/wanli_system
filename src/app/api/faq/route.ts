import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    console.log(request);
    const question = await prisma.question.findMany();

    return new Response(JSON.stringify(question), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
    });
}