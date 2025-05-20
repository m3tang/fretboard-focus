import "server-only";

import Stripe from "stripe";

// Assert that the env variable exists (will throw if not set)
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY in environment variables");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
