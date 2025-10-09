"use client";

import * as CartActions from "@/components/cart/actions";
import {
  Cart,
  CartItem,
  FormattedProduct,
  ProductVariant,
} from "@/lib/ecommerce/types-sample";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useOptimistic,
  useState,
  useTransition,
} from "react";

export type UpdateType = "plus" | "minus" | "delete";

type CartAction =
  | {
      type: "UPDATE_ITEM";
      payload: { merchandiseId: string; nextQuantity: number };
    }
  | {
      type: "CLEAR_CART";
    }
  | {
      type: "ADD_ITEM";
      payload: {
        variant: ProductVariant;
        product: FormattedProduct;
        previousQuantity: number;
      };
    };

type UseCartReturn = {
  isPending: boolean;
  cart: Cart | undefined;
  addItem: (
    variant: ProductVariant,
    product: FormattedProduct
  ) => Promise<void>;
  updateItem: (
    lineId: string,
    merchandiseId: string,
    nextQuantity: number,
    updateType: UpdateType
  ) => Promise<void>;
  clearCart: () => Promise<void>;
};

type CartContextType = UseCartReturn | undefined;

const CartContext = createContext<CartContextType | undefined>(undefined);

function calculateItemCost(quantity: number, price: string): string {
  return (Number(price) * quantity).toFixed(2);
}

function updateCartTotals(
  lines: CartItem[]
): Pick<Cart, "totalQuantity" | "cost"> {
  const totalQuantity = lines.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = lines.reduce(
    (sum, item) => sum + Number(item.cost.totalAmount.amount),
    0
  );
  const currencyCode = lines[0]?.cost.totalAmount.currencyCode ?? "INR";

  return {
    totalQuantity,
    cost: {
      subtotalAmount: { amount: totalAmount.toFixed(2), currencyCode },
      totalAmount: { amount: totalAmount.toFixed(2), currencyCode },
      totalTaxAmount: { amount: "0.00", currencyCode },
    },
  };
}

function createEmptyCart(): Cart {
  return {
    id: "",
    checkoutUrl: "",
    cost: {
      subtotalAmount: { amount: "0.00", currencyCode: "INR" },
      totalAmount: { amount: "0.00", currencyCode: "INR" },
      totalTaxAmount: { amount: "0.00", currencyCode: "INR" },
    },
    totalQuantity: 0,
    lines: [],
  };
}

function cartReducer(state: Cart | undefined, action: CartAction): Cart {
  const currentCart = state || createEmptyCart();

  switch (action.type) {
    case "UPDATE_ITEM": {
      const { merchandiseId, nextQuantity } = action.payload;

      // Filter out items with quantity <= 0
      const updatedLines = currentCart.lines
        .map((item) => {
          if (item.merchandise.id !== merchandiseId) return item;
          if (nextQuantity <= 0) return null;

          const singleItemAmount =
            Number(item.cost.totalAmount.amount) / item.quantity;
          const newTotalAmount = calculateItemCost(
            nextQuantity,
            singleItemAmount.toString()
          );

          return {
            ...item,
            quantity: nextQuantity,
            cost: {
              ...item.cost,
              totalAmount: {
                ...item.cost.totalAmount,
                amount: newTotalAmount,
              },
            },
          } satisfies CartItem;
        })
        .filter(Boolean) as CartItem[];

      if (updatedLines.length === 0) {
        return createEmptyCart();
      }

      return {
        ...currentCart,
        ...updateCartTotals(updatedLines),
        lines: updatedLines,
      };
    }
    case "ADD_ITEM": {
      const { variant, product, previousQuantity } = action.payload;
      const existingItem = currentCart.lines.find(
        (item) => item.merchandise.id === variant.id
      );
      const targetQuantity = previousQuantity + 1;

      const updatedLines = existingItem
        ? currentCart.lines.map((item) => {
            if (item.merchandise.id !== variant.id) return item;

            const singleItemAmount =
              Number(item.cost.totalAmount.amount) / item.quantity;
            const newTotalAmount = calculateItemCost(
              targetQuantity,
              singleItemAmount.toString()
            );

            return {
              ...item,
              quantity: targetQuantity,
              cost: {
                ...item.cost,
                totalAmount: {
                  ...item.cost.totalAmount,
                  amount: newTotalAmount,
                },
              },
            } satisfies CartItem;
          })
        : [
            {
              id: `temp-${Date.now()}`,
              quantity: targetQuantity,
              cost: {
                totalAmount: {
                  amount: calculateItemCost(
                    targetQuantity,
                    variant.price.amount
                  ),
                  currencyCode: variant.price.currencyCode,
                },
              },
              merchandise: {
                id: variant.id,
                title: variant.title,
                selectedOptions: variant.selectedOptions,
                product: product,
              },
            } satisfies CartItem,
            ...currentCart.lines,
          ];

      return {
        ...currentCart,
        ...updateCartTotals(updatedLines),
        lines: updatedLines,
      };
    }
    case "CLEAR_CART": {
      return createEmptyCart();
    }

    default:
      return currentCart;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [isPending, startTransition] = useTransition();
  const [cart, setCart] = useState<Cart | undefined>(undefined);
  const [optimisticCart, updateOptimisticCart] = useOptimistic<
    Cart | undefined,
    CartAction
  >(cart, cartReducer);

  useEffect(() => {
    CartActions.getCart().then((cart) => {
      if (cart) setCart(cart);
    });
  }, []);

  useEffect(() => {
    console.log(cart);
  }, [cart]);

  const update = useCallback(
    async (lineId: string, merchandiseId: string, nextQuantity: number) => {
      startTransition(() => {
        updateOptimisticCart({
          type: "UPDATE_ITEM",
          payload: { merchandiseId, nextQuantity },
        });
      });

      const fresh = await CartActions.updateItem({
        lineId,
        quantity: nextQuantity,
      });

      if (fresh) {
        setCart(fresh);
      }
    },
    [updateOptimisticCart]
  );

  const add = useCallback(
    async (variant: ProductVariant, product: FormattedProduct) => {
      const previousQuantity =
        cart?.lines.find((l) => l.merchandise.id === variant.id)?.quantity || 0;

      startTransition(() => {
        updateOptimisticCart({
          type: "ADD_ITEM",
          payload: { variant, product, previousQuantity },
        });
      });

      const fresh = await CartActions.addItem(variant.id);

      if (fresh) {
        setCart(fresh);
      }
    },
    [updateOptimisticCart, cart]
  );
  const clearCart = useCallback(async () => {
    startTransition(() => {
      setCart(createEmptyCart());
      updateOptimisticCart({ type: "CLEAR_CART" }); // you can create a new action type if needed
    });

    await CartActions.clearCart(cart?.id || ""); // implement this server action to clear cart in backend
  }, [updateOptimisticCart, cart?.id]);

  const value = useMemo<UseCartReturn>(
    () => ({
      cart: optimisticCart,
      addItem: add,
      updateItem: update,
      clearCart,
      isPending,
    }),
    [optimisticCart, add, update, isPending, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): UseCartReturn {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
