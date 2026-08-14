"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  layout?: "list" | "grid";
}

export default function ProductCard({ product, priority = false, layout = "list" }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const showRealImage = product.image && !imgError;

  // Simple hash to deterministically pick kitties
  const hash = product.slug.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const kitties = [
    "hello-kitty-27934.png",
    "kindpng_106698.png",
    "kindpng_144064.png",
    "kindpng_1768849.png",
    "kindpng_3532689.png",
    "kindpng_6073979.png",
    "kindpng_7661643.png",
    "kindpng_995275.png"
  ];
  const kittyLeft = kitties[hash % kitties.length];
  const kittyRight = kitties[(hash + 1) % kitties.length];

  return (
    <div className="relative isolate pt-4">
      {/* Decorative Kitty Left */}
      <img
        src={`/elements/${kittyLeft}`}
        alt="Hello Kitty Decoration"
        className="absolute -top-1 -left-2 w-10 h-10 object-contain z-10 select-none pointer-events-none drop-shadow-sm"
      />
      {/* Decorative Kitty Right */}
      <img
        src={`/elements/${kittyRight}`}
        alt="Hello Kitty Decoration"
        className="absolute -bottom-1 -right-2 w-10 h-10 object-contain z-10 select-none pointer-events-none drop-shadow-sm"
      />

      <Link
        href={`/product/${product.slug}`}
        className={`group relative flex ${layout === 'grid' ? 'flex-col p-4 gap-3' : 'items-center p-2'} bg-[#ea5883] rounded-[24px] shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 w-full z-0 border border-white/10`}
      >
        {/* Circle Image Container */}
        <div className={`relative shrink-0 bg-white rounded-full flex items-center justify-center overflow-hidden ${layout === 'grid' ? 'w-20 h-20 mx-auto' : 'w-14 h-14'}`}>
          {showRealImage ? (
            <Image
              src={product.image!}
              alt={product.name}
              fill
              sizes={layout === 'grid' ? "80px" : "56px"}
              className="object-contain p-1.5 group-hover:scale-105 transition-transform duration-300"
              onError={() => setImgError(true)}
              priority={priority}
            />
          ) : (
            <span className="text-3xl drop-shadow-sm group-hover:scale-110 transition-transform duration-200" role="img" aria-label={product.name}>
              {product.emoji}
            </span>
          )}
        </div>

        {/* Product Name */}
        <div className={`flex-1 flex justify-center items-center ${layout === 'grid' ? 'px-0' : 'px-4'}`}>
          <h3 className={`font-medium text-white text-center leading-snug line-clamp-2 ${layout === 'grid' ? 'text-xs' : 'text-[15px] pr-4'}`}>
            {product.name}
          </h3>
        </div>
        
        {/* Invisible spacer to balance the flex centering if needed, but pr-4 works */}
        {layout === 'list' && <div className="w-10 shrink-0 opacity-0" aria-hidden="true" />}
      </Link>
    </div>
  );
}
