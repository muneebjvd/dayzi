import Link from "next/link";
import { products } from "@/data/products";
import ProductGrid from "@/components/ProductGrid";
import type { Metadata } from "next";
import {
  KawaiiCatFaceBow,
  KawaiiHeart,
  KawaiiStar,
  KawaiiFlower,
  KawaiiSparkle,
  KawaiiRibbon,
  BackgroundDecorations,
} from "@/components/KawaiiDecorations";

export const metadata: Metadata = {
  title: "Dayzi – Your Beauty Finds ✨",
  description:
    "Discover the best beauty products for body care, skincare, and hair care. Cute, feminine product recommendations curated just for you.",
};

const categories = [
  {
    href: "/body-care",
    title: "🛁 Body Care",
    subtitle: "Everything for soft, smooth & beautiful skin",
    bg: "bg-[#ea5883]",
    border: "border-transparent",
    icon: "🛁",
    count: 29,
  },
  {
    href: "/skincare",
    title: "✨ Skincare",
    subtitle: "Cleanse, hydrate, protect & glow",
    bg: "bg-[#ea5883]",
    border: "border-transparent",
    icon: "✨",
    count: 21,
  },
  {
    href: "/hair-care",
    title: "💇 Hair Care",
    subtitle: "Healthy, shiny & beautiful hair",
    bg: "bg-[#ea5883]",
    border: "border-transparent",
    icon: "💇",
    count: 18,
  },
];

