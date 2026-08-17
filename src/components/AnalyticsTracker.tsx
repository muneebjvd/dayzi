"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTracked = useRef("");

  useEffect(() => {
    // Avoid double-tracking the same path
    if (pathname === lastTracked.current) return;
    lastTracked.current = pathname;

    // Send the page view to our API
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        referrer: document.referrer || "",
      }),
    }).catch(() => {
      // silently fail — analytics should never break the site
    });
  }, [pathname]);

  return null; // renders nothing
}
