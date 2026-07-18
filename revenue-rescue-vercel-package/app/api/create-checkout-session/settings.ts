import { requiredEnv, PRODUCT_NAME, PRICE_CENTS, CURRENCY } from "../../../lib/config";
export { PRODUCT_NAME, PRICE_CENTS, CURRENCY };
export function getAppUrl() { return requiredEnv("APP_URL"); }
