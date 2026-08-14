"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Product } from "@/types/product";
import ProductGrid from "@/components/ProductGrid";
import FilterChips from "@/components/FilterChips";
import BackgroundStickers from "@/components/BackgroundStickers";

interface CategoryPageClientProps {
  products: Product[];
  filters: string[];
  categoryName: string;
  categoryEmoji: string;
  description: string;
  gradient: string;
}

export default function CategoryPageClient({
  products,
  filters,
  categoryName,
  categoryEmoji,
  description,
  gradient,
}: CategoryPageClientProps) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsScrolledDown(true);
      } else {
        setIsScrolledDown(false);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: products.length };
    products.forEach((p) => {
      // Find the matching filter string for this subcategory
      const normalizedSub = p.subcategory.toLowerCase().replace(/-/g, " ");
      const matchingFilter = filters.find(f => f.toLowerCase().replace(/-/g, " ") === normalizedSub) || p.subcategory;
      c[matchingFilter] = (c[matchingFilter] || 0) + 1;
    });
    return c;
  }, [products, filters]);

  const filtered = useMemo(() => {
    let list = products;
    if (activeFilter !== "All") {
      const normalizedFilter = activeFilter.toLowerCase().replace(/-/g, " ");
      list = list.filter((p) => p.subcategory.toLowerCase().replace(/-/g, " ") === normalizedFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [products, activeFilter, searchQuery]);

  return (
    <div>
      {/* Hero section */}
      <div className="bg-[#ea5883] py-10 px-4 relative overflow-hidden">
        {/* Decorative elements */}
        <img src="/elements/kindpng_6073979.png" className="absolute top-4 left-4 w-12 h-12 object-contain opacity-80" aria-hidden="true" />
        <img src="/elements/kindpng_7661643.png" className="absolute bottom-4 right-8 w-14 h-14 object-contain opacity-80" aria-hidden="true" />

        <div className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">
          <div className="text-5xl mb-3" role="img" aria-label={categoryName}>
            {categoryEmoji}
          </div>
          <h1 className="text-3xl font-bold text-neutral-800 mb-2">
            {categoryName}
          </h1>
          <p className="text-neutral-600 max-w-md mx-auto text-sm leading-relaxed">
            {description}
          </p>
          <div className="mt-4 inline-block bg-white/70 backdrop-blur rounded-full px-3 py-1 text-xs text-neutral-600 font-medium">
            {products.length} products
          </div>
        </div>
      </div>

      {/* Filters + Search */}
      <div 
        className={`sticky z-30 bg-white/95 backdrop-blur-md border-b border-pink-100 shadow-sm transition-transform duration-300 ${
          isScrolledDown ? "-translate-y-full top-0" : "translate-y-0 top-14"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 space-y-3">
          {/* Search within category */}
          <div className="flex items-center gap-2 bg-pink-50 rounded-2xl px-3 py-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              id={`search-${categoryName.toLowerCase().replace(/\s+/g, "-")}`}
              type="search"
              placeholder={`Search in ${categoryName}…`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-neutral-700 placeholder-neutral-400 outline-none"
              aria-label={`Search within ${categoryName}`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-neutral-400 hover:text-pink-500"
                aria-label="Clear search"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Filter chips */}
        <FilterChips
          filters={filters}
          active={activeFilter}
          onChange={setActiveFilter}
          counts={counts}
        />
      </div>

      {/* Product grid */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4 min-h-[32px]">
          {filtered.length !== products.length ? (
            <p className="text-sm text-neutral-500">
              Showing{" "}
              <span className="font-semibold text-pink-600">{filtered.length}</span>{" "}
              of {products.length} products
            </p>
          ) : (
            <div />
          )}

          <button
            onClick={() => setViewMode(v => v === 'grid' ? 'list' : 'grid')}
            className="flex items-center justify-center p-2 rounded-full bg-pink-50 text-pink-500 hover:bg-pink-100 transition-colors"
            aria-label="Toggle view mode"
          >
            {viewMode === 'grid' ? (
              // List icon to switch to list
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
            ) : (
              // Grid icon to switch to grid
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect></svg>
            )}
          </button>
        </div>

        <ProductGrid
          products={filtered}
          columns={viewMode === 'grid' ? 2 : 1}
          emptyMessage={`No ${activeFilter === "All" ? "" : activeFilter + " "}products found.`}
        />
      </div>
    </div>
  );
}
