import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, url, pageName, teamId } = body;

  if (!userId || !url || !pageName || !teamId) {
    return NextResponse.json(
      { error: "Missing userId, url, teamId or pageName" },
      { status: 400 }
    );
  }

  const data = JSON.stringify({ url, pageName, teamId });
  await redis.zincrby(`user:${userId}:links`, 1, data);

  return NextResponse.json({ message: "Link count updated" });
}
