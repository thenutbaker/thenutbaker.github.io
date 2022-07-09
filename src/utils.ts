import { Items } from "./App.types";
import { ProductCode, PRODUCTS } from "./products.const";

export const formatMinor = (minor: number): string => {
  return `$${(minor / 100).toFixed(2)}`;
};
export const calculatePriceMinor = (items: Items): number => {
  return Object.keys(items).reduce((sum, productCode) => {
    const product = PRODUCTS[productCode as ProductCode];
    const itemsOfProduct = items[productCode as ProductCode];
    if (!itemsOfProduct) {
      return sum;
    }
    const qtyOfProduct = Object.values(itemsOfProduct).reduce(
      (sum, qty) => sum + (qty ?? 0),
      0
    );
    return sum + product.price(qtyOfProduct);
  }, 0);
};

export const calculatePriceString = (items: Items): string => {
  return formatMinor(calculatePriceMinor(items));
};
