"use client";

import {
  FormattedCollection,
  FormattedProduct,
} from "@/lib/ecommerce/types-sample";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { useEffect, useMemo } from "react";
import { Card } from "../../../components/ui/card";
import { useProducts } from "../providers/products-provider";
import { ProductCard } from "./product-card";
import { ProductGrid } from "./product-grid";
import ResultsControls from "./results-controls";

interface ProductListContentProps {
  products: FormattedProduct[];
  collections: FormattedCollection[];
}

// Client-side color filtering function
function filterProductsByColors(
  products: FormattedProduct[],
  colors: string[]
): FormattedProduct[] {
  if (!colors || colors.length === 0) {
    return products;
  }

  const filteredProducts = products.filter((product) => {
    // Check if product has any variants with the selected colors
    // Note: variants is now a simple array after adaptShopifyProduct transformation
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hasMatchingColor = product.variants?.some((variant: any) => {
      if (!variant.selectedOptions) return false;

      // Look for color option in variant
      return variant.selectedOptions.some(
        (option: FormattedProduct["options"][number]) => {
          const isColorOption =
            option.name.toLowerCase().includes("color") ||
            option.name.toLowerCase().includes("colour");

          if (!isColorOption) return false;

          // Check if this variant's color matches any of the selected colors

          const variantColor = option.values
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .find((value: any) => value.name)
            ?.name.toLowerCase();
          return colors.some(
            (selectedColor) =>
              selectedColor.toLowerCase() === variantColor ||
              variantColor?.includes(selectedColor.toLowerCase()) ||
              selectedColor.toLowerCase().includes(variantColor || "")
          );
        }
      );
    });

    // Also check product-level options as fallback
    if (!hasMatchingColor && product.options) {
      const colorOption = product.options.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (opt: any) =>
          opt.name.toLowerCase().includes("color") ||
          opt.name.toLowerCase().includes("colour")
      );

      if (colorOption && colorOption.values) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return colorOption.values.some((value: any) => {
          // Handle both string values and object values with .name property
          const colorValue =
            typeof value === "string" ? value : value.name || value.id;
          const optionColor = colorValue.toLowerCase();
          return colors.some(
            (selectedColor) =>
              selectedColor.toLowerCase() === optionColor ||
              optionColor.includes(selectedColor.toLowerCase()) ||
              selectedColor.toLowerCase().includes(optionColor)
          );
        });
      }
    }

    return hasMatchingColor;
  });

  return filteredProducts;
}

export function ProductListContent({
  products,
  collections,
}: ProductListContentProps) {
  const { setProducts, setOriginalProducts } = useProducts();

  // Get current color filters from URL
  const [colorFilters] = useQueryState(
    "fcolor",
    parseAsArrayOf(parseAsString).withDefault([])
  );

  // Apply client-side filtering whenever products or color filters change
  const filteredProducts = useMemo(() => {
    if (!colorFilters || colorFilters.length === 0) {
      return products;
    }
    return filterProductsByColors(products, colorFilters);
  }, [products, colorFilters]);

  // Set both original and filtered products in the provider whenever they change
  useEffect(() => {
    setOriginalProducts(products);
    setProducts(filteredProducts);
  }, [products, filteredProducts, setProducts, setOriginalProducts]);

  return (
    <>
      <ResultsControls
        className="max-md:hidden"
        collections={collections}
        products={filteredProducts}
      />

      {filteredProducts.length > 0 ? (
        <ProductGrid>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ProductGrid>
      ) : (
        <Card className="flex mr-sides flex-1 items-center justify-center">
          <p className="text text-muted-foreground font-medium">
            No products found
          </p>
        </Card>
      )}
    </>
  );
}
