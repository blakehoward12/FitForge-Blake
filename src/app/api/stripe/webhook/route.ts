import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { sendMetaEvent } from "@/lib/meta-capi";

export async function POST(req: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey || !webhookSecret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const stripe = new Stripe(stripeSecretKey);
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;

    if (userId) {
      await db.update(users).set({ isPremium: true }).where(eq(users.id, userId));
    }

    // Server-side Purchase event (Meta Conversions API).
    // event_id = session.id so it de-dupes against a browser pixel if added later.
    const email = session.customer_email ?? session.customer_details?.email ?? null;
    const value =
      session.amount_total != null ? (session.amount_total / 100).toFixed(2) : undefined;
    await sendMetaEvent({
      eventName: "Purchase",
      eventId: session.id,
      actionSource: "website",
      user: { email },
      customData: value
        ? { currency: (session.currency ?? "usd").toUpperCase(), value }
        : undefined,
    });
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerEmail = typeof subscription.customer === "string"
      ? null
      : null;

    // For cancellations, we'd need to look up by Stripe customer ID
    // For now, handle via checkout.session.completed metadata
    if (customerEmail) {
      // Future: look up user by email and set isPremium = false
    }
  }

  return NextResponse.json({ received: true });
}
