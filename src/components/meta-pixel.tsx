import { MetaPixelPageView } from "./meta-pixel-pageview";

// Public Meta Pixel ID (safe to expose — it's in the browser anyway).
const PIXEL_ID = "1019466564060703";

/**
 * Meta (Facebook) Pixel base code — Meta's standard snippet, verbatim, as a
 * plain inline <script> (NOT next/script) so it's in the SSR HTML and runs on
 * first paint. Mounted once in the root layout, so it's on every route.
 *
 * <MetaPixelPageView /> re-fires PageView on client-side (SPA) navigations,
 * which the base snippet alone does not do. Pairs with the server-side
 * Conversions API (see lib/meta-capi.ts).
 */
export function MetaPixel() {
  const code = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');fbq('track','PageView');`;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: code }} />
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
      <MetaPixelPageView />
    </>
  );
}
