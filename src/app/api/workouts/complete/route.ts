import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { completedSessions, users, achievements } from "@/lib/schema";
import { eq, sql, and } from "drizzle-orm";

const ACHIEVEMENT_DEFS = [
  { key: "first_rep", check: (w: number, _s: number, _x: number) => w >= 1 },
  { key: "getting_started", check: (w: number, _s: number, _x: number) => w >= 5 },
  { key: "ten_strong", check: (w: number, _s: number, _x: number) => w >= 10 },
  { key: "committed", check: (w: number, _s: number, _x: number) => w >= 25 },
  { key: "unstoppable", check: (w: number, _s: number, _x: number) => w >= 50 },
  { key: "on_a_roll", check: (_w: number, s: number, _x: number) => s >= 3 },
  { key: "week_warrior", check: (_w: number, s: number, _x: number) => s >= 7 },
  { key: "monthly_grinder", check: (_w: number, s: number, _x: number) => s >= 30 },
  { key: "xp_hunter", check: (_w: number, _s: number, x: number) => x >= 1000 },
  { key: "xp_legend", check: (_w: number, _s: number, x: number) => x >= 5000 },
];

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

  const newTotalWorkouts = (user?.totalWorkouts || 0) + 1;
  const newTotalXP = (user?.totalXP || 0) + xp;

  await db.update(users).set({
    totalXP: sql`${users.totalXP} + ${xp}`,
    totalWorkouts: sql`${users.totalWorkouts} + 1`,
    streak: newStreak,
    lastWorkoutDate: new Date().toISOString(),
  }).where(eq(users.id, session.user.id));

  // Check and award achievements
  const existingAchievements = await db.select().from(achievements)
    .where(eq(achievements.userId, session.user.id));
  const existingKeys = new Set(existingAchievements.map(a => a.achievementKey));

  for (const def of ACHIEVEMENT_DEFS) {
    if (!existingKeys.has(def.key) && def.check(newTotalWorkouts, newStreak, newTotalXP)) {
      await db.insert(achievements).values({
        userId: session.user.id,
        achievementKey: def.key,
      });
    }
  }

  return NextResponse.json(completed[0]);
}
