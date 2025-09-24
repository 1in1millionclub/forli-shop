// import { Collection, Product } from '@/lib/shopify/types';
import { Collection, FormattedProduct } from "@/lib/ecommerce/types-sample";
import { cn } from "@/lib/utils";
import { ResultsCount } from "./results-count";
import { ShopBreadcrumb } from "./shop-breadcrumb";
import { SortDropdown } from "./sort-dropdown";

export default function ResultsControls({
  collections,
  products,
  className,
}: {
  collections: Pick<Collection, "handle" | "title">[];
  products: FormattedProduct[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-3 items-center mb-1 w-full pr-sides",
        className
      )}
    >
      {/* Breadcrumb */}
      <ShopBreadcrumb collections={collections} className="ml-1" />

      {/* Results count */}
      <ResultsCount count={products.length} />

      {/* Sort dropdown */}
      <SortDropdown />
    </div>
  );
}
