import { supabase } from "@/utils/supabase/normal";
import { QueryData } from "@supabase/supabase-js";
import {
  FormattedCart,
  FormattedCollection,
  FormattedProduct,
  ProductVariant,
} from "./types-sample";

// Helper to transform Supabase product data to Shopify-like structure
function formatProduct(product: ProductsWithRelations[0]): FormattedProduct {
  return {
    id: product.id,
    title: product.title,
    description: product.description || "",
    descriptionHtml: product.description_html || "",
    handle: product.handle,
    productType: product.product_type || "",
    category: product.categories,
    tags: [],
    options: product.product_options.map((option) => ({
      id: option.id || option.name.toLowerCase().replace(/\s+/g, "-"),
      name: option.name,
      values: option.product_option_values.map((value) => ({
        id: value.id.toLowerCase().replace(/\s+/g, "-"),
        name: value.value,
      })),
    })),
    images: product.product_images.map((img) => ({
      url: img.url,
      altText: img.alt_text,
      height: img.height,
      width: img.width,
      selectedOptions: product.product_variants.length
        ? product.product_variants[0].variant_selected_options
        : undefined,
      thumbhash: img.thumbhash,
    })),
    availableForSale: product.available_for_sale,
    priceRange: {
      minVariantPrice: {
        amount: product.product_variants[0]?.price.toString(),
        currencyCode: product.product_variants[0]?.currency_code || "INR",
      },
      maxVariantPrice: {
        amount:
          product.product_variants[
            product.product_variants.length - 1
          ]?.price.toString() || "0.00",
        currencyCode:
          product.product_variants[product.product_variants.length - 1]
            ?.currency_code || "INR",
      },
    },
    featuredImage: {
      url: product.product_images[0]?.url || "",
      altText: product.product_images[0]?.alt_text || "",
      height: product.product_images[0]?.height || 0,
      width: product.product_images[0]?.width || 0,
      thumbhash: product.product_images[0]?.thumbhash,
      selectedOptions: product.product_variants.length
        ? product.product_variants[0].variant_selected_options
        : undefined,
    },
    compareAtPriceRange: {
      minVariantPrice: {
        amount: product.product_variants[0]?.price.toString(),
        currencyCode: product.product_variants[0]?.currency_code || "INR",
      },
    },
    variants: product.product_variants.map(
      (variant): ProductVariant => ({
        id: variant.id,
        title: variant.title,
        availableForSale: variant.available_for_sale,
        price: {
          amount: variant.price.toString(),
          currencyCode: variant.currency_code,
        },
        selectedOptions: variant.variant_selected_options,
      })
    ),
    currencyCode: product.product_variants[0]?.currency_code || "INR",
    seo: {
      title: product.title,
      description: product.description || "",
    },
  };
}

function formatCollection(collection: Collections[0]): FormattedCollection {
  return {
    id: collection.id,
    title: collection.title,
    handle: collection.handle,
    description: collection.description || "",
    image: collection.image_url
      ? {
          url: collection.image_url || "",
          altText: collection.image_alt_text || "",
        }
      : undefined,
  };
}

// Calculate cart totals from line items
function calculateCartTotals(cartItems: CreateCartMutation["cart_items"]) {
  let subtotal = 0;
  const currencyCode = cartItems[0]?.product_variants?.currency_code || "INR";

  for (const item of cartItems) {
    const price = Number(item.product_variants?.price || 0);
    const quantity = item.quantity;
    subtotal += price * quantity;
  }

  // You can add tax calculation logic here if needed
  const taxAmount = 0; // Calculate based on your business logic
  const totalAmount = subtotal + taxAmount;

  return {
    subtotalAmount: {
      amount: subtotal.toFixed(2),
      currencyCode,
    },
    totalAmount: {
      amount: totalAmount.toFixed(2),
      currencyCode,
    },
    totalTaxAmount: {
      amount: taxAmount.toFixed(2),
      currencyCode,
    },
  };
}

// Helper to transform Supabase cart data to Shopify-like structure
function formatCart(cart: CreateCartMutation): FormattedCart | null {
  if (!cart) return null;

  // Calculate totals on the fly
  const calculatedCost = calculateCartTotals(cart.cart_items);

  return {
    id: cart.id,
    checkoutUrl: "",
    lines: {
      edges: cart.cart_items.map(
        (item: CreateCartMutation["cart_items"][0]) => ({
          node: {
            id: item.id,
            quantity: item.quantity,
            merchandise: {
              id: item.product_variants?.id || "",
              title: item.product_variants?.title || "",
              price: {
                amount: item.product_variants?.price.toString() || "0.00",
                currencyCode: item.product_variants?.currency_code || "INR",
              },
              selectedOptions:
                item.product_variants?.variant_selected_options.map(
                  (opt: { name: string; value: string }) => ({
                    name: opt.name,
                    value: opt.value,
                  })
                ) || [],
              product: {
                title: item.product_variants?.products?.title || "",
                handle: item.product_variants?.products?.handle || "",
                images: {
                  edges: (
                    item.product_variants?.products?.product_images ?? []
                  ).map((img) => ({
                    url: img.url,
                    altText: img.alt_text,
                    thumbhash: img.thumbhash,
                    height: img.height,
                    width: img.width,
                    selectedOptions: item.product_variants
                      ?.variant_selected_options
                      ? item.product_variants.variant_selected_options
                      : [],
                  })),
                },
              },
            },
          },
        })
      ),
    },
    cost: calculatedCost,
  };
}

// Get all products
const productsWithRelationsQuery = supabase
  .from("products")
  .select(
    "*, categories(id, name), product_options(*, product_option_values(*)), product_images(*), product_variants(*, variant_selected_options(*))"
  );
export type ProductsWithRelations = QueryData<
  typeof productsWithRelationsQuery
