export const MAX_QUANTITY = 20;
export const GRANOLA_FLAVOURS = [
  "Original",
  "Dark Choc Sea Salt",
  "Peanut Butter",
  "Matcha Almond",
  "Speculoos Walnut",
  "Gula Melaka",
  "Black Sesame",
  "Malted Milk",
  "Berry Crumble",
  "Chai Latte",
];

export const LOW_CARB_GRANOLA_FLAVOURS = [
  "Vanilla Coconut",
  "Cocoa Nutty",
  "Peanut Sesame",
];

export const MUFFIN_FLAVOURS = [
  "Blueberry Walnut",
  "Matcha Choc Chip",
  "Banana Pecan",
  "Cinnamon Raisin",
];

export const OATMEAL_COOKIE_FLAVOURS = [
  "The Anzac (Coconut)",
  "Matcha Whatcha",
  "Open Sesame",
  "Cocoa Lover",
];

export const NUTBAKER_PASS_OPTIONS: {
  productCode: ProductCode;
  label: string;
}[] = [
  {
    productCode: "NUTBAKER_PASS_OCCASIONAL",
    label: "Occasional - 8 x 200g, $96 ($53/kg)",
  },
  {
    productCode: "NUTBAKER_PASS_REGULAR",
    label: "Regular - 15 x 200g, $165 ($49/kg)",
  },
  {
    productCode: "NUTBAKER_PASS_SILVER",
    label: "Silver - 8 x 400g, $160 ($44/kg)",
  },
  {
    productCode: "NUTBAKER_PASS_GOLD",
    label: "Gold - 15 x 400g, $285 ($42/kg)",
  },
];

export type ProductCode =
  | "GRANOLA_50"
  | "GRANOLA_200"
  | "GRANOLA_400"
  | "LOW_CARB_GRANOLA_200"
  | "LOW_CARB_GRANOLA_400"
  | "OATMEAL_COOKIES"
  | "MUFFINS"
  | "NUTBAKER_PASS_OCCASIONAL"
  | "NUTBAKER_PASS_REGULAR"
  | "NUTBAKER_PASS_SILVER"
  | "NUTBAKER_PASS_GOLD";

type Product = {
  price: (quantity: number) => number;
  label: string;
};

export const PRODUCTS: Record<ProductCode, Product> = {
  GRANOLA_50: {
    /**
     * 3 for $10
     * 4 for $13
     * 5 for $15
     * 7 for $20
     */
    price: (quantity: number) => {
      if (quantity < 3) {
        return 0;
      }
      let remainingQuantity = quantity;
      let totalPrice = 0;
      let numBundlesOf7 = Math.floor(quantity / 7);
      const remainder = quantity % 7;
      if (remainder === 1) {
        numBundlesOf7 = Math.max(0, numBundlesOf7 - 2);
      }
      if (remainder === 2) {
        numBundlesOf7 -= 1;
      }

      totalPrice += numBundlesOf7 * 2000;
      remainingQuantity -= numBundlesOf7 * 7;

      // remainingQuantity must now be 0,3,4,5,6,8,15
      if (remainingQuantity === 6) {
        return totalPrice + 2 * 1000;
      }

      const numBundlesOf5 = Math.floor(remainingQuantity / 5);
      totalPrice += numBundlesOf5 * 1500;
      remainingQuantity -= numBundlesOf5 * 5;

      switch (remainingQuantity) {
        case 3:
          totalPrice += 1000;
          break;
        case 4:
          totalPrice += 1300;
      }
      return totalPrice;
    },
    label: "50g Granola",
  },
  GRANOLA_200: {
    price: (quantity: number) => {
      const numBundlesOf4 = Math.floor(quantity / 4);
      const remainder = quantity % 4;
      switch (remainder) {
        case 0:
          return numBundlesOf4 * 4500;
        case 1:
          return numBundlesOf4 * 4500 + 1300;
        case 2:
          return numBundlesOf4 * 4500 + 2500;
        case 3:
          return numBundlesOf4 * 4500 + 3500;
        default:
          return 99999999999999;
      }
    },
    label: "200g Granola",
  },
  GRANOLA_400: {
    price: (quantity: number) => {
      const numBundlesOf4 = Math.floor(quantity / 4);
      const remainder = quantity % 4;
      switch (remainder) {
        case 0:
          return numBundlesOf4 * 8000;
        case 1:
          return numBundlesOf4 * 8000 + 2500;
        case 2:
          return numBundlesOf4 * 8000 + 4500;
        case 3:
          return numBundlesOf4 * 8000 + 6500;
        default:
          return 99999999999999;
      }
    },
    label: "400g Granola",
  },
  LOW_CARB_GRANOLA_200: {
    price: (quantity: number) => quantity * 1800,
    label: "200g Granola (Low Carb)",
  },
  LOW_CARB_GRANOLA_400: {
    price: (quantity: number) => quantity * 3200,
    label: "400g Granola (Low Carb)",
  },
  OATMEAL_COOKIES: {
    price: (quantity: number) => {
      const numBundlesOf3 = Math.floor(quantity / 3);
      const remainder = quantity % 3;
      switch (remainder) {
        case 0:
          return numBundlesOf3 * 2200;
        case 1:
          return numBundlesOf3 * 2200 + 800;
        case 2:
          return numBundlesOf3 * 2200 + 1500;
        default:
          return 99999999999999;
      }
    },
    label: "Oatmeal Cookies",
  },
  MUFFINS: {
    price: (quantity: number) => {
      const numBundlesOf3 = Math.floor(quantity / 3);
      const remainder = quantity % 3;
      switch (remainder) {
        case 0:
          return numBundlesOf3 * 5600;
        case 1:
          return numBundlesOf3 * 5600 + 2000;
        case 2:
          return numBundlesOf3 * 5600 + 3800;
        default:
          return 99999999999999;
      }
    },
    label: "Muffins",
  },
  NUTBAKER_PASS_OCCASIONAL: {
    price: (quantity: number) => quantity * 9600,
    label: "The Nutbaker Pass (Occasional)",
  },
  NUTBAKER_PASS_REGULAR: {
    price: (quantity: number) => quantity * 16500,
    label: "The Nutbaker Pass (Regular)",
  },
  NUTBAKER_PASS_SILVER: {
    price: (quantity: number) => quantity * 16000,
    label: "The Nutbaker Pass (Silver)",
  },
  NUTBAKER_PASS_GOLD: {
    price: (quantity: number) => quantity * 28500,
    label: "The Nutbaker Pass (Gold)",
  },
};
