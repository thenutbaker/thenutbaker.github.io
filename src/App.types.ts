import { ProductCode } from "./products.const";

export type Items = Partial<Record<ProductCode, Record<string, number>>>;

export type Page = "order" | "collection" | "checkout" | "success";
