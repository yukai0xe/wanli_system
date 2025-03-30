import { PrismaClient } from "@prisma/client";
// import { faker } from "@faker-js/faker"; // Importing the faker library to generate fake data
const prisma = new PrismaClient();
import questions from "./question.json" with { type: "json" }; // Importing the questions from a JSON file

const teams = [
  {
    name: "大小霸奇峰",
    date: new Date("2025-04-02 08:00:00"),
    teamsize: 15,
    duration: 3,
    place: "大小霸",
    summary: "探索台灣最美的山脈之一",
    content: "我們在大小霸的險峻山徑中穿越，攀登至山頂，俯瞰大自然的壯麗景色。",
    image:
      "1.jpg",
  },
  {
    name: "天使的眼淚 - 嘉明湖",
    date: new Date("2025-04-10 10:00:00"),
    teamsize: 20,
    duration: 3,
    place: "嘉明湖",
    summary: "神秘的高山湖泊探險",
    content: "我們穿越峻嶺，抵達嘉明湖，湖水碧藍如寶石，是這次旅程的最大亮點。",
    image: "2.jpg",
  },
  {
    name: "松蘿湖健行團",
    date: new Date("2025-04-18 09:30:00"),
    teamsize: 12,
    duration: 2,
    place: "松蘿湖",
    summary: "森林中的湖泊秘境",
    content:
      "我們在松蘿湖的山徑中行走，四周環繞著密林與高山，享受大自然的寧靜與清新空氣。",
    image: "3.jpg",
  },
  {
    name: "玉山一日單攻",
    date: new Date("2025-04-25 07:00:00"),
    teamsize: 4,
    duration: 1,
    place: "玉山",
    summary: "征服台灣最高峰",
    content:
      "這次挑戰讓我們攀登台灣的最高峰—玉山，步入雲霧繚繞的山巔，感受頂峰的成就感。",
    image: "4.jpg",
  },
  {
    name: "雪山圈谷健行",
    date: new Date("2025-05-01 11:00:00"),
    teamsize: 8,
    duration: 3,
    place: "雪山",
    summary: "穿越雪山的冰雪世界",
    content:
      "我們勇闖雪山，克服寒冷與艱難的路徑，最終登上雪山頂端，觀賞壯麗的雪景。",
    image: "5.jpg",
  },
];

async function main() {
    await prisma.team.deleteMany();
    await prisma.question.deleteMany();

    for (const team of teams) {
        await prisma.team.create({
            data: team
		});
	}
	
	for (const question of questions) {
		await prisma.question.create({
			data: {
				question: question.question,
				answer: question.answer,
			},
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
