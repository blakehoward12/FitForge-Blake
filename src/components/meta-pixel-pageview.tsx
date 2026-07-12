"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Re-fires Meta Pixel PageView on client-side (SPA) route changes. The base
 * snippet in <MetaPixel /> only fires PageView on the initial hard load; in a
 * Next.js SPA, navigating between routes does not reload the page, so without
 * this only one PageView would ever be recorded.
 *
 * Uses pathname only (not useSearchParams) to avoid the Suspense requirement
 * that would otherwise de-opt static pages.
 */
export function MetaPixelPageView() {
  const pathname = usePathname();
  const initialized = useRef(false);

  useEffect(() => {
    // The base snippet already fired the first PageView on load.
    if (!initialized.current) {
      initialized.current = true;
      return;
    }
    window.fbq?.("track", "PageView");
  }, [pathname]);

  return null;
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}
