"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  // Clear cart on successful checkout
  useEffect(() => {
    // Redirect to payment status page if coming from direct URL
    if (orderId) {
      router.push(`/payment/status?orderId=${orderId}`);
      return;
    }
    // This is a backup in case the cart wasn't cleared during checkout
    const cart = localStorage.getItem("cart");
    if (cart) {
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));
    }
  }, [orderId, router]);
  // If no orderId is provided, show the generic success page
  if (!orderId) {
    return (
      <div className="container mx-auto py-10">
        <div className="max-w-md mx-auto text-center space-y-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />

          <h1 className="text-3xl font-bold">Order Successful!</h1>

          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been received and is
            being processed.
          </p>

          <p className="text-sm text-muted-foreground">
            A confirmation email has been sent to your email address.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>

            <Button variant="outline" asChild>
              <Link href="/account/orders">View Orders</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // This will actually never be shown because of the redirect
  return null;
}
