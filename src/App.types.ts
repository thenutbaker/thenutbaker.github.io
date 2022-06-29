import { ProductCode } from "./products.const";

export type Item = {
  productCode: ProductCode;
  variant: string;
  quantity: number;
};

export type Page = "order" | "checkout" | "success";
