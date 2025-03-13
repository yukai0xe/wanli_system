'use server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function addNewTeam(formData: FormData) {
    const teamName = formData.get("username") as string;

    try {
        const getRandomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
        const generateRandomString = (length: number) => Math.random().toString(36).substring(2, 2 + length);

        const newTeam = await prisma.team.create({
            data: {
                name: teamName,
                date: new Date(),
                teamsize: getRandomNumber(6, 18),
                summary: generateRandomString(30),
                content: generateRandomString(30),
                duration: getRandomNumber(1, 5),
                place: teamName,
                image: ''
            },
        });

        console.log(newTeam);
    } catch (error) {
        console.error(error);
    }
}