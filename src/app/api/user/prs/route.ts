import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { personalRecords } from "@/lib/schema";
import { eq, and, desc } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const results = await db.select().from(personalRecords)
    .where(eq(personalRecords.userId, session.user.id))
    .orderBy(desc(personalRecords.recordedAt));

  return NextResponse.json(results);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const existing = await db.select().from(personalRecords)
    .where(and(
      eq(personalRecords.userId, session.user.id),
      eq(personalRecords.exerciseName, body.exerciseName)
    )).get();

  if (existing && body.weight > existing.weight) {
    await db.update(personalRecords).set({
      weight: body.weight,
      reps: body.reps,
      recordedAt: new Date().toISOString(),
    }).where(eq(personalRecords.id, existing.id));
  } else if (!existing) {
    await db.insert(personalRecords).values({
      userId: session.user.id,
      exerciseName: body.exerciseName,
      weight: body.weight,
      reps: body.reps,
    });
  }

  return NextResponse.json({ ok: true });
}
