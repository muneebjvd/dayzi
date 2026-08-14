import { Product } from "@/types/product";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
  columns?: 1 | 2;
}

export default function ProductGrid({
  products,
  emptyMessage = "No products found.",
  columns = 1,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="text-5xl mb-4">🌸</div>
        <p className="text-neutral-500 font-medium">{emptyMessage}</p>
        <p className="text-neutral-400 text-sm mt-1">
          Try a different filter or search term.
        </p>
      </div>
    );
  }

  return (
    <div className={`${columns === 2 ? 'grid grid-cols-2' : 'flex flex-col'} w-full max-w-md mx-auto gap-4 px-4 sm:px-0`}>
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} priority={i < 4} layout={columns === 2 ? "grid" : "list"} />
      ))}
    </div>
  );
}
