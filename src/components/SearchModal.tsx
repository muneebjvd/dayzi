"use client";

import { useState, useCallback, useMemo } from "react";
import { products as allProducts, searchProducts } from "@/data/products";
import { Product } from "@/types/product";
import Link from "next/link";
import Image from "next/image";

interface SearchModalProps {
  onClose: () => void;
}

const categoryBadgeColors: Record<string, string> = {
  "body-care": "bg-pink-100 text-pink-600",
  skincare: "bg-violet-100 text-violet-600",
  "hair-care": "bg-blue-100 text-blue-600",
};

const categoryGradients: Record<string, string> = {
  "body-care": "from-pink-200 to-rose-200",
  skincare: "from-violet-200 to-purple-200",
  "hair-care": "from-blue-200 to-indigo-200",
};

const suggested = [
  { label: "🛁 Body Care", query: "body care" },
  { label: "✨ Skincare", query: "skincare" },
  { label: "💇 Hair Care", query: "hair care" },
  { label: "🌿 Rosemary", query: "rosemary" },
  { label: "🍦 Vanilla", query: "vanilla" },
  { label: "🪒 Shaving", query: "shaving" },
  { label: "💧 Moisturizer", query: "moisturizer" },
  { label: "💋 Lip Care", query: "lip" },
];

function ProductRow({ product, onClose }: { product: Product; onClose: () => void }) {
  return (
    <li>
      <Link
        href={`/product/${product.slug}`}
        onClick={onClose}
        className="flex items-center gap-3 px-4 py-3 hover:bg-pink-50 transition-colors"
      >
        <div
          className="relative w-10 h-10 rounded-xl bg-[#ea5883] text-white flex items-center justify-center text-xl shrink-0 overflow-hidden"
        >
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="40px"
              className="object-contain p-1 bg-white"
            />
          ) : (
            product.emoji
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-neutral-800 line-clamp-1">
            {product.name}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-neutral-500">{product.brand}</span>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                categoryBadgeColors[product.category] || "bg-neutral-100 text-neutral-600"
              }`}
            >
              {product.subcategory}
            </span>
          </div>
        </div>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#f472b6"
          strokeWidth="2.5"
          className="shrink-0"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </Link>
    </li>
  );
}

export default function SearchModal({ onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");

  // When query is empty show ALL products; when typing, filter
  const results = useMemo(() => {
    if (!query.trim()) return allProducts;
    return searchProducts(query);
  }, [query]);

  const isFiltered = query.trim().length > 0;

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search products"
      className="fixed inset-0 z-50 flex flex-col"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative mt-0 md:mt-16 md:mx-auto md:w-full md:max-w-xl bg-white md:rounded-3xl shadow-2xl flex flex-col max-h-[95vh] md:max-h-[80vh] animate-fadeInUp">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-pink-100 shrink-0">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f472b6"
            strokeWidth="2.2"
            className="shrink-0"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            id="search-input"
            type="search"
            autoFocus
            placeholder="Search all 68 beauty products…"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 text-base text-neutral-800 placeholder-neutral-400 bg-transparent outline-none"
            aria-label="Search products"
          />
          {query && (
            <button
              onClick={() => handleSearch("")}
              className="shrink-0 p-1 rounded-full text-neutral-400 hover:text-pink-500 transition-colors"
              aria-label="Clear search"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
          <button
            onClick={onClose}
            className="shrink-0 px-3 py-1 text-sm text-neutral-500 hover:text-pink-500 font-medium transition-colors"
            aria-label="Close search"
          >
            Cancel
          </button>
        </div>

        {/* Suggested chips — only shown when typing */}
        {!isFiltered && (
          <div className="px-4 pt-3 pb-2 shrink-0 border-b border-pink-50">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">
              Quick filters
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {suggested.map((s) => (
                <button
                  key={s.query}
                  onClick={() => handleSearch(s.query)}
                  className="shrink-0 px-3 py-1.5 rounded-full bg-pink-50 text-pink-600 text-xs font-medium hover:bg-pink-100 transition-colors btn-tap"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results header */}
        <div className="px-4 py-2 border-b border-pink-50 shrink-0">
          <p className="text-xs text-neutral-500">
            {isFiltered ? (
              <>
                <span className="font-semibold text-pink-600">{results.length}</span> results
                for &ldquo;{query}&rdquo;
              </>
            ) : (
              <>
                All <span className="font-semibold text-pink-600">{results.length}</span> products
              </>
            )}
          </p>
        </div>

        {/* Product list */}
        <div className="overflow-y-auto flex-1">
          {results.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-neutral-600 font-medium">
                No products found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-neutral-400 text-sm mt-1">
                Try a different word or browse categories.
              </p>
              <button
                onClick={() => handleSearch("")}
                className="mt-4 px-4 py-2 rounded-full bg-pink-50 text-pink-600 text-sm font-medium hover:bg-pink-100 transition-colors"
              >
                Show all products
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-pink-50">
              {results.map((product) => (
                <ProductRow key={product.id} product={product} onClose={onClose} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
