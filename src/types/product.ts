export type ProductCategory = "body-care" | "skincare" | "hair-care";

export type BodyCareSubcategory =
  | "Cleansing"
  | "Exfoliation"
  | "Mitts & Gloves"
  | "Brushes"
  | "Shaving"
  | "Moisturizers"
  | "Fragrance"
  | "Deodorant";

export type SkincareSubcategory =
  | "Tools"
  | "Cleansing"
  | "Sunscreen"
  | "Exfoliation"
  | "Masks"
  | "Moisturizers"
  | "Body Oil"
  | "Eye Care"
  | "Lip Care";

export type HairCareSubcategory =
  | "Oils"
  | "Leave-In"
  | "Tools"
  | "Brushes"
  | "Shampoo"
  | "Conditioner";

export type ProductSubcategory =
  | BodyCareSubcategory
  | SkincareSubcategory
  | HairCareSubcategory;

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: ProductCategory;
  subcategory: ProductSubcategory;
  tags: string[];
  affiliateUrl: string;
  image: string | null;
  description: string;
  emoji: string;
}
