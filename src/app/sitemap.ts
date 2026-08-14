import { products } from "@/data/products";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://dayzi.com";

  const productUrls = products.map((p) => ({
    url: `${base}/product/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/body-care`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/skincare`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/hair-care`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    ...productUrls,
  ];
}
