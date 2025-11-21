export type Items = Partial<Record<string, Record<string, number>>>;
export type CollectionInfo = {
  name: string;
  contactNumber: string;
  collectionMode: "self-collection" | "delivery";
  isGift: boolean;
  deliveryAddress?: string;
  condoName?: string;
  deliveryInstructions?: string;
  unitNumber?: string;
  postalCode?: string;
  giftRecipientName?: string;
  selfCollectionDate?: Date;
  deliveryDate?: Date;
};

export type Page = "order" | "collection" | "checkout" | "success";

export type DynamicFlavours = {
  granola: string[];
  muffins: string[];
  low_carb_granola: string[];
  nuttie_florentines: string[];
  nuttie_florentines_short: string[];
};

export type DynamicConfigs = {
  blockedDates: {
    start: string;
    end: string;
  };
};

export enum UiElementType {
  Header = "header",
  Selection = "selection",
  SelectionWithFlavours = "selection-with-flavours",
  Image = "image",
}

type HeaderUiElement = {
  type: UiElementType.Header;
  title: string;
  subtitle: string;
  subtitleSetInnerHtml?: boolean;
};

type ImageUiElement = {
  type: UiElementType.Image;
  filename: string;
};

type SelectionUiElement = {
  type: UiElementType.Selection;
  title: string;
  subtitle: string;
  options: {
    label: string;
    productCode: string;
  }[];
  minSingleQuantity?: number;
  singleItemMaxQuantity?: number;
  quantity?: {
    min?: number;
    max?: number;
    validateZero?: boolean;
  };
};

type SelectionWithFlavoursUiElement = {
  type: UiElementType.SelectionWithFlavours;
  title: string;
  subtitle: string;
  productCode: string;
  flavourKey: keyof DynamicFlavours;
  minSingleQuantity?: number;
  singleItemMaxQuantity?: number;
  quantity?: {
    min?: number;
    max?: number;
    validateZero?: boolean;
  };
};

type UiElement =
  | HeaderUiElement
  | SelectionUiElement
  | SelectionWithFlavoursUiElement
  | ImageUiElement;

export type DynamicSpecials = {
  products: {
    label: string;
    price: number;
    productCode: string;
  }[];
  bottom_ui_elements: UiElement[];
  top_ui_elements: UiElement[];
  ui_elements: UiElement[];
};
