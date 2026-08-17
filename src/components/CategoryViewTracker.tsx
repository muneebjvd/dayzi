"use client";

import { useEffect, useRef } from "react";
import { trackCategoryView } from "@/lib/gtag";

interface CategoryViewTrackerProps {
  category: string;
}

/**
 * Fires a `category_view` GA4 event when a category page mounts.
 * Renders nothing visible.
 */
export default function CategoryViewTracker({
  category,
}: CategoryViewTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    trackCategoryView({ category });
  }, [category]);

  return null;
}
