"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackAmazonClick } from "@/lib/gtag";
import { validateAffiliateLink } from "@/lib/validateAffiliateLinks";

/**
 * Global Amazon affiliate click tracker using event delegation.
 *
 * Listens for clicks on any <a> tag whose href points to Amazon or amzn.to.
 * Fires an `amazon_affiliate_click` GA4 event with product metadata.
 *
 * — Never modifies the original URL.
 * — Never removes or replaces the affiliate tag.
 * — Uses beacon transport so the event sends before navigation.
 * — Renders nothing visible.
 */

function isAmazonUrl(href: string): boolean {
  return (
    href.includes("amazon.com") ||
    href.includes("amzn.to") ||
    href.includes("amzn.com")
  );
}

/**
 * Determine the link_location based on the page path and DOM context.
 */
function getLinkLocation(anchor: HTMLAnchorElement, pathname: string): string {
  // Check if it's the product page CTA button
  const id = anchor.id || "";
  if (id.startsWith("product-page-shop-btn")) return "product_page";

  // Check parent context for product cards
  const card = anchor.closest("[class*='ProductCard'], [class*='product-card']");
  if (card) return "product_card";

  // Derive from page path
  if (pathname === "/") return "homepage";
  if (pathname.startsWith("/body-care")) return "category_page";
  if (pathname.startsWith("/skincare")) return "category_page";
  if (pathname.startsWith("/hair-care")) return "category_page";
  if (pathname.startsWith("/product/")) return "product_page";

  return "other";
}

/**
 * Extract product info from the surrounding DOM context.
 */
function getProductInfo(anchor: HTMLAnchorElement): {
  name: string;
  id: string;
  category: string;
} {
  // Try to get product ID from the anchor's own id attribute
  // e.g., "product-page-shop-btn-p-1" → "p-1"
  const anchorId = anchor.id || "";
  let productId = "";
  const idMatch = anchorId.match(/product-page-shop-btn-(.+)/);
  if (idMatch) {
    productId = idMatch[1];
  }

  // Try to find product name from nearby heading or aria-label
  const ariaLabel = anchor.getAttribute("aria-label") || "";
  let productName = "";

  // "Shop Johnson's Baby Oil on Amazon" → "Johnson's Baby Oil"
  const shopMatch = ariaLabel.match(/^Shop (.+) on Amazon$/);
  if (shopMatch) {
    productName = shopMatch[1];
  }

  // Fallback: look for a heading in the same container
  if (!productName) {
    const container = anchor.closest("div");
    if (container) {
      const heading = container.querySelector("h1, h2, h3");
      if (heading) {
        productName = heading.textContent?.trim() || "";
      }
    }
  }

  // Fallback: use the link text itself
  if (!productName) {
    productName = anchor.textContent?.trim() || "Unknown";
  }

  // Derive category from current path
  const path = window.location.pathname;
  let category = "";
  if (path.includes("body-care")) category = "Body Care";
  else if (path.includes("skincare")) category = "Skincare";
  else if (path.includes("hair-care")) category = "Hair Care";

  return { name: productName, id: productId, category };
}

export default function AmazonLinkTracker() {
  const pathname = usePathname();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      // Walk up from the click target to find an <a> tag
      const target = e.target as HTMLElement;
      const anchor = target.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.href || "";
      if (!isAmazonUrl(href)) return;

      // Dev-only: validate affiliate tag
      validateAffiliateLink(href);

      // Extract product context
      const productInfo = getProductInfo(anchor);
      const linkLocation = getLinkLocation(anchor, pathname);

      // Fire GA4 event — uses beacon transport for reliable delivery
      trackAmazonClick({
        product_name: productInfo.name,
        product_id: productInfo.id,
        amazon_url: href,
        category: productInfo.category,
        page_path: pathname,
        link_location: linkLocation,
      });
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [pathname]);

  return null;
}
