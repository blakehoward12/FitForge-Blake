"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// Public Meta Pixel ID (safe to expose — it's visible in the browser anyway).
const PIXEL_ID = "1019466564060703";

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  push: unknown;
  loaded: boolean;
  version: string;
};

/**
 * Meta (Facebook) browser Pixel — loaded and fired entirely from useEffect so
 * it is guaranteed to execute in the browser on mount, independent of any
 * SSR/next-script strategy quirks. Fires PageView on load and on every
 * client-side (SPA) route change. Pairs with the server-side Conversions API.
 */
export function MetaPixel() {
  const pathname = usePathname();
  const initialized = useRef(false);

  useEffect(() => {
    // First run: install the Meta Pixel base library, then fire the initial PageView.
    if (!initialized.current) {
      initialized.current = true;

      if (!window.fbq) {
        const n = function (...args: unknown[]) {
          n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
        } as Fbq;
        n.queue = [];
        n.push = n;
        n.loaded = true;
        n.version = "2.0";
        window.fbq = n;
        window._fbq = window._fbq || n;

        const script = document.createElement("script");
        script.async = true;
        script.src = "https://connect.facebook.net/en_US/fbevents.js";
        const first = document.getElementsByTagName("script")[0];
        first?.parentNode?.insertBefore(script, first);

        window.fbq("init", PIXEL_ID);
      }

      window.fbq("track", "PageView");
      return;
    }

    // Subsequent client-side navigations.
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
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}
