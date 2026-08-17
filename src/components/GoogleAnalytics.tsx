"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { GA_ID, pageview } from "@/lib/gtag";

/**
 * Loads the GA4 script exactly as Google provides it.
 * Tracks SPA route changes manually without double-firing on initial load.
 */
export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPath = useRef("");

  useEffect(() => {
    if (!GA_ID) return;
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    
    // The initial page load is tracked automatically by the config script below.
    if (lastPath.current === "") {
      lastPath.current = url;
      return;
    }
    
    if (url === lastPath.current) return;
    lastPath.current = url;
    pageview(url);
  }, [pathname, searchParams]);

  if (!GA_ID) return null;

  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `
        }}
      />
    </>
  );
}
