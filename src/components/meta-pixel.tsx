"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// Public Meta Pixel ID (safe to expose — it's visible in the browser anyway).
const PIXEL_ID = "1019466564060703";

/**
 * The Meta Pixel base code (loader + initial PageView) lives in the document
 * <head> in app/layout.tsx, per Meta's install guidance. This component adds
 * the two things the raw snippet can't do on its own:
 *   1. Re-fire PageView on client-side (SPA) route changes.
 *   2. The <noscript> fallback pixel for JS-disabled visitors.
 *
 * Pairs with the server-side Conversions API (see lib/meta-capi.ts).
 */
export function MetaPixel() {
  const pathname = usePathname();
  const initialized = useRef(false);

  useEffect(() => {
    // The base code in <head> already sent the first PageView on load.
    if (!initialized.current) {
      initialized.current = true;
      return;
    }
    window.fbq?.("track", "PageView");
  }, [pathname]);

  return (
    <noscript>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        height="1"
        width="1"
        style={{ display: "none" }}
        alt=""
        src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
      />
    </noscript>
  );
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}
