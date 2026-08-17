"use client";

import { useEffect, useRef } from "react";
import { trackProductView } from "@/lib/gtag";

interface ProductViewTrackerProps {
  productName: string;
  productId: string;
  category: string;
}

/**
 * Fires a `product_view` GA4 event when a product page mounts.
 * Renders nothing visible.
 */
export default function ProductViewTracker({
  productName,
  productId,
  category,
}: ProductViewTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    trackProductView({
      product_name: productName,
      product_id: productId,
      category,
    });
  }, [productName, productId, category]);

  return null;
}
