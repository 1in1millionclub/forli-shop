"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
// import { Collection } from '@/lib/shopify/types';
import { SidebarLinks } from "@/components/layout/sidebar/product-sidebar-links";
import { FormattedCollection } from "@/lib/ecommerce/types-sample";
import Link from "next/link";
import { useFilterCount } from "../hooks/use-filter-count";
import { useProducts } from "../providers/products-provider";
import { CategoryFilter } from "./category-filter";
import { ColorFilter } from "./color-filter";

export function DesktopFilters({
  collections,
  className,
}: {
  collections: FormattedCollection[];
  className?: string;
}) {
  const { originalProducts } = useProducts();
  const filterCount = useFilterCount();

  return (
    <aside
      className={cn(
        "grid sticky top-0 grid-cols-3 h-screen min-h-max pl-sides pt-top-spacing",
        className
      )}
    >
      <div className="flex flex-col col-span-3 xl:col-span-2 gap-4">
        <div className="flex justify-between items-baseline pl-2 -mb-2">
          <h2 className="text-2xl font-semibold">
            Filter{" "}
            {filterCount > 0 && (
              <span className="text-foreground/50">({filterCount})</span>
            )}
          </h2>
          <Button
            size={"sm"}
            variant="ghost"
            aria-label="Clear all filters"
            className="font-medium text-foreground/50 hover:text-foreground/60"
            asChild
          >
            <Link href="/shop" prefetch>
              Clear
            </Link>
          </Button>
        </div>
        <Suspense fallback={null}>
          <CategoryFilter collections={collections} />
          <ColorFilter products={originalProducts} />
        </Suspense>
      </div>

      <div className="col-span-3 self-end">
        <SidebarLinks className="flex-col-reverse py-sides" size="sm" />
      </div>
    </aside>
  );
}
