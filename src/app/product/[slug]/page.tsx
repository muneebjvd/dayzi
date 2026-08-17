import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getRelatedProducts, products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import ProductViewTracker from "@/components/ProductViewTracker";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | Dayzi`,
      description: product.description,
      type: "website",
    },
  };
}

const categoryLabels: Record<string, string> = {
  "body-care": "🛁 Body Care",
  skincare: "✨ Skincare",
  "hair-care": "💇 Hair Care",
};

const placeholderGradients: Record<string, string> = {
  "body-care": "from-pink-200 via-rose-100 to-pink-300",
  skincare: "from-violet-200 via-purple-100 to-pink-200",
  "hair-care": "from-blue-200 via-indigo-100 to-purple-200",
};

const categoryBadgeColors: Record<string, string> = {
  "body-care": "bg-pink-100 text-pink-600 border-pink-200",
  skincare: "bg-violet-100 text-violet-600 border-violet-200",
  "hair-care": "bg-blue-100 text-blue-600 border-blue-200",
};

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product, 4);
  const gradientClass = placeholderGradients[product.category] || "from-pink-200 via-rose-100 to-pink-300";
  const badgeClass = categoryBadgeColors[product.category] || "bg-neutral-100 text-neutral-600";

  return (
    <div className="min-h-screen">
      <ProductViewTracker
        productName={product.name}
        productId={product.id}
        category={product.category}
      />
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="max-w-6xl mx-auto px-4 pt-4 pb-2">
        <ol className="flex items-center gap-1 text-xs text-neutral-400 flex-wrap">
          <li>
            <Link href="/" className="hover:text-pink-500 transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={`/${product.category}`}
              className="hover:text-pink-500 transition-colors"
            >
              {categoryLabels[product.category]}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-neutral-600 font-medium line-clamp-1">{product.name}</li>
        </ol>
      </nav>

      {/* Product detail */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-3xl shadow-sm border border-pink-100 overflow-hidden">
          <div className="md:flex">
            {/* Image */}
            <div className={`md:w-96 md:shrink-0 relative ${product.image ? "bg-white" : "bg-[#ea5883]"} flex flex-col items-center justify-center min-h-64 overflow-hidden`}>
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain p-6 min-h-[280px] max-h-[360px]"
                  loading="eager"
                />
              ) : (
                <>
                  <span className="text-8xl mb-4" role="img" aria-label={product.name}>
                    {product.emoji}
                  </span>
                  <span className="text-sm font-semibold text-white/80 bg-white/20 rounded-full px-4 py-1 backdrop-blur-sm">
                    {product.brand}
                  </span>
                </>
              )}
            </div>


            {/* Info */}
            <div className="flex-1 p-6 md:p-8">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className={`text-xs font-semibold border rounded-full px-3 py-1 ${badgeClass}`}
                >
                  {categoryLabels[product.category]}
                </span>
                <span className="text-xs font-medium border border-neutral-200 text-neutral-600 rounded-full px-3 py-1">
                  {product.subcategory}
                </span>
              </div>

              {/* Name */}
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800 leading-snug mb-2">
                {product.name}
              </h1>

              {/* Brand */}
              <p className="text-base text-neutral-500 font-medium mb-4">
                by{" "}
                <span className="text-pink-600 font-semibold">{product.brand}</span>
              </p>

              {/* Description */}
              <p className="text-neutral-600 text-sm leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Tags */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">
                  Related searches
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {product.tags.slice(0, 6).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-pink-50 text-pink-600 border border-pink-100 rounded-full px-2.5 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <a
                id={`product-page-shop-btn-${product.id}`}
                href={product.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#ea5883] text-white font-bold text-base hover:bg-pink-600 transition-all btn-tap shadow-lg shadow-pink-200"
                aria-label={`Shop ${product.name} on Amazon`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Shop on Amazon →
              </a>

              <p className="text-xs text-neutral-400 mt-3">
                *As an Amazon Associate, I earn from qualifying purchases.
              </p>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-neutral-800 mb-2">
              You might also love 💕
            </h2>
            <p className="text-sm text-neutral-500 mb-6">
              More products you&apos;ll enjoy
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link
            href={`/${product.category}`}
            className="inline-flex items-center gap-2 text-sm text-pink-600 font-medium hover:text-pink-700 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to {categoryLabels[product.category]}
          </Link>
        </div>
      </div>
    </div>
  );
}
