import Stripe from "stripe";
import { requiredEnv } from "./config";

export function stripe() {
  return new Stripe(requiredEnv("STRIPE_SECRET_KEY"), {
    apiVersion: "2025-02-24.acacia"
  });
}
