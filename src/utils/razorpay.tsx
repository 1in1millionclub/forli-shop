"use server";
import Razorpay from "razorpay";

const key_id = process.env.RAZORPAY_KEY_ID as string;
const key_secret = process.env.RAZORPAY_KEY_SECRET as string;

if (!key_id || !key_secret) {
  throw new Error("Razorpay keys are missing");
}

const razorpay = new Razorpay({
  key_id,
  key_secret,
});

export async function createOrderId(amount: number) {
  try {
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt#${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    console.log(order);
    return order;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create order");
  }
}
export async function verifyOrder(amount: number) {
  try {
    const options = {
      amount,
      currency: "INR",
      receipt: `receipt#${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    console.log(order);
    return order;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create order");
  }
}
