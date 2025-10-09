"use client";

import { FormattedProduct } from "@/lib/ecommerce/types-sample";
// import { Product } from '@/lib/shopify/types';
import { createContext, ReactNode, useContext, useState } from "react";

interface ProductsContextType {
  products: FormattedProduct[];
  setProducts: (products: FormattedProduct[]) => void;
  originalProducts: FormattedProduct[];
  setOriginalProducts: (products: FormattedProduct[]) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined
);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<FormattedProduct[]>([]);
  const [originalProducts, setOriginalProducts] = useState<FormattedProduct[]>(
    []
  );

  return (
    <ProductsContext.Provider
      value={{ products, setProducts, originalProducts, setOriginalProducts }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}
