// import { storeCatalog } from '@/lib/shopify/constants';
import { storeCatalog } from "@/lib/ecommerce/constants";
import { Metadata } from "next";
import { Suspense } from "react";
import { ProductCardSkeleton } from "./components/product-card-skeleton";
import { ProductGrid } from "./components/product-grid";
import ProductList from "./components/product-list";
import ResultsControls from "./components/results-controls";

export const metadata: Metadata = {
  title: "ACME Store | Shop",
  description: "ACME Store, your one-stop shop for all your needs.",
};

// Enable ISR with 1 minute revalidation
export const revalidate = 60;

export default async function Shop(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;

  return (
    <>
      <Suspense
        fallback={
          <>
            <ResultsControls
              className="max-md:hidden"
              collections={[]}
              products={[]}
            />
            <ProductGrid>
              {Array.from({ length: 12 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </ProductGrid>
          </>
        }
      >
        <ProductList
          collection={storeCatalog.rootCategoryId}
          searchParams={searchParams}
        />
      </Suspense>
    </>
  );
}
