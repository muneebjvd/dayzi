/**
 * Google Analytics 4 — core utility
 *
 * All GA4 interactions are funnelled through this module so that:
 *   1. The Measurement ID lives in one place (env var).
 *   2. Every event is debug-logged in development.
 *   3. Production console stays clean.
 */

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

const isDev = process.env.NODE_ENV === "development";

/* ------------------------------------------------------------------ */
/*  Low-level helpers                                                  */
/* ------------------------------------------------------------------ */

/** Push a gtag command. No-ops if gtag hasn't loaded yet. */
function gtag(...args: unknown[]) {
  if (typeof window === "undefined") return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).dataLayer = (window as any).dataLayer || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).dataLayer.push(args);
}

/** Debug-log an event in development only. */
function devLog(eventName: string, params?: Record<string, unknown>) {
  if (!isDev) return;
  console.log(
    `%c[GA4] %c${eventName}%c fired`,
    "color:#8b5cf6;font-weight:700",
    "color:#ec4899;font-weight:700",
    "color:inherit",
    params ?? ""
  );
}

/* ------------------------------------------------------------------ */
/*  Page view                                                          */
/* ------------------------------------------------------------------ */

export function pageview(url: string) {
  if (!GA_ID) return;
  gtag("config", GA_ID, {
    page_path: url,
  });
  devLog("page_view", { page_path: url });
}

/* ------------------------------------------------------------------ */
/*  Generic event                                                      */
/* ------------------------------------------------------------------ */

export function event(
  action: string,
  params: Record<string, unknown> = {}
) {
  if (!GA_ID) {
    devLog(action + " (skipped — no GA_ID)", params);
    return;
  }
  gtag("event", action, params);
  devLog(action, params);
}

/* ------------------------------------------------------------------ */
/*  Domain-specific events                                             */
/* ------------------------------------------------------------------ */

export interface AmazonClickParams {
  product_name: string;
  product_id: string;
  amazon_url: string;
  category: string;
  page_path: string;
  link_location: string;
}

export function trackAmazonClick(params: AmazonClickParams) {
  event("amazon_affiliate_click", {
    ...params,
    transport_type: "beacon", // reliable delivery before navigation
  });
}

export interface ProductViewParams {
  product_name: string;
  product_id: string;
  category: string;
}

export function trackProductView(params: ProductViewParams) {
  event("product_view", { ...params });
}

export interface ProductSearchParams {
  search_term: string;
  results_count: number;
}

export function trackProductSearch(params: ProductSearchParams) {
  event("product_search", { ...params });
}

export interface CategoryViewParams {
  category: string;
}

export function trackCategoryView(params: CategoryViewParams) {
  event("category_view", { ...params });
}
