import prisma from './prisma';

async function loadTeams() {
    const teams = await prisma.team.findMany();
    return teams;
}

export { loadTeams}
