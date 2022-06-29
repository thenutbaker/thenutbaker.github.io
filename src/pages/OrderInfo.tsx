import { Item, Page } from "../App.types";
import MultiVariantSelect from "../components/MultiVariantSelect";
import SectionHeader from "../components/SectionHeader";
import {
  GRANOLA_FLAVOURS,
  LOW_CARB_GRANOLA_FLAVOURS,
  MAX_QUANTITY,
  MUFFIN_FLAVOURS,
  NUTBAKER_PASS_OPTIONS,
  OATMEAL_COOKIE_FLAVOURS,
} from "../products.const";

type OrderInfoProps = {
  setItems: (items: Item[]) => void;
  setPage: (page: Page) => void;
};

const OrderInfo = (props: OrderInfoProps) => {
  return (
    <>
      <SectionHeader
        title="Granola (The Usual Suspects)"
        subtitle="Medley of oats, rice puffs, nuts, and seeds"
        extraMarginTop={false}
      />
      <MultiVariantSelect
        title="50g Granola"
        subtitle="3 for $10, 4 for $13, 5 for $15, 7 for $20"
        options={GRANOLA_FLAVOURS.map((flavour) => ({
          productCode: "GRANOLA_50",
          label: flavour,
        }))}
        onChange={() => {}}
        quantity={{ min: 3, max: 20 }}
        allowQuantitySelection
      />
      <MultiVariantSelect
        title="200g Granola"
        subtitle={"1 for $13, 2 for $25, 3 for $35, 4 for $45"}
        options={GRANOLA_FLAVOURS.map((flavour) => ({
          productCode: "GRANOLA_200",
          label: flavour,
        }))}
        onChange={() => {}}
        quantity={{
          max: MAX_QUANTITY,
        }}
        allowQuantitySelection
      />
      <MultiVariantSelect
        title="400g Granola"
        subtitle="1 for $25, 2 for $45, 3 for $65, 4 for $80"
        options={GRANOLA_FLAVOURS.map((flavour) => ({
          productCode: "GRANOLA_400",
          label: flavour,
        }))}
        onChange={() => {}}
        quantity={{
          max: MAX_QUANTITY,
        }}
        allowQuantitySelection
      />
      <SectionHeader
        title="Granola (Low Carb)"
        subtitle="Grain-free, higher in protein and healthy fats"
      />
      <MultiVariantSelect
        title="200g Granola (Low Carb)"
        subtitle={"$18 per pack"}
        options={LOW_CARB_GRANOLA_FLAVOURS.map((flavour) => ({
          productCode: "LOW_CARB_GRANOLA_200",
          label: flavour,
        }))}
        onChange={() => {}}
        quantity={{
          max: MAX_QUANTITY,
        }}
        allowQuantitySelection
      />
      <MultiVariantSelect
        title="400g Granola (Low Carb)"
        subtitle="$32 per pack"
        options={LOW_CARB_GRANOLA_FLAVOURS.map((flavour) => ({
          productCode: "LOW_CARB_GRANOLA_400",
          label: flavour,
        }))}
        onChange={() => {}}
        quantity={{
          max: MAX_QUANTITY,
        }}
        allowQuantitySelection
      />

      <SectionHeader title="Oatmeal Cookies" />
      <MultiVariantSelect
        title="170g (7-8 cookies)"
        subtitle="1 for $8, 2 for $15, 3 for $22"
        options={OATMEAL_COOKIE_FLAVOURS.map((flavour) => ({
          productCode: "OATMEAL_COOKIES",
          label: flavour,
        }))}
        onChange={() => {}}
        quantity={{
          max: MAX_QUANTITY,
        }}
        allowQuantitySelection
      />

      <SectionHeader title="Muffins" />
      <MultiVariantSelect
        title="Box of 6"
        subtitle="1 for $20, 2 for $38, 3 for $56"
        options={MUFFIN_FLAVOURS.map((flavour) => ({
          productCode: "MUFFINS",
          label: flavour,
        }))}
        onChange={() => {}}
        quantity={{
          max: MAX_QUANTITY,
        }}
        allowQuantitySelection
      />

      <SectionHeader
        title="The Nutbaker Pass"
        subtitle="Bulk orders for granola, get them delivered as and when you like!"
      />
      <MultiVariantSelect
        title="The Nutbaker Pass"
        subtitle="Pls DM/ whatsapp me at 88016714 to indicate delivery details and flavour choices."
        options={NUTBAKER_PASS_OPTIONS}
        onChange={() => {}}
        quantity={{
          max: MAX_QUANTITY,
        }}
        allowQuantitySelection={false}
      />

      <div />
    </>
  );
};

export default OrderInfo;
