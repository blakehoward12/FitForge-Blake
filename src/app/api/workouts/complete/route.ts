import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { completedSessions, users } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const xp = body.xpEarned || 50;

  const completed = await db.insert(completedSessions).values({
    userId: session.user.id,
    workoutId: body.workoutId || null,
    dayLabel: body.dayLabel || "Workout",
    totalVolume: body.totalVolume || 0,
    totalSets: body.totalSets || 0,
    xpEarned: xp,
    exercises: JSON.stringify(body.exercises || []),
  }).returning();

  // Update user stats
  const today = new Date().toISOString().split("T")[0];
  const user = await db.select().from(users).where(eq(users.id, session.user.id)).get();
  const lastDate = user?.lastWorkoutDate?.split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const newStreak = lastDate === yesterday ? (user?.streak || 0) + 1 : lastDate === today ? (user?.streak || 1) : 1;

  await db.update(users).set({
    totalXP: sql`${users.totalXP} + ${xp}`,
    totalWorkouts: sql`${users.totalWorkouts} + 1`,
    streak: newStreak,
    lastWorkoutDate: new Date().toISOString(),
  }).where(eq(users.id, session.user.id));

  return NextResponse.json(completed[0]);
}
