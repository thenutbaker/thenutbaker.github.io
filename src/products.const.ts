export const GRANOLA_FLAVOURS = [
  "Peach Tea (Oct Special)",
  "Original",
  "Dark Choc Sea Salt",
  "Peanut Butter",
  "Matcha Almond",
  "Speculoos Walnut",
  "Gula Melaka",
  "Black Sesame",
  "Malted Milk",
  "Berry Crumble",
];

export const LACTATION_GRANOLA_FLAVOURS = ["Lactation Granola"];

export const NUTTIE_FLORENTINES_FLAVOURS = [
  "Almond Seedy (Sliced almonds, pumpkin seeds, sunflower seeds, white sesame seeds)",
  "Peanut Sesame (Crushed peanuts, black sesame powder, white sesame seeds)",
];

export const NUTTIE_FLORENTINES_FLAVOURS_SHORT = [
  "Almond Seedy",
  "Peanut Sesame",
];

export const LOW_CARB_GRANOLA_FLAVOURS = [
  "Vanilla Coconut",
  "Cocoa Nutty",
  "Peanut Sesame",
];

export const MUFFIN_FLAVOURS = [
  "Blueberry Dark Choc",
  "Matcha Choc Chip",
  "Banana Choc Walnut",
  "Cinnamon Raisin Pecan",
  "Double Chocolate",
];

export const NUTBAKER_HANDS_ON_VARIANTS = [
  "200g Granola + Oatmeal Cookies (6-8)",
  "200g Granola + 3 Muffins",
];

export const NUTBAKER_PASS_OPTIONS: {
  productCode: ProductCode;
  label: string;
}[] = [
  {
    productCode: "NUTBAKER_PASS_OCCASIONAL",
    label: "Occasional - 8 x 200g, $96 ($60/kg)",
  },
  {
    productCode: "NUTBAKER_PASS_REGULAR",
    label: "Regular - 15 x 200g, $168 ($56/kg)",
  },
  {
    productCode: "NUTBAKER_PASS_SILVER",
    label: "Silver - 8 x 400g, $166 ($52/kg)",
  },
  {
    productCode: "NUTBAKER_PASS_GOLD",
    label: "Gold - 15 x 400g, $288 ($48/kg)",
  },
];

export type ProductCode =
  | "GRANOLA_50"
  | "GRANOLA_200"
  | "GRANOLA_400"
  | "LOW_CARB_GRANOLA_200"
  | "LOW_CARB_GRANOLA_400"
  | "LACTATION_GRANOLA_200"
  | "LACTATION_GRANOLA_400"
  | "NUTTIE_FLORENTINES_100"
  | "NUTTIE_FLORENTINES_150"
  | "NUTTIE_FLORENTINES_200"
  | "MUFFINS"
  | "MUFFINS_4"
  | "NUTBAKER_PASS_OCCASIONAL"
  | "NUTBAKER_PASS_REGULAR"
  | "NUTBAKER_PASS_SILVER"
  | "NUTBAKER_PASS_GOLD"
  | "NUTBAKER_HANDS_ON"
  | "CHRISTMAS_BUNDLE";

type Product = {
  price: (quantity: number) => number;
  label: string;
};

export const PRODUCTS: Record<ProductCode, Product> = {
  CHRISTMAS_BUNDLE: {
    price: (quantity: number) => quantity * 1500,
    label: "Christmas Bundle",
  },
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
          return numBundlesOf4 * 5000;
        case 1:
          return numBundlesOf4 * 5000 + 1400;
        case 2:
          return numBundlesOf4 * 5000 + 2700;
        case 3:
          return numBundlesOf4 * 5000 + 3900;
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
          return numBundlesOf4 * 9000;
        case 1:
          return numBundlesOf4 * 9000 + 2500;
        case 2:
          return numBundlesOf4 * 9000 + 4800;
        case 3:
          return numBundlesOf4 * 9000 + 7000;
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
  LACTATION_GRANOLA_200: {
    price: (quantity: number) => quantity * 1800,
    label: "200g Lactation Granola",
  },
  LACTATION_GRANOLA_400: {
    price: (quantity: number) => quantity * 3200,
    label: "400g Lactation Granola",
  },
  NUTTIE_FLORENTINES_100: {
    price: (quantity: number) => quantity * 1000,
    label: "100g Nutty Crisps/Florentines",
  },
  NUTTIE_FLORENTINES_150: {
    price: (quantity: number) => quantity * 1500,
    label: "150g Nutty Crisps/Florentines",
  },
  NUTTIE_FLORENTINES_200: {
    price: (quantity: number) => quantity * 1900,
    label: "200g Nutty Crisps/Florentines",
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
  NUTBAKER_PASS_OCCASIONAL: {
    price: (quantity: number) => quantity * 9600,
    label: "The Nutbaker Pass (Occasional)",
  },
  NUTBAKER_PASS_REGULAR: {
    price: (quantity: number) => quantity * 16800,
    label: "The Nutbaker Pass (Regular)",
  },
  NUTBAKER_PASS_SILVER: {
    price: (quantity: number) => quantity * 16600,
    label: "The Nutbaker Pass (Silver)",
  },
  NUTBAKER_PASS_GOLD: {
    price: (quantity: number) => quantity * 28800,
    label: "The Nutbaker Pass (Gold)",
  },
  NUTBAKER_HANDS_ON: {
    price: (quantity: number) => quantity * 5000,
    label: "The Nutbaker - Hands-on!",
  },
};
