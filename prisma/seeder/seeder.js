import { PrismaClient } from "@prisma/client";
// import { faker } from "@faker-js/faker"; // Importing the faker library to generate fake data
const prisma = new PrismaClient();
import questions from "./question.json" with { type: "json" }; // Importing the questions from a JSON file
import teams from "./team.json" with { type: "json" };
import items from "./item.json" with { type: "json" };

async function main() {
  await prisma.team.deleteMany();
  await prisma.question.deleteMany();
  await prisma.item.deleteMany();

  for (const team of teams) {
    await prisma.team.create({
      data: team
    });
  }
    
	for (const question of questions) {
		await prisma.question.create({
			data: question
		});
  }
  
  for (const item of items) {
		await prisma.item.create({
			data: item
		});
	}
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
