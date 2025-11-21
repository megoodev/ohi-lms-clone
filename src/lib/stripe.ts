import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SEKERT_KEY as string, {
  apiVersion: "2025-10-29.clover",
  typescript: true,
});
