import { ProductCode } from "./products.const";

export type Items = Partial<Record<ProductCode, Record<string, number>>>;
export type CollectionInfo = {
  name: string;
  contactNumber: string;
  collectionMode: "self-collection" | "delivery";
  isGift: boolean;
  deliveryAddress?: string;
  condoName?: string;
  unitNumber?: string;
  postalCode?: string;
  giftRecipientName?: string;
  selfCollectionDate?: Date;
  deliveryDate?: Date;
};

export type Page = "order" | "collection" | "checkout" | "success";
