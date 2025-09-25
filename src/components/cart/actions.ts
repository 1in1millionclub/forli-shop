/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { TAGS } from "@/lib/constants";
import {
  addCartLines,
  createCart as createSupabaseCart,
  getCart as getSupabaseCart,
  removeCartLines,
  updateCartLines,
} from "@/lib/ecommerce/ecommerce";
import {
  Cart,
  CartItem,
  FormattedCart,
  FormattedCartLine,
} from "@/lib/ecommerce/types-sample";
import { supabase } from "@/utils/supabase/normal";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

// Local adapter utilities to return FE Cart (avoid cyclic deps)
function adaptCartLine(supabaseLine: FormattedCartLine): CartItem {
  const merchandise = supabaseLine.merchandise;
  const product = merchandise.product;

  return {
    id: supabaseLine.id,
    quantity: supabaseLine.quantity,
    cost: {
      totalAmount: {
        amount: (
          parseFloat(merchandise.price.amount) * supabaseLine.quantity
        ).toString(),
        currencyCode: merchandise.price.currencyCode,
      },
    },
    merchandise: {
      id: merchandise.id,
      title: merchandise.title,
      selectedOptions: merchandise.selectedOptions || [],
      product: {
        id: product.title,
        title: product.title,
        handle: product.handle,
        description: "",
        descriptionHtml: "",
        featuredImage: product.images?.edges?.[0]
          ? {
              url: product.images.edges[0].url,
              altText: product.images.edges[0].altText || product.title,
              height: product.images.edges[0].height || 600,
              width: product.images.edges[0].width || 600,
              thumbhash: product.images.edges[0].thumbhash || undefined,
              selectedOptions: product.images.edges[0].selectedOptions,
            }
          : { url: "", altText: "", height: 0, width: 0 },
        priceRange: {
          minVariantPrice: merchandise.price,
          maxVariantPrice: merchandise.price,
        },
        seo: { title: product.title, description: "" },
        options: [],
        tags: [],
        variants: [],
        images: product.images?.edges?.map((img) => ({
          url: img.url,
          altText: img.altText || product.title,
          height: img.height || 600,
          width: img.width || 600,
          thumbhash: img.thumbhash || undefined,
          selectedOptions: img.selectedOptions,
        })),
        availableForSale: true,
        currencyCode: merchandise.price.currencyCode,
        productType: "",
        category: { id: "", name: "" },
        compareAtPriceRange: {
          minVariantPrice: {
            amount: merchandise.price.amount,
            currencyCode: merchandise.price.currencyCode,
          },
        },
      },
    },
  } satisfies CartItem;
}

function adaptCart(supabaseCart: FormattedCart | null): Cart | null {
  if (!supabaseCart) return null;

  const lines =
    supabaseCart.lines?.edges?.map((edge: any) => adaptCartLine(edge.node)) ||
    [];

  return {
    id: supabaseCart.id,
    checkoutUrl: supabaseCart.checkoutUrl,
    cost: {
      subtotalAmount: supabaseCart.cost.subtotalAmount,
      totalAmount: supabaseCart.cost.totalAmount,
      totalTaxAmount: supabaseCart.cost.totalTaxAmount,
    },
    totalQuantity: lines.reduce(
      (sum: number, line: CartItem) => sum + line.quantity,
      0
    ),
    lines,
  } satisfies Cart;
}

async function getOrCreateCartId(): Promise<string> {
  let cartId = (await cookies()).get("cartId")?.value;
  console.log(cartId);
  if (cartId) {
    const { data: supabaseCartID } = await supabase
      .from("carts")
      .select("id")
      .eq("id", cartId)
      .single();
    if (!supabaseCartID) cartId = undefined;
  }
  if (!cartId) {
    const newCart = await createSupabaseCart();
    cartId = newCart.id;
    if (cartId) {
      (await cookies()).set("cartId", cartId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
      });
    }
  }
  return cartId ?? "";
}

// Add item server action: returns adapted Cart
export async function addItem(
  variantId: string | undefined
): Promise<Cart | null> {
  if (!variantId) return null;
  try {
    const cartId = await getOrCreateCartId();
    await addCartLines(cartId, [{ merchandiseId: variantId, quantity: 1 }]);
    const fresh = await getSupabaseCart(cartId);
    revalidateTag(TAGS.cart);
    return adaptCart(fresh);
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return null;
  }
}

// Update item server action (quantity 0 removes): returns adapted Cart
export async function updateItem({
  lineId,
  quantity,
}: {
  lineId: string;
  quantity: number;
}): Promise<Cart | null> {
  try {
    const cartId = (await cookies()).get("cartId")?.value;
    if (!cartId) return null;

    if (quantity === 0) {
      await removeCartLines(cartId, [lineId]);
    } else {
      await updateCartLines(cartId, [{ id: lineId, quantity }]);
    }

    const fresh = await getSupabaseCart(cartId);
    revalidateTag(TAGS.cart);
    return adaptCart(fresh);
  } catch (error) {
    console.error("Error updating item:", error);
    return null;
  }
}

export async function createCartAndSetCookie() {
  try {
    const newCart = await createSupabaseCart();

    if (newCart.id) {
      (await cookies()).set("cartId", newCart.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    return newCart;
  } catch (error) {
    console.error("Error creating cart:", error);
    return null;
  }
}

export async function getCart(): Promise<Cart | null> {
  try {
    const cartId = (await cookies()).get("cartId")?.value;
    if (!cartId) {
      return null;
    }
    const fresh = await getSupabaseCart(cartId);

    return adaptCart(fresh);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return null;
  }
}