>;
export async function getProducts({
  first = 250,
  sortKey,
  reverse = false,
  query: searchQuery,
}: {
  first?: number;
  sortKey?: string;
  reverse?: boolean;
  query?: string;
}) {
  let request = productsWithRelationsQuery.limit(first);

  // Sorting
  // if (sortKey) {
  //   request = request.order(sortKey.toLowerCase(), { ascending: !reverse });
  // } else {
  //   request = request.order("created_at", { ascending: !reverse });
  // }

  // Basic search filter
  if (searchQuery) {
    request = request.ilike("title", `%${searchQuery}%`);
  }

  const { data, error } = await request;

  if (error) {
    console.error("Supabase getProducts error:", error);
    throw error;
  }
  return data.map(formatProduct);
}

// Get single product by handle
export async function getProduct(handle: string) {
  const { data, error } = await supabase
    .from("products")
    .select(
      "*, categories(id, name), product_options(*, product_option_values(*)), product_images(*), product_variants(*, variant_selected_options(*))"
    )
    .eq("handle", handle)
    .single();

  if (error) {
    console.error("Supabase getProduct error:", error);
    if (error.code === "PGRST116") {
      // No rows found
      return null;
    }
    throw error;
  }

  return formatProduct(data);
}

// Get collections
const collectionsQuery = supabase.from("collections").select("*");
type Collections = QueryData<typeof collectionsQuery>;
export async function getCollections(first = 10) {
  const { data, error } = await collectionsQuery.limit(first);

  if (error) {
    console.error("Supabase getCollections error:", error);
    throw error;
  }

  return data.map(formatCollection);
}

// Get products from a specific collection
export async function getCollectionProducts({
  collection,
  limit = 250,
  sortKey,
  query: searchQuery,
  reverse = false,
}: {
  collection: string;
  limit?: number;
  sortKey?: string;
  query?: string;
  reverse?: boolean;
}) {
  const { data: collectionData, error: collectionError } = await supabase
    .from("collections")
    .select("id")
    .eq("handle", collection)
    .single();
  if (collectionError) {
    console.error(
      "Supabase getCollectionProducts error (collection fetch):",
      collectionError
    );
    return [];
  }

  const collectionId = collectionData?.id;
  if (!collectionId) {
    return [];
  }

  let request = supabase
    .from("collection_products")
    .select(
      "product_id, products(*, categories(id, name), product_options(*, product_option_values(*)), product_images(*), product_variants(*, variant_selected_options(*)))"
    )
    .eq("collection_id", collectionId)
    .limit(limit);
  // You would need more advanced sorting logic here
  // For now, let's just apply a simple sort on the product table
  // if (sortKey) {
  //   request = request.order(`products->>${sortKey.toLowerCase()}`, {
  //     ascending: !reverse,
  //   });
  // }

  if (searchQuery) {
    request = request.ilike("products->>title", `%${searchQuery}%`);
  }

  const { data: productsData, error: productsError } = await request;

  if (productsError) {
    console.error(
      "Supabase getCollectionProducts error (products fetch):",
      productsError
    );
    throw productsError;
  }

  return productsData.map(
    (item) => item.products && formatProduct(item.products)
  );
}

// Create cart
const createCartMutation = supabase
  .from("carts")
  .insert({})
  .select(
    "*, cart_items(*, product_variants(*, variant_selected_options(*), products(*, product_images(*))))"
  )
  .single();
type CreateCartMutation = QueryData<typeof createCartMutation>;
export async function createCart() {
  const { data, error } = await createCartMutation;

  if (error) {
    console.error("Supabase createCart error:", error);
    throw error;
  }

  // Return a formatted cart with an empty lines array
  return {
    ...formatCart(data),
    lines: { edges: [] },
  };
}

// Add items to cart
export async function addCartLines(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>
) {
  for (const line of lines) {
    // First, try to get existing quantity
    const { data: existing } = await supabase
      .from("cart_items")
      .select("quantity")
      .eq("cart_id", cartId)
      .eq("variant_id", line.merchandiseId)
      .single();

    const newQuantity = existing
      ? existing.quantity + line.quantity
      : line.quantity;

    // Upsert with the calculated quantity
    const { error } = await supabase.from("cart_items").upsert(
      {
        cart_id: cartId,
        variant_id: line.merchandiseId,
        quantity: newQuantity,
      },
      {
        onConflict: "cart_id,variant_id",
      }
    );

    if (error) {
      console.error("Supabase addCartLines upsert error:", error);
      throw error;
    }
  }

  // Re-fetch the updated cart to return the full object
  return getCart(cartId);
}

// Update items in cart
export async function updateCartLines(
  cartId: string,
  lines: Array<{ id: string; quantity: number }>
) {
  const updates = lines.map((line) =>
    supabase
      .from("cart_items")
      .update({ quantity: line.quantity })
      .eq("id", line.id)
      .eq("cart_id", cartId)
  );

  const results = await Promise.all(updates);
  for (const result of results) {
    if (result.error) {
      console.error("Supabase updateCartLines error:", result.error);
      throw result.error;
    }
  }

  return getCart(cartId);
}

// Remove items from cart
export async function removeCartLines(cartId: string, lineIds: string[]) {
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .in("id", lineIds)
    .eq("cart_id", cartId);

  if (error) {
    console.error("Supabase removeCartLines error:", error);
    throw error;
  }

  return getCart(cartId);
}

// Get cart
export async function getCart(cartId: string) {
  const { data, error } = await supabase
    .from("carts")
    .select(
      "*, cart_items(*, product_variants(*, variant_selected_options(*), products(*, product_images(*))))"
    )
    .eq("id", cartId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No rows found
      return null;
    }
    throw error;
  }

  return formatCart(data);
}
