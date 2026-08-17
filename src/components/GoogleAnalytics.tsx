"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { GA_ID, pageview } from "@/lib/gtag";

/**
 * Loads the GA4 script and tracks route changes.
 * Renders nothing visible. Only loads when GA_ID is configured.
 */
export default function GoogleAnalytics() {
  const pathname = usePathname();
  const lastPath = useRef("");

  useEffect(() => {
    if (!GA_ID) return;
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;
    pageview(pathname);
  }, [pathname]);

  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
            send_page_view: false
          });
        `}
      </Script>
    </>
  );
}
