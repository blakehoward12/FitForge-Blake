import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import Stripe from "stripe";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized - please sign in first" }, { status: 401 });
    }

    // Meta match signals captured browser-side (the webhook, fired by Stripe,
    // can't see these). Stashed in session metadata, read back in the webhook.
    let fbp: string | undefined;
    let fbc: string | undefined;
    try {
      const body = await req.json();
      if (typeof body?.fbp === "string") fbp = body.fbp;
      if (typeof body?.fbc === "string") fbc = body.fbc;
    } catch {
      // no/invalid body — fine, these are optional
    }
    const userAgent = req.headers.get("user-agent") ?? undefined;
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined;

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    }

    const stripe = new Stripe(stripeSecretKey);

    const priceId = process.env.STRIPE_PRICE_ID;
    if (!priceId) {
      return NextResponse.json({ error: "Stripe price not configured" }, { status: 500 });
    }

    // Build the app URL correctly
    const appUrl = process.env.NEXT_PUBLIC_APP_URL
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
      || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null)
      || "http://localhost:3000";

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: session.user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/premium`,
      metadata: {
        userId: session.user.id,
        // Meta CAPI match signals (Stripe metadata values are capped at 500 chars).
        ...(fbp ? { fbp } : {}),
        ...(fbc ? { fbc } : {}),
        ...(userAgent ? { fbUserAgent: userAgent.slice(0, 490) } : {}),
        ...(clientIp ? { fbClientIp: clientIp } : {}),
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
