import type { Metadata } from "next";
import { getProductsByCategory } from "@/data/products";
import CategoryPageClient from "@/components/CategoryPageClient";

export const metadata: Metadata = {
  title: "Hair Care",
  description:
    "Discover the best hair care products — hair oils, shampoos, conditioners, brushes, and tools. Shop on Amazon with Dayzi.",
};

const filters = [
  "All",
  "Oils",
  "Leave-In",
  "Tools",
  "Brushes",
  "Shampoo",
  "Conditioner",
];

export default function HairCarePage() {
  const products = getProductsByCategory("hair-care");

  return (
    <CategoryPageClient
      products={products}
      filters={filters}
      categoryName="Hair Care"
      categoryEmoji="💇"
      description="Achieve healthy, shiny and beautiful hair with our curated selection of oils, treatments, shampoos, and styling tools."
      gradient="from-blue-50 via-indigo-50 to-purple-50"
    />
  );
}
