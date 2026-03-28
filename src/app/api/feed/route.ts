import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { feedPosts, users } from "@/lib/schema";
import { eq, desc, sql } from "drizzle-orm";

export async function GET() {
  const results = await db
    .select({
      id: feedPosts.id,
      caption: feedPosts.caption,
      workoutId: feedPosts.workoutId,
      likes: feedPosts.likes,
      createdAt: feedPosts.createdAt,
      userName: users.name,
      userId: users.id,
    })
    .from(feedPosts)
    .leftJoin(users, eq(feedPosts.userId, users.id))
    .orderBy(desc(feedPosts.createdAt))
    .limit(50);

  return NextResponse.json(results);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  if (body.action === "like" && body.postId) {
    await db.update(feedPosts).set({ likes: sql`${feedPosts.likes} + 1` }).where(eq(feedPosts.id, body.postId));
    return NextResponse.json({ ok: true });
  }

  const result = await db.insert(feedPosts).values({
    userId: session.user.id,
    caption: body.caption,
    workoutId: body.workoutId || null,
  }).returning();

  return NextResponse.json(result[0]);
}
