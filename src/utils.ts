import { Items } from "./App.types";
import { ProductCode, PRODUCTS } from "./products.const";

export const calculatePrice = (items: Items) => {
  console.log("calculating price");
  const totalInMinor = Object.keys(items).reduce((sum, productCode) => {
    const product = PRODUCTS[productCode as ProductCode];
    const itemsOfProduct = items[productCode as ProductCode];
    console.log(product);
    console.log(itemsOfProduct);
    if (!itemsOfProduct) {
      return sum;
    }
    const qtyOfProduct = Object.values(itemsOfProduct).reduce(
      (sum, qty) => sum + (qty ?? 0),
      0
    );
    console.log(qtyOfProduct);
    return sum + product.price(qtyOfProduct);
  }, 0);
  return `$${(totalInMinor / 100).toFixed(2)}`;
};
