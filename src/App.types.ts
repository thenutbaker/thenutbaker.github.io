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
  granola_of_the_month: string;
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
  granolaOfTheMonthDescription: string;
};

export enum UiElementType {
  Header = "header",
  Selection = "selection",
}

type HeaderUiElement = {
  type: UiElementType.Header;
  title: string;
  subtitle: string;
  subtitleSetInnerHtml?: boolean;
};

type SelectionUiElement = {
  type: UiElementType.Selection;
  title: string;
  subtitle: string;
  options: {
    label: string;
    productCode: string;
  }[];
};

export type DynamicSpecials = {
  products: {
    label: string;
    price: number;
    productCode: string;
  }[];
  bottom_ui_elements: (HeaderUiElement | SelectionUiElement)[];
  top_ui_elements: (HeaderUiElement | SelectionUiElement)[];
};
