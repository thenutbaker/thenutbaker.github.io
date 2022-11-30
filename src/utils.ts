import { DynamicSpecials, Items } from "./App.types";
import { ProductCode, PRODUCTS } from "./products.const";

export const formatMinor = (minor: number): string => {
  return `$${(minor / 100).toFixed(2)}`;
};
export const calculatePriceMinor = (
  items: Items,
  specials: DynamicSpecials | null
): number => {
  return Object.keys(items).reduce((sum, productCode) => {
    const product = PRODUCTS[productCode as ProductCode];
    const itemsOfProduct = items[productCode];
    if (!itemsOfProduct) {
      return sum;
    }
    const qtyOfProduct = Object.values(itemsOfProduct).reduce(
      (sum, qty) => sum + (qty ?? 0),
      0
    );

    if (product) {
      return sum + product.price(qtyOfProduct);
    } else {
      const specialProduct = specials?.products?.find(
        (product) => product.productCode === productCode
      );
      if (!specialProduct) {
        return sum;
      }
      return sum + specialProduct.price * qtyOfProduct;
    }
  }, 0);
};

export const calculatePriceString = (
  items: Items,
  specials: DynamicSpecials | null
): string => {
  return formatMinor(calculatePriceMinor(items, specials));
};
