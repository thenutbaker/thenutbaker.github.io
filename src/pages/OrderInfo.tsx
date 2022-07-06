import { Button, Paper, Typography } from "@mui/material";
import { useState } from "react";
import { Items, Page } from "../App.types";
import MultiVariantSelect from "../components/MultiVariantSelect";
import SectionHeader from "../components/SectionHeader";
import {
  GRANOLA_FLAVOURS,
  LOW_CARB_GRANOLA_FLAVOURS,
  MAX_QUANTITY,
  MUFFIN_FLAVOURS,
  NUTBAKER_PASS_OPTIONS,
  OATMEAL_COOKIE_FLAVOURS,
  ProductCode,
} from "../products.const";
import { calculatePrice } from "../utils";

type OrderInfoProps = {
  setItems: React.Dispatch<React.SetStateAction<Items>>;
  setPage: (page: Page) => void;
  items: Items;
};

const OrderInfo = (props: OrderInfoProps) => {
  const { setItems, items, setPage } = props;
  const [errorMap, setErrorMap] = useState<Record<string, boolean>>({});

  const numItems = Object.keys(items).reduce<number>((sum, productCode) => {
    const itemsOfProduct = items[productCode as ProductCode];
    if (!itemsOfProduct) {
      return sum;
    }
    return (
      sum +
      Object.values(itemsOfProduct).reduce((sum, qty) => sum + (qty ?? 0), 0)
    );
  }, 0);

  return (
    <>
      <SectionHeader
        title="Granola (The Usual Suspects)"
        subtitle="Medley of oats, rice puffs, nuts, and seeds"
        extraMarginTop={false}
      />
      <MultiVariantSelect
        setErrorMap={setErrorMap}
        setItems={setItems}
        items={items}
        title="50g Granola"
        subtitle="3 for $10, 4 for $13, 5 for $15, 7 for $20"
        options={GRANOLA_FLAVOURS.map((flavour) => ({
          productCode: "GRANOLA_50",
          label: flavour,
        }))}
        quantity={{ min: 3, max: 20 }}
        allowQuantitySelection
      />
      <MultiVariantSelect
        setErrorMap={setErrorMap}
        setItems={setItems}
        items={items}
        title="200g Granola"
        subtitle={"1 for $13, 2 for $25, 3 for $35, 4 for $45"}
        options={GRANOLA_FLAVOURS.map((flavour) => ({
          productCode: "GRANOLA_200",
          label: flavour,
        }))}
        quantity={{
          max: MAX_QUANTITY,
        }}
        allowQuantitySelection
      />
      <MultiVariantSelect
        setErrorMap={setErrorMap}
        setItems={setItems}
        items={items}
        title="400g Granola"
        subtitle="1 for $25, 2 for $45, 3 for $65, 4 for $80"
        options={GRANOLA_FLAVOURS.map((flavour) => ({
          productCode: "GRANOLA_400",
          label: flavour,
        }))}
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
        setErrorMap={setErrorMap}
        setItems={setItems}
        items={items}
        title="200g Granola (Low Carb)"
        subtitle={"$18 per pack"}
        options={LOW_CARB_GRANOLA_FLAVOURS.map((flavour) => ({
          productCode: "LOW_CARB_GRANOLA_200",
          label: flavour,
        }))}
        quantity={{
          max: MAX_QUANTITY,
        }}
        allowQuantitySelection
      />
      <MultiVariantSelect
        setErrorMap={setErrorMap}
        setItems={setItems}
        items={items}
        title="400g Granola (Low Carb)"
        subtitle="$32 per pack"
        options={LOW_CARB_GRANOLA_FLAVOURS.map((flavour) => ({
          productCode: "LOW_CARB_GRANOLA_400",
          label: flavour,
        }))}
        quantity={{
          max: MAX_QUANTITY,
        }}
        allowQuantitySelection
      />

      <SectionHeader title="Oatmeal Cookies" />
      <MultiVariantSelect
        setErrorMap={setErrorMap}
        setItems={setItems}
        items={items}
        title="170g (7-8 cookies)"
        subtitle="1 for $8, 2 for $15, 3 for $22"
        options={OATMEAL_COOKIE_FLAVOURS.map((flavour) => ({
          productCode: "OATMEAL_COOKIES",
          label: flavour,
        }))}
        quantity={{
          max: MAX_QUANTITY,
        }}
        allowQuantitySelection
      />

      <SectionHeader title="Muffins" />
      <MultiVariantSelect
        setErrorMap={setErrorMap}
        setItems={setItems}
        items={items}
        title="Box of 6"
        subtitle="1 for $20, 2 for $38, 3 for $56"
        options={MUFFIN_FLAVOURS.map((flavour) => ({
          productCode: "MUFFINS",
          label: flavour,
        }))}
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
        setErrorMap={setErrorMap}
        setItems={setItems}
        items={items}
        title="The Nutbaker Pass"
        subtitle="Pls DM/ whatsapp me at 88016714 to indicate delivery details and flavour choices."
        options={NUTBAKER_PASS_OPTIONS}
        quantity={{
          max: MAX_QUANTITY,
        }}
        allowQuantitySelection={false}
      />

      <Paper
        sx={{
          backgroundColor: "#D2973D",
          gridColumnStart: "1",
          gridColumnEnd: "4",
          marginTop: "4em",
          padding: "1em",
          display: "flex",
          marginBottom: "0",
          justifyContent: "space-between",
          alignContent: "center",
          position: "sticky",
          bottom: 0,
          right: 0,
          left: 0,
        }}
      >
        <Typography
          sx={{ fontWeight: "medium", marginTop: "auto", marginBottom: "auto" }}
        >
          Total: {calculatePrice(items)}
        </Typography>
        {numItems > 20 && (
          <Typography
            sx={{ color: "#F60404", marginTop: "auto", marginBottom: "auto" }}
          >
            For orders with more than 20 items, please contact us directly
          </Typography>
        )}
        <Button
          sx={{
            backgroundColor: "#F5D998",
            color: "black",
            padding: "0.5em",
            marginLeft: "0.5em",
          }}
          onClick={() => setPage("collection")}
          disabled={
            numItems === 0 ||
            numItems > 20 ||
            Object.values(errorMap).some((hasError) => hasError)
          }
        >
          Next: Collection Details
        </Button>
      </Paper>
      <div />
    </>
  );
};

export default OrderInfo;
