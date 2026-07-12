"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// Public Meta Pixel ID (safe to expose — it's visible in the browser anyway).
const PIXEL_ID = "1019466564060703";

/**
 * Meta (Facebook) browser Pixel. Loads fbevents.js once, fires the initial
 * PageView, then re-fires PageView on client-side route changes (a raw snippet
 * only fires on hard loads, missing SPA navigations).
 *
 * Pairs with the server-side Conversions API (see lib/meta-capi.ts); the CAPI
 * Purchase event uses event_id = Stripe session id for browser<>server dedup.
 */
export function MetaPixel() {
  const pathname = usePathname();
  const initialized = useRef(false);

  useEffect(() => {
    // The inline script below already sends the first PageView on load.
    if (!initialized.current) {
      initialized.current = true;
      return;
    }
    window.fbq?.("track", "PageView");
  }, [pathname]);

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');fbq('track','PageView');`}
      </Script>
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
    </>
  );
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}
