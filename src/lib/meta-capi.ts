import crypto from "node:crypto";

// Meta Conversions API (server-side pixel).
// Docs: https://developers.facebook.com/docs/marketing-api/conversions-api
const GRAPH_VERSION = process.env.META_GRAPH_VERSION || "v21.0";

/** SHA-256 hash a PII value per Meta's normalization rules (trim + lowercase). */
function hashPii(value: string | null | undefined): string | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

type MetaUserData = {
  email?: string | null;
  phone?: string | null;
  clientIp?: string | null;
  userAgent?: string | null;
  /** _fbp browser cookie, if forwarded from the client. */
  fbp?: string | null;
  /** _fbc browser cookie / fbclid, if forwarded from the client. */
  fbc?: string | null;
};

type MetaEvent = {
  eventName: string;
  /** Stable id for browser<>server dedup (e.g. the Stripe session id). */
  eventId?: string;
  /** Unix seconds. Defaults to now. */
  eventTime?: number;
  eventSourceUrl?: string;
  actionSource?: "website" | "app" | "phone_call" | "chat" | "email" | "system_generated" | "other";
  user: MetaUserData;
  customData?: Record<string, unknown>;
};

/**
 * Send a single event to the Meta Conversions API.
 * No-ops (and warns once) if META_PIXEL_ID / META_CAPI_TOKEN aren't set, so
 * missing config never breaks the calling request (e.g. Stripe webhooks).
 */
export async function sendMetaEvent(event: MetaEvent): Promise<void> {
  const pixelId = process.env.META_PIXEL_ID;
  const token = process.env.META_CAPI_TOKEN;
  if (!pixelId || !token) {
    console.warn("[meta-capi] skipped: META_PIXEL_ID / META_CAPI_TOKEN not configured");
    return;
  }

  const user_data: Record<string, unknown> = {};
  const em = hashPii(event.user.email);
  if (em) user_data.em = [em];
  const ph = hashPii(event.user.phone);
  if (ph) user_data.ph = [ph];
  if (event.user.clientIp) user_data.client_ip_address = event.user.clientIp;
  if (event.user.userAgent) user_data.client_user_agent = event.user.userAgent;
  if (event.user.fbp) user_data.fbp = event.user.fbp;
  if (event.user.fbc) user_data.fbc = event.user.fbc;

  const payload = {
    data: [
      {
        event_name: event.eventName,
        event_time: event.eventTime ?? Math.floor(Date.now() / 1000),
        action_source: event.actionSource ?? "website",
        ...(event.eventId ? { event_id: event.eventId } : {}),
        ...(event.eventSourceUrl ? { event_source_url: event.eventSourceUrl } : {}),
        user_data,
        ...(event.customData ? { custom_data: event.customData } : {}),
      },
    ],
    ...(process.env.META_TEST_EVENT_CODE ? { test_event_code: process.env.META_TEST_EVENT_CODE } : {}),
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    if (!res.ok) {
      const text = await res.text();
      console.error("[meta-capi] event rejected", res.status, text);
    }
  } catch (err) {
    console.error("[meta-capi] send failed", err);
  }
}
