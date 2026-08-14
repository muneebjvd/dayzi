import type { Metadata } from "next";
import { getProductsByCategory } from "@/data/products";
import CategoryPageClient from "@/components/CategoryPageClient";

export const metadata: Metadata = {
  title: "Skincare",
  description:
    "Discover the best skincare products — cleansers, sunscreens, serums, masks, eye care, and lip care. Shop on Amazon with Dayzi.",
};

const filters = [
  "All",
  "Tools",
  "Cleansing",
  "Sunscreen",
  "Exfoliation",
  "Masks",
  "Moisturizers",
  "Body Oil",
  "Eye Care",
  "Lip Care",
];

export default function SkincarePage() {
  const products = getProductsByCategory("skincare");

  return (
    <CategoryPageClient
      products={products}
      filters={filters}
      categoryName="Skincare"
      categoryEmoji="✨"
      description="Cleanse, hydrate, protect and glow. Your complete skincare routine starts here with products that work."
      gradient="from-violet-50 via-purple-50 to-pink-50"
    />
  );
}
