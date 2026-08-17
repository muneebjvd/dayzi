"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { GA_ID, pageview } from "@/lib/gtag";

/**
 * Tracks SPA route changes.
 * The actual GA scripts are statically injected in layout.tsx.
 */
export default function GoogleAnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPath = useRef("");

  useEffect(() => {
    if (!GA_ID) return;
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    
    // The initial page load is tracked automatically by the config script in layout.tsx.
    if (lastPath.current === "") {
      lastPath.current = url;
      return;
    }
    
    if (url === lastPath.current) return;
    lastPath.current = url;
    pageview(url);
  }, [pathname, searchParams]);

  return null;
}
