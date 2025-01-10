export const NUTBAKER_HANDS_ON_VARIANTS = [
  "200g Granola + Oatmeal Cookies",
  "200g Granola + Muffins",
  "200g Granola + Yoghurt Parfait Assembly",
];

// note: only products with bundle pricing have the logic hardcoded here, due to the complexity of calculation
// prices for products with fixed pricing are stored in the database
export type ProductCode =
  | "GRANOLA_50"
  | "GRANOLA_200"
  | "GRANOLA_400"
  | "NUTBAKER_HANDS_ON";

type Product = {
  price: (quantity: number) => number;
  label: string;
};

export const PRODUCTS: Record<ProductCode, Product> = {
  GRANOLA_50: {
    /**
     * 4 for $16
     * 5 for $19
     * 6 for $22
     * 7 for $25
     */
    price: (quantity: number) => {
      if (quantity < 4) {
        return 0;
      }

      let numBundlesOf7 = Math.floor(quantity / 7);
      const remainder = quantity % 7;

      switch (remainder) {
        case 0:
          return numBundlesOf7 * 2500;
        case 1:
          // e.g. 15 will be 7 + 4 + 4, 8 will be 0 + 4 + 4
          return 2500 * Math.max(0, numBundlesOf7 - 1) + 2 * 1600;
        case 2:
          // e.g. 16 will be 7 + 5 + 4, 9 will be 0 + 5 + 4
          return 2500 * Math.max(0, numBundlesOf7 - 1) + 1900 + 1600;
        case 3:
          // e.g. 17 will be 7 + 5 + 5, 10 will be 0 + 5 + 5
          return 2500 * Math.max(0, numBundlesOf7 - 1) + 2 * 1900;
        case 4:
          return 2500 * numBundlesOf7 + 1600;
        case 5:
          return 2500 * numBundlesOf7 + 1900;
        case 6:
          return 2500 * numBundlesOf7 + 2200;
        default:
          return 99999999999999;
      }
    },
    label: "50g Granola",
  },
  GRANOLA_200: {
    price: (quantity: number) => {
      const numBundlesOf4 = Math.floor(quantity / 4);
      const remainder = quantity % 4;
      switch (remainder) {
        case 0:
          return numBundlesOf4 * 5400;
        case 1:
          return numBundlesOf4 * 5400 + 1500;
        case 2:
          return numBundlesOf4 * 5400 + 2800;
        case 3:
          return numBundlesOf4 * 5400 + 4200;
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
          return numBundlesOf4 * 9800;
        case 1:
          return numBundlesOf4 * 9800 + 2600;
        case 2:
          return numBundlesOf4 * 9800 + 5000;
        case 3:
          return numBundlesOf4 * 9800 + 7500;
        default:
          return 99999999999999;
      }
    },
    label: "400g Granola",
  },
  NUTBAKER_HANDS_ON: {
    price: (quantity: number) => {
      if (quantity <= 2) {
        return quantity * 8000;
      }
      return quantity * 7000;
    },
    label: "The Nutbaker - Hands-on!",
  },
};
