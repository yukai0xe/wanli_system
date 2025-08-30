import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const limit = parseInt(searchParams.get("limit") || "5");

  if (!userId)
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  try {
    // 取得前 N 名常用連結，分數由大到小
    const data = await redis.zrange(`user:${userId}:links`, 0, limit - 1, {
      withScores: true,
      rev: true,
    });

    const links: { url: string; pageName: string; count: number, teamId: string }[] = [];

    for (let i = 0; i < data.length; i += 2) {
      const member = data[i];
      const score = data[i + 1];

      let parsed: { url: string; pageName: string, teamId: string };

      // 安全檢查，避免 JSON.parse 對物件報錯
      if (typeof member === "string") {
        try {
          parsed = JSON.parse(member);
        } catch {
          // fallback，如果不是 JSON 就直接當作 url
          parsed = { url: member, pageName: member, teamId: member };
        }
      } else if (typeof member === "object" && member !== null) {
        parsed = member as { url: string; pageName: string, teamId: string };
      } else {
        // fallback
        parsed = { url: String(member), pageName: String(member), teamId: String(member) };
      }

      links.push({
        url: parsed.url,
        pageName: parsed.pageName,
        teamId: parsed.teamId,
        count: Number(score),
      });
    }

    return NextResponse.json(links);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
