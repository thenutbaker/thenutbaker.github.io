import axios from "axios";
import { CollectionInfo, Items } from "./App.types";

// Base URL of the backend API. Set per environment in .env.development
// (`npm start`) and .env.production (`npm run build`).
const API_BASE_URL = (
  process.env.REACT_APP_API_BASE_URL ??
  "https://nutbaker-form-backend-710083726956.asia-southeast1.run.app/"
).replace(/\/+$/, "");

export const apiUrl = (path: string): string => `${API_BASE_URL}/${path}`;

// Amounts are in minor units (cents); the formatted* fields are the same
// amounts formatted for display by the backend, e.g. "$12.50".
export type PricedItem = {
  productCode: string;
  label: string;
  quantity: number;
  price: number;
  formattedPrice: string;
  variants: { variant: string; quantity: number }[];
};

export type PriceBreakdown = {
  // one entry per product, in the order of the items
  items: PricedItem[];
  subtotal: number;
  formattedSubtotal: string;
  deliveryFee: number;
  formattedDeliveryFee: string;
  promo?: {
    code: string;
    description: string;
    discount: number;
    formattedDiscount: string;
  };
  // why the requested promo code was not applied
  promoError?: string;
  total: number;
  formattedTotal: string;
};

export type PriceOrderRequest = {
  items: Items;
  collectionMode?: CollectionInfo["collectionMode"];
  promoCode?: string;
};

// priceOrder asks the backend to price the items, the same way it will price
// the order when it is placed.
export const priceOrder = async (
  request: PriceOrderRequest,
  signal?: AbortSignal,
): Promise<PriceBreakdown> => {
  const response = await axios.post<PriceBreakdown>(
    apiUrl("priceOrder"),
    request,
    { signal },
  );
  return response.data;
};
