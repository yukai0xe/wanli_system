import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const Team = async ({ params }: { params: Promise<{ id: string }> }) => {

    const data = await prisma.team.findUnique({
        where: {
            id: parseInt((await params).id),
        },
    });         

    return (
        <div>
            <h1>Team {data?.name}</h1>
            <p>Team size: {data?.teamsize}</p>
            <p>Summary: {data?.summary}</p>
            <p>Content: {data?.content}</p>
            <p>Duration: {data?.duration}</p>
            <p>Place: {data?.place}</p>
            <p>Image: {data?.image}</p>
        </div>
    )
}

export default Team;