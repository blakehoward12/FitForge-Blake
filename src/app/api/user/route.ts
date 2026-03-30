import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, achievements, completedSessions, feedPosts } from "@/lib/schema";
import { eq, desc, count } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.select().from(users).where(eq(users.id, session.user.id)).get();
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Fetch achievements
  const userAchievements = await db.select().from(achievements)
    .where(eq(achievements.userId, session.user.id));

  // Fetch recent workouts (completed sessions)
  const recentWorkouts = await db.select().from(completedSessions)
    .where(eq(completedSessions.userId, session.user.id))
    .orderBy(desc(completedSessions.completedAt))
    .limit(5);

  // Count posts
  const postCount = await db.select({ count: count() }).from(feedPosts)
    .where(eq(feedPosts.userId, session.user.id));

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    isPremium: user.isPremium,
    isCreator: user.isCreator,
    totalXP: user.totalXP,
    totalWorkouts: user.totalWorkouts,
    streak: user.streak,
    lastWorkoutDate: user.lastWorkoutDate,
    createdAt: user.createdAt,
    achievements: userAchievements.map(a => a.achievementKey),
    recentWorkouts: recentWorkouts.map(w => ({
      id: w.id,
      dayLabel: w.dayLabel,
      totalVolume: w.totalVolume,
      totalSets: w.totalSets,
      xpEarned: w.xpEarned,
      completedAt: w.completedAt,
    })),
    postCount: postCount[0]?.count ?? 0,
  });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const allowed: Record<string, unknown> = {};
  if (body.name) allowed.name = body.name;

  await db.update(users).set(allowed).where(eq(users.id, session.user.id));
  return NextResponse.json({ ok: true });
}
