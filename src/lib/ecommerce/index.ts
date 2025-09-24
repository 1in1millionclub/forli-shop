import { TAGS } from "@/lib/constants";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import {
  addCartLines,
  createCart,
  getCollectionProducts as getSupabaseCollectionProducts,
  getCollections as getSupabaseCollections,
  getProduct as getSupabaseProduct,
  getProducts as getSupabaseProducts,
  removeCartLines,
  updateCartLines,
} from "./ecommerce";
import type {
  Cart,
  Collection,
  FormattedCollection,
  FormattedProduct,
  Money,
  ProductCollectionSortKey,
  ProductOption,
  ProductSortKey,
  ProductVariant,
} from "./types-sample";
import { thumbhashToDataURL } from "./utils";

// Utility function to extract the first sentence from a description
function getFirstSentence(text: string): string {
  if (!text) return "";

  const cleaned = text.trim();
  const match = cleaned.match(/^[^.!?]*[.!?]/);

  if (match) {
    return match[0].trim();
  }

  if (cleaned.length > 100) {
    return cleaned.substring(0, 100).trim() + "...";
  }

  return cleaned;
}

// Helper functions for consistent data transformation

function transformSupabaseMoney(
  supabaseMoney: { amount: string; currencyCode: string } | undefined
): Money {
  return {
    amount: supabaseMoney?.amount || "0",
    currencyCode: supabaseMoney?.currencyCode || "USD",
  };
}

function transformSupabaseOptions(
  supabaseOptions: {
    id: string;
    name: string;
    values: {
      id: string;
      name: string;
    }[];
  }[]
): ProductOption[] {
  return supabaseOptions.map((option) => ({
    id: option.id || option.name.toLowerCase().replace(/\s+/g, "-"),
    name: option.name,
    values: option.values.map((value) => ({
      id: value.id.toLowerCase().replace(/\s+/g, "-"),
      name: value.name,
    })),
  }));
}

function transformSupabaseVariants(
  supabaseVariants: ProductVariant[]
): ProductVariant[] {
  if (!Array.isArray(supabaseVariants)) return [];

  return supabaseVariants.map((variant) => ({
    id: variant.id,
    title: variant.title || "",
    availableForSale: variant.availableForSale !== false,
    price: transformSupabaseMoney(variant.price),
    selectedOptions: variant.selectedOptions || [],
  }));
}

// Main adapter functions
function adaptSupabaseCollection(
  supabaseCollection: FormattedCollection
): Collection {
  return {
    ...supabaseCollection,
    seo: {
      title: supabaseCollection.title,
      description: supabaseCollection.description || "",
    },
    parentCategoryTree: [],
    updatedAt: new Date().toISOString(),
    path: `/shop/${supabaseCollection.handle}`,
  };
}

function adaptSupabaseProduct(supabaseProduct: FormattedProduct) {
  const firstImage = supabaseProduct.images[0];
  const description = getFirstSentence(supabaseProduct.description || "");

  return {
    ...supabaseProduct,
    description,
    categoryId: supabaseProduct.productType || supabaseProduct.category?.name,
    tags: [],
    availableForSale: true,
    currencyCode:
      supabaseProduct.priceRange?.minVariantPrice?.currencyCode || "INR",
    featuredImage: firstImage
      ? {
          ...firstImage,
          altText: firstImage.altText || supabaseProduct.title || "",
          height: 600,
          width: 600,
          thumbhash: firstImage.thumbhash
            ? thumbhashToDataURL(firstImage.thumbhash)
            : undefined,
          selectedOptions: supabaseProduct.variants[0]?.selectedOptions || [],
        }
      : { url: "", altText: "", height: 0, width: 0 },
    seo: {
      title: supabaseProduct.title || "",
      description,
    },
    priceRange: {
      minVariantPrice: transformSupabaseMoney(
        supabaseProduct.priceRange?.minVariantPrice
      ),
      maxVariantPrice: transformSupabaseMoney(
        supabaseProduct.priceRange?.maxVariantPrice
      ),
    },
    // compareAtPrice:
    //   supabaseProduct.compareAtPriceRange?.minVariantPrice &&
    //   parseFloat(supabaseProduct.compareAtPriceRange.minVariantPrice.amount) >
    //     parseFloat(supabaseProduct.priceRange?.minVariantPrice?.amount || "0")
    //     ? transformSupabaseMoney(
    //         supabaseProduct.compareAtPriceRange.minVariantPrice
    //       )
    //     : undefined,
    images: supabaseProduct.images,
    options: transformSupabaseOptions(supabaseProduct.options),
    variants: transformSupabaseVariants(supabaseProduct.variants),
  };
}

// Cart adapting happens in server actions to avoid cyclic deps

// Public API functions
export async function getCollections(): Promise<Collection[]> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("minutes");

  try {
    const productCollections = await getSupabaseCollections();
    return productCollections
      .filter(
        (collection): collection is FormattedCollection => collection !== null
      )
      .map(adaptSupabaseCollection);
  } catch (error) {
    console.error("Error fetching collections:", error);
    return [];
  }
}

export async function getCollection(
  handle: string
): Promise<Collection | null> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("minutes");

  try {
    const collections = await getSupabaseCollections();
    const collection = collections.find(
      (collection) => collection?.handle === handle
    );
    return collection ? adaptSupabaseCollection(collection) : null;
  } catch (error) {
    console.error("Error fetching collection:", error);
    return null;
  }
}

export async function getProduct(handle: string) {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("minutes");

  try {
    const supabaseProduct = await getSupabaseProduct(handle);
    return supabaseProduct ? adaptSupabaseProduct(supabaseProduct) : null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function getProducts(params: {
  limit?: number;
  sortKey?: ProductSortKey;
  reverse?: boolean;
  query?: string;
}) {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("minutes");

  try {
    const supabaseProducts = await getSupabaseProducts(params);
    return supabaseProducts.map(adaptSupabaseProduct);
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getCollectionProducts(params: {
  collection: string;
  limit?: number;
  sortKey?: ProductCollectionSortKey;
  reverse?: boolean;
  query?: string;
}) {
  "use cache";
  cacheTag(TAGS.collectionProducts);
  cacheLife("minutes");

  try {
    const supabaseProducts = await getSupabaseCollectionProducts(params);
    return supabaseProducts.map(adaptSupabaseProduct);
  } catch (error) {
    console.error("Error fetching collection products:", error);
    return [];
  }
}

export async function getCart(): Promise<Cart | null> {
  try {
    const { getCart: getCartAction } = await import(
      "@/components/cart/actions"
    );
    return await getCartAction();
  } catch (error) {
    console.error("Error fetching cart:", error);
    return null;
  }
}

// Re-export cart mutation functions (these are properly typed in supabase.ts)
export { addCartLines, createCart, removeCartLines, updateCartLines };
