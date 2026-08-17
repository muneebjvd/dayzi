/**
 * Dev-only Amazon affiliate link validation.
 *
 * Checks that every detected Amazon link contains the expected affiliate tag.
 * Never runs in production.
 */

const EXPECTED_TAG = "muneebjaved-20";

export function validateAffiliateLink(href: string): void {
  if (process.env.NODE_ENV !== "development") return;

  const isAmazon =
    href.includes("amazon.com") ||
    href.includes("amzn.to") ||
    href.includes("amzn.com");

  if (!isAmazon) return;

  // Short links (amzn.to) already have the tag baked into the redirect
  if (href.includes("amzn.to/")) {
    console.log(
      `%c✅ Amazon short link detected%c — ${href}`,
      "color:#10b981;font-weight:700",
      "color:inherit"
    );
    return;
  }

  if (href.includes(`tag=${EXPECTED_TAG}`)) {
    console.log(
      `%c✅ Amazon affiliate link%c — tag=${EXPECTED_TAG}`,
      "color:#10b981;font-weight:700",
      "color:inherit"
    );
  } else {
    console.warn(
      `%c⚠️ Amazon link MISSING affiliate tag%c — Expected tag=${EXPECTED_TAG}\n   URL: ${href}`,
      "color:#f59e0b;font-weight:700",
      "color:inherit"
    );
  }
}
