/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Loader2, Plus } from "lucide-react";
import Script from "next/script";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/components/auth/auth-context";
import { useCart } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { createOrderId } from "@/utils/razorpay";
import { createClient } from "@/utils/supabase/client";

// Types
interface Address {
  id: number;
  user_id: string;
  name: string;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  is_default: boolean;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface NewAddressData {
  name: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  is_default: boolean;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string | undefined;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => Promise<void>;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
      on: (event: string, handler: (response: unknown) => void) => void;
    };
  }
}

// Constants
const INITIAL_FORM_DATA: FormData = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
};

const INITIAL_ADDRESS_DATA: NewAddressData = {
  name: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  postal_code: "",
  country: "India",
  phone: "",
  is_default: false,
};

const SHIPPING_COST = 100;
const COMPANY_NAME = "FORLI";

export default function CheckoutPage() {
  const { isPending, cart, clearCart } = useCart();
  const { user } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number>();
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [newAddressData, setNewAddressData] =
    useState<NewAddressData>(INITIAL_ADDRESS_DATA);

  // Populate form with user data
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.user_metadata?.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  // Fetch addresses
  const fetchAddresses = useCallback(async () => {
    if (!user?.id) return;

    setIsLoadingAddresses(true);
    const supabase = createClient();

    try {
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false });

      if (error && error.code !== "42P01") throw error;

      const addressList = data || [];
      setAddresses(addressList);

      // Set default address
      if (addressList.length > 0) {
        const defaultAddress =
          addressList.find((addr) => addr.is_default) || addressList[0];
        setSelectedAddressId(defaultAddress.id);
        populateFormWithAddress(defaultAddress);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load addresses");
    } finally {
      setIsLoadingAddresses(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchAddresses();
    } else {
      setIsLoadingAddresses(false);
    }
  }, [user, fetchAddresses]);

  // Helper to populate form with address
  const populateFormWithAddress = (address: Address) => {
    setFormData((prev) => ({
      ...prev,
      name: address.name,
      phone: address.phone,
      address: `${address.address_line1}${
        address.address_line2 ? ", " + address.address_line2 : ""
      }`,
      city: address.city,
      state: address.state,
      pincode: address.postal_code,
      country: address.country,
    }));
  };

  // Form handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewAddressData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddressSelect = (addressId: string) => {
    const id = Number(addressId);
    setSelectedAddressId(id);

    const selectedAddress = addresses.find((addr) => addr.id === id);
    if (selectedAddress) {
      populateFormWithAddress(selectedAddress);
    }
  };

  // Add new address
  const handleAddNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsAddingAddress(true);
    const supabase = createClient();

    try {
      // Update default address if needed
      if (newAddressData.is_default) {
        await supabase
          .from("addresses")
          .update({ is_default: false })
          .eq("user_id", user.id);
      }

      // Create new address
      const { data, error } = await supabase
        .from("addresses")
        .insert({
          user_id: user.id,
          ...newAddressData,
          address_line2: newAddressData.address_line2 || null,
          is_default: newAddressData.is_default || addresses.length === 0,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Address added successfully");
      setNewAddressData(INITIAL_ADDRESS_DATA);
      await fetchAddresses();

      if (data) {
        setSelectedAddressId(data.id);
      }
    } catch (error) {
      console.error("Error saving address:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save address";
      toast.error("Error adding address", { description: errorMessage });
    } finally {
      setIsAddingAddress(false);
    }
  };

  // Calculate totals
  const calculateTotals = () => {
    const subtotal =
      cart?.lines.reduce((total, item) => {
        return total + Number(item.cost.totalAmount.amount) * item.quantity;
      }, 0) || 0;

    const shipping = subtotal > 0 ? SHIPPING_COST : 0;
    const total = subtotal + shipping;

    return { subtotal, shipping, total };
  };

  // Format shipping address
  const formatShippingAddress = () => {
    return `${formData.name}, ${formData.address}, ${formData.city}, ${formData.state}, ${formData.pincode}, ${formData.country}`;
  };

  // Handle Razorpay payment
  const initiateRazorpayPayment = async (orderId: string, amount: number) => {
    const razorpayOrderId = await createOrderId(amount);

    const options: RazorpayOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: amount,
      currency: "INR",
      name: COMPANY_NAME,
      description: `Payment for order #${orderId}`,
      order_id: razorpayOrderId.id,
      handler: async (response: RazorpayResponse) => {
        console.log(response);
      },
      prefill: {
        name: user?.user_metadata?.name || "",
        email: user?.email || "",
      },
      theme: {
        color: "#000",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.on("payment.failed", (response: unknown) => {
      console.error("Payment failed:", response);
      toast.error("Payment failed");
    });
    razorpay.open();
  };

  // Submit checkout
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cart?.lines.length) {
      toast.error("Cart is empty", {
        description: "Please add items to your cart before checking out.",
      });
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();

    try {
      const { total } = calculateTotals();

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id || null,
          shipping_address: formatShippingAddress(),
          total,
          status: "pending",
          contact_email: formData.email,
          contact_phone: formData.phone,
          billing_address_id: selectedAddressId || null,
          shipping_address_id: selectedAddressId || null,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Add order items
      const orderItems = cart.lines.map((item) => ({
        order_id: order.id,
        variant_id: item.merchandise.id,
        quantity: item.quantity,
        price: Number(item.cost.totalAmount.amount),
        total_amount: Number(item.cost.totalAmount.amount) * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Initiate payment
      const amount = Number(cart.cost.totalAmount.amount);
      if (amount > 0) {
        await initiateRazorpayPayment(order.id, amount);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Checkout failed", {
        description:
          "There was an error processing your order. Please try again.",
      });
    } finally {
      clearCart();
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isPending) {
    return (
      <div className="container mx-auto md:py-10">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="ml-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto md:py-36">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <ContactInformationSection
              formData={formData}
              handleChange={handleChange}
            />

            {/* Shipping Address */}
            {user ? (
              <SavedAddressesSection
                addresses={addresses}
                isLoadingAddresses={isLoadingAddresses}
                selectedAddressId={selectedAddressId}
                formData={formData}
                newAddressData={newAddressData}
                isAddingAddress={isAddingAddress}
                handleAddressSelect={handleAddressSelect}
                handleNewAddressChange={handleNewAddressChange}
                handleAddNewAddress={handleAddNewAddress}
                handleChange={handleChange}
              />
            ) : (
              <ManualAddressSection
                formData={formData}
                handleChange={handleChange}
              />
            )}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting || !cart?.lines.length}
            >
              {isSubmitting ? "Processing..." : "Place Order"}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <OrderSummary cart={cart} />
      </div>

      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
    </div>
  );
}

// Component Sections
function ContactInformationSection({
  formData,
  handleChange,
}: {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Contact Information</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
      </div>
    </div>
  );
}

function SavedAddressesSection({
  addresses,
  isLoadingAddresses,
  selectedAddressId,
  formData,
  newAddressData,
  isAddingAddress,
  handleAddressSelect,
  handleNewAddressChange,
  handleAddNewAddress,
  handleChange,
}: {
  addresses: Address[];
  isLoadingAddresses: boolean;
  selectedAddressId?: number;
  formData: FormData;
  newAddressData: NewAddressData;
  isAddingAddress: boolean;
  handleAddressSelect: (id: string) => void;
  handleNewAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddNewAddress: (e: React.FormEvent) => Promise<void>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Shipping Address</h2>
        <AddAddressDialog
          newAddressData={newAddressData}
          isAddingAddress={isAddingAddress}
          handleNewAddressChange={handleNewAddressChange}
          handleAddNewAddress={handleAddNewAddress}
        />
      </div>

      {isLoadingAddresses ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="ml-2 text-muted-foreground">Loading addresses...</p>
        </div>
      ) : addresses.length > 0 ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address-select">Select a saved address</Label>
            <Select
              value={selectedAddressId?.toString()}
              onValueChange={handleAddressSelect}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an address" />
              </SelectTrigger>
              <SelectContent>
                {addresses.map((address) => (
                  <SelectItem key={address.id} value={address.id.toString()}>
                    {address.name} - {address.address_line1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedAddressId && (
            <Card>
              <CardContent className="pt-4">
                <div className="text-sm">
                  <p className="font-medium">{formData.name}</p>
                  <p>{formData.address}</p>
                  <p>
                    {formData.city}, {formData.state} {formData.pincode}
                  </p>
                  <p>{formData.country}</p>
                  <p className="mt-1">Phone: {formData.phone}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <ManualAddressSection formData={formData} handleChange={handleChange} />
      )}
    </div>
  );
}

function AddAddressDialog({
  newAddressData,
  isAddingAddress,
  handleNewAddressChange,
  handleAddNewAddress,
}: {
  newAddressData: NewAddressData;
  isAddingAddress: boolean;
  handleNewAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddNewAddress: (e: React.FormEvent) => Promise<void>;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add New Address
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Address</DialogTitle>
          <DialogDescription>
            Enter your shipping address details below
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAddNewAddress} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-name">Full Name</Label>
            <Input
              id="new-name"
              name="name"
              value={newAddressData.name}
              onChange={handleNewAddressChange}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address_line1">Address Line 1</Label>
            <Input
              id="address_line1"
              name="address_line1"
              value={newAddressData.address_line1}
              onChange={handleNewAddressChange}
              placeholder="Street address, P.O. box"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address_line2">Address Line 2 (Optional)</Label>
            <Input
              id="address_line2"
              name="address_line2"
              value={newAddressData.address_line2}
              onChange={handleNewAddressChange}
              placeholder="Apartment, suite, unit, building, floor, etc."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={newAddressData.city}
                onChange={handleNewAddressChange}
                placeholder="City"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                value={newAddressData.state}
                onChange={handleNewAddressChange}
                placeholder="State"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postal_code">PIN Code</Label>
              <Input
                id="postal_code"
                name="postal_code"
                value={newAddressData.postal_code}
                onChange={handleNewAddressChange}
                placeholder="PIN Code"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={newAddressData.country}
                onChange={handleNewAddressChange}
                placeholder="Country"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              value={newAddressData.phone}
              onChange={handleNewAddressChange}
              placeholder="Phone Number"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_default"
              name="is_default"
              checked={newAddressData.is_default}
              onChange={handleNewAddressChange}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="is_default" className="text-sm font-normal">
              Set as default address
            </Label>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isAddingAddress}>
              {isAddingAddress ? "Adding..." : "Add Address"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ManualAddressSection({
  formData,
  handleChange,
}: {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Shipping Address</h2>
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pincode">PIN Code</Label>
          <Input
            id="pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>
      </div>
    </div>
  );
}

function OrderSummary({ cart }: { cart: any }) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="text-lg font-semibold">Order Summary</h2>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm">Subtotal</span>
          <span className="text-sm font-medium">
            ₹{cart?.cost.subtotalAmount.amount.toString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Shipping</span>
          <span className="text-sm font-medium">
            {cart?.cost.shippingAmount?.amount.toString() || "Free"}
          </span>
        </div>
        <Separator />
        <div className="flex items-center justify-between font-medium">
          <span>Total</span>
          <span>₹{cart?.cost.totalAmount.amount.toString()}</span>
        </div>
      </div>
    </div>
  );
}
