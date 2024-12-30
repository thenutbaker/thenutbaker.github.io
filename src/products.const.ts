export const NUTBAKER_HANDS_ON_VARIANTS = [
  "200g Granola + Oatmeal Cookies",
  "200g Granola + Muffins",
  "200g Granola + Yoghurt Parfait Assembly",
];

export type ProductCode =
  | "GRANOLA_50"
  | "GRANOLA_200"
  | "GRANOLA_400"
  | "GRANOLA_200_FOTM"
  | "GRANOLA_400_FOTM"
  | "LOW_CARB_GRANOLA_200"
  | "LOW_CARB_GRANOLA_400"
  | "NUTTIE_FLORENTINES_200"
  | "NUTTIE_FLORENTINES_300"
  | "MUFFINS"
  | "MUFFINS_4"
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
  GRANOLA_200_FOTM: {
    price: (quantity: number) => quantity * 1400,
    label: "Granola of the month (200g)",
  },
  GRANOLA_400_FOTM: {
    price: (quantity: number) => quantity * 2500,
    label: "Granola of the month (400g)",
  },
  LOW_CARB_GRANOLA_200: {
    price: (quantity: number) => quantity * 1800,
    label: "200g Granola (Low Carb)",
  },
  LOW_CARB_GRANOLA_400: {
    price: (quantity: number) => quantity * 3500,
    label: "400g Granola (Low Carb)",
  },
  NUTTIE_FLORENTINES_200: {
    price: (quantity: number) => quantity * 1900,
    label: "200g Nutty Crisps/Florentines",
  },
  NUTTIE_FLORENTINES_300: {
    price: (quantity: number) => quantity * 2800,
    label: "300g Nutty Crisps/Florentines",
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
    label: "Muffins (Box of 6)",
  },
  MUFFINS_4: {
    price: (quantity: number) => {
      const numBundlesOf4 = Math.floor(quantity / 4);
      const remainder = quantity % 4;
      switch (remainder) {
        case 0:
          return numBundlesOf4 * 5500;
        case 1:
          return numBundlesOf4 * 5500 + 1500;
        case 2:
          return numBundlesOf4 * 5500 + 2900;
        case 3:
          return numBundlesOf4 * 5500 + 4200;
        default:
          return 99999999999999;
      }
    },
    label: "Muffins (Box of 4)",
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
