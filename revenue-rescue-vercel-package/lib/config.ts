export const PRODUCT_NAME = "Revenue Rescue Audit";
export const PRICE_CENTS = 14900;
export const CURRENCY = "usd";

export function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}