export default function HomePage() {
  const featuredSlugs = [
    // New products featured first
    "vaseline-petroleum-jelly",
    "parachute-coconut-hair-oil",
    "vaseline-lip-therapy-rosy",
    "korean-sunscreen-spf50-2pc",
    // Previously featured
    "glycolic-acid-exfoliating-toner",
    "shower-brush-long-handle",
    "johnsons-baby-lotion",
    "johnsons-baby-oil",
    "dove-pomegranate-shea-butter-scrub",
    "sol-de-janeiro-cheirosa-59",
    "sol-de-janeiro-cheirosa-68",
    "sol-de-janeiro-cheirosa-62",
    "skin1004-water-fit-sun-serum",
    "relief-sun-organic-korean-sunscreen",
    "gisou-honey-infused",
    "summer-fridays-lip-butter-balm",
    "laneige-lip-sleeping-mask",
  ];
  const featuredProducts = products.filter(p => featuredSlugs.includes(p.slug));

  return (
    <div className="relative min-h-screen">
      <BackgroundDecorations />

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="relative pt-10 pb-8 px-4 text-center overflow-hidden">
        {/* Soft background blob */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-pink-200/40 blur-3xl" />
          <div className="absolute top-20 right-0 w-64 h-64 rounded-full bg-violet-200/30 blur-3xl" />
          <div className="absolute top-20 left-0 w-48 h-48 rounded-full bg-blue-200/20 blur-3xl" />
        </div>

        {/* Floating decorations around hero */}
        <div className="relative inline-block">
          {/* Avatar circle */}
          <div className="relative mx-auto w-36 h-36 mb-6">
            <div className="absolute inset-0 rounded-full bg-[#ea5883] animate-sparkle" style={{ animationDuration: "3s" }} />
            <div className="absolute inset-1 rounded-full bg-white" />
            <div className="absolute inset-2 rounded-full flex items-center justify-center overflow-hidden">
              <img src="/profile.jpg" alt="Profile" className="w-full h-full object-cover" />
            </div>

            {/* Floating decorations around avatar */}
            <img src="/elements/hello-kitty-27934.png" className="absolute -top-4 -right-4 w-12 h-12 object-contain animate-float drop-shadow-md" style={{ animationDelay: "0.3s" }} />
            <img src="/elements/kindpng_144064.png" className="absolute -bottom-2 -left-6 w-14 h-14 object-contain animate-sparkle drop-shadow-md" style={{ animationDelay: "0.8s" }} />
            <img src="/elements/kindpng_3532689.png" className="absolute -top-2 -left-5 w-10 h-10 object-contain animate-float-reverse drop-shadow-md" style={{ animationDelay: "0.5s" }} />
            <img src="/elements/kindpng_995275.png" className="absolute bottom-0 -right-5 w-12 h-12 object-contain animate-sparkle drop-shadow-md" style={{ animationDelay: "1.1s" }} />
          </div>
        </div>

        {/* Brand name */}
        <h1 className="font-script text-6xl sm:text-7xl text-pink-500 leading-none mb-2 drop-shadow-sm">
          Dayzi
        </h1>
        <div className="flex items-center justify-center gap-2 mb-4">
          <KawaiiRibbon className="w-8 h-5 opacity-60" />
          <p className="text-neutral-600 font-medium text-sm sm:text-base">
            Your little corner for beauty finds
          </p>
          <KawaiiRibbon className="w-8 h-5 opacity-60" style={{ transform: "scaleX(-1)" }} />
        </div>

        {/* Tagline pills */}
        <div className="flex flex-wrap justify-center gap-2 max-w-sm mx-auto">
          {["🌸 Body Care", "✨ Skincare", "💇 Hair Care"].map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium px-3 py-1 rounded-full bg-white/80 border border-pink-200 text-pink-600 shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* ── Category Cards ──────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-neutral-800 mb-1">
            Shop by Category
          </h2>
          <p className="text-sm text-neutral-500">
            Find exactly what you need 🎀
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <Link
              key={cat.href}
              href={cat.href}
              id={`category-${cat.href.slice(1)}`}
              className={`group relative ${cat.bg} border ${cat.border} rounded-3xl p-4 text-center shadow-sm hover:shadow-lg transition-all duration-300 card-hover overflow-hidden`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Background decoration */}
              <div className={`absolute top-0 right-0 w-24 h-24 rounded-full bg-white opacity-10 -translate-y-8 translate-x-8 group-hover:opacity-20 transition-opacity`} />
              <div className={`absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white opacity-10 translate-y-6 -translate-x-4 group-hover:opacity-20 transition-opacity`} />

              {/* Icon circle */}
              <div
                className={`mx-auto mb-2 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}
              >
                <span className="text-xl" role="img" aria-hidden="true">
                  {cat.icon}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-1">
                {cat.title}
              </h3>
              <p className="text-xs text-white/80 leading-snug mb-2">
                {cat.subtitle}
              </p>

              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-xs text-white/80">
                  {cat.count} products
                </span>
                
                {/* Arrow */}
                <div
                  className={`inline-flex items-center gap-1 text-sm font-semibold text-white group-hover:gap-2 transition-all`}
                >
                  Shop now
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products ───────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-neutral-800 mb-1">
            Featured in recent video 📺
          </h2>
          <p className="text-sm text-neutral-500">
            Products you saw and loved 🎀
          </p>
        </div>
        <ProductGrid products={featuredProducts} columns={2} />
      </section>

      {/* ── Why Dayzi ───────────────────────────────────── */}
      <section className="bg-white/60 backdrop-blur-sm py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl font-bold text-neutral-800 mb-2">
            Why Dayzi? 🎀
          </h2>
          <p className="text-sm text-neutral-500 mb-8">
            Your curated beauty guide for discovering products you&apos;ll love
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: "💕",
                title: "Curated for You",
                desc: "Every product is handpicked for quality and effectiveness",
              },
              {
                icon: "🛍️",
                title: "Easy Amazon Links",
                desc: "Shop directly on Amazon with a single tap",
              },
              {
                icon: "🌸",
                title: "All Beauty Categories",
                desc: "Body care, skincare, and hair care in one place",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/80 border border-pink-100 shadow-sm"
              >
                <span className="text-3xl" role="img">
                  {item.icon}
                </span>
                <h3 className="font-semibold text-neutral-800 text-sm">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
