import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { workouts } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const results = await db.select().from(workouts).where(eq(workouts.userId, session.user.id)).orderBy(desc(workouts.createdAt));
  return NextResponse.json(results);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const result = await db.insert(workouts).values({
    userId: session.user.id,
    name: body.name || "Workout",
    goal: body.goal,
    equipment: JSON.stringify(body.equipment),
    level: body.level,
    days: body.days,
    sections: JSON.stringify(body.sections),
  }).returning();

  return NextResponse.json(result[0]);
}
