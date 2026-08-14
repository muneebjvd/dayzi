import type { Metadata } from "next";
import { getProductsByCategory } from "@/data/products";
import CategoryPageClient from "@/components/CategoryPageClient";

export const metadata: Metadata = {
  title: "Body Care",
  description:
    "Discover the best body care products — body washes, scrubs, lotions, fragrances, shavers, and more. Shop on Amazon with Dayzi.",
};

const filters = [
  "All",
  "Cleansing",
  "Exfoliation",
  "Mitts & Gloves",
  "Brushes",
  "Shaving",
  "Moisturizers",
  "Fragrance",
  "Deodorant",
];

export default function BodyCarePage() {
  const products = getProductsByCategory("body-care");

  return (
    <CategoryPageClient
      products={products}
      filters={filters}
      categoryName="Body Care"
      categoryEmoji="🛁"
      description="Everything you need for soft, smooth & beautifully cared-for skin. From cleansing to fragrance, we've got you covered."
      gradient="from-pink-50 via-rose-50 to-fuchsia-50"
    />
  );
}
