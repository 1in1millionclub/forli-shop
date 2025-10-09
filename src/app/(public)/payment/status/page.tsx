"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";
import { CheckCircle, Clock, Loader2, RefreshCcw, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
export default function PaymentStatusPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [status, setStatus] = useState<
    "loading" | "success" | "failed" | "pending"
  >("loading");
  const [isRetrying, setIsRetrying] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    if (!orderId) {
      router.push("/");
      return;
    }

    const checkPaymentStatus = async () => {
      const supabase = createClient();

      try {
        await fetch("/api/payment/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId }),
        });
        // Check the transaction status
        const { data: transaction, error: transactionError } = await supabase
          .from("transactions")
          .select("*")
          .eq("order_id", orderId)
          .single();

        if (transactionError) throw transactionError;

        // Get order details
        const { data: order, error: orderError } = await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .single();

        if (orderError) throw orderError;

        setOrderDetails(order);
        if (
          transaction.status === "loading" ||
          transaction.status === "success" ||
          transaction.status === "failed" ||
          transaction.status === "pending"
        ) {
          setStatus(transaction.status);
        } else {
          setStatus("failed");
        }
        console.log(status);
        // Determine status
        if (transaction.status === "success") {
          // Clear cart
          localStorage.removeItem("cart");
          window.dispatchEvent(new Event("cartUpdated"));
        } else {
          // If status is still pending, try to verify payment
          await fetch("/api/payment/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ orderId }),
          });
          router.refresh();
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
        setStatus("failed");
      }
    };

    checkPaymentStatus();
  }, [orderId, router, status]);
  const handleRetryPayment = async () => {
    if (!orderDetails) return;

    setIsRetrying(true);

    try {
      // Initiate a new payment
      const response = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderDetails.id,
          amount: orderDetails.total,
          mobileNumber: orderDetails.contact_phone,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to initiate payment");
      }

      // Redirect to payment page
      window.location.href = data.paymentUrl;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error retrying payment:", error);
      toast.error("Payment retry failed", {
        description:
          error.message || "Failed to retry payment. Please try again.",
      });
      setIsRetrying(false);
    }
  };
  async function checkPaymentStatus(): Promise<void> {
    if (!orderId) return;

    try {
      // Verify payment status
      const response = await fetch("/api/payment/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to verify payment status");
      }

      // Refresh the page to update the status
      router.refresh();
    } catch (error) {
      console.error("Error verifying payment status:", error);
      toast.error("Failed to check payment status. Please try again.");
      setStatus("failed");
    }
  }
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {status === "loading" && "Processing Payment"}
              {status === "success" && "Payment Successful"}
              {status === "pending" && "Payment Pending"}
              {status === "failed" && "Payment Failed"}
            </CardTitle>
          </CardHeader>

          <CardContent className="text-center space-y-4">
            {status === "loading" && (
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-16 w-16 text-primary animate-spin" />
                <p className="text-muted-foreground">
                  Please wait while we process your payment...
                </p>
              </div>
            )}

            {status === "success" && (
              <div className="flex flex-col items-center space-y-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
                <p className="text-muted-foreground">
                  Thank you for your purchase. Your order has been received and
                  is being processed.
                </p>
                {orderDetails && (
                  <div className="bg-muted p-4 rounded-lg w-full">
                    <p className="font-medium">Order ID:</p>
                    <p className="text-xl font-bold">
                      {orderId?.substring(0, 8)}
                    </p>
                    <p className="mt-2 font-medium">Total:</p>
                    <p className="text-xl font-bold">
                      ₹{orderDetails.total.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            )}

            {status === "failed" && (
              <div className="flex flex-col items-center space-y-4">
                <XCircle className="h-16 w-16 text-destructive" />
                <p className="text-muted-foreground">
                  We&apos;re sorry, but your payment could not be processed.
                  Please try again or use a different payment method.
                </p>
                {orderDetails && (
                  <div className="bg-muted p-4 rounded-lg w-full">
                    <p className="font-medium">Order ID:</p>
                    <p className="text-xl font-bold">
                      {orderId?.substring(0, 8)}
                    </p>
                    <p className="mt-2 font-medium">Total:</p>
                    <p className="text-xl font-bold">
                      ₹{orderDetails.total.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          {status === "pending" && (
            <CardContent className="flex flex-col items-center space-y-4 text-center">
              <Clock className="h-16 w-16 text-yellow-500" />
              <p className="text-muted-foreground">
                Your payment is being processed. Please wait...
              </p>
            </CardContent>
          )}
          <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
            {status === "success" && (
              <>
                <Button asChild>
                  <Link href="/products">Continue Shopping</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/account?tab=orders">View Orders</Link>
                </Button>
              </>
            )}
            {status === "pending" && (
              <>
                <Button onClick={checkPaymentStatus}>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Check Payment Status
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/account?tab=orders">View Orders</Link>
                </Button>
              </>
            )}

            {status === "failed" && (
              <>
                <Button onClick={handleRetryPayment} disabled={isRetrying}>
                  {isRetrying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      Retry Payment
                    </>
                  )}
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/account?tab=orders">View Orders</Link>
                </Button>
              </>
            )}

            {status === "loading" && (
              <Button variant="outline" asChild>
                <Link href="/account?tab=orders">View Orders</Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
