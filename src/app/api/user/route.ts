import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.select().from(users).where(eq(users.id, session.user.id)).get();
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

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
