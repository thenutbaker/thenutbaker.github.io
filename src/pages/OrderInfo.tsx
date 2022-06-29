import MultiVariantSelect from "../components/MultiVariantSelect";
import { GRANOLA_FLAVOURS } from "../products.const";
import { Item, Page } from "../App.types";
import SectionHeader from "../components/SectionHeader";
import {
  LOW_CARB_GRANOLA_FLAVOURS,
  MUFFIN_FLAVOURS,
  NUTBAKER_PASS_OPTIONS,
  OATMEAL_COOKIE_FLAVOURS,
} from "../products.const";
import { useState } from "react";

type OrderInfoProps = {
  setItems: (items: Item[]) => void;
  setPage: (page: Page) => void;
};

const OrderInfo = (props: OrderInfoProps) => {
  const [showNutbakerPass200Options, setShowNutbakerPass200Options] =
    useState(false);
  const [nutbakerPass200Qty, setNutbakerPass200Qty] = useState(0);

  const [showNutbakerPass400Options, setShowNutbakerPass400Options] =
    useState(false);
  const [nutbakerPass400Qty, setNutbakerPass400Qty] = useState(0);

  const [
    showGranolaOatmealCookiesBundleOptions,
    setShowGranolaOatmealCookiesBundleOptions,
  ] = useState(false);
  const [granolaOatmealBundleQty, setGranolaOatmealBundleQty] = useState(0);

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
        quantity={{ min: 3 }}
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
        allowQuantitySelection
      />

      <SectionHeader title="Bundles" />
      <MultiVariantSelect
        title="The Nutbaker Pass - Bulk orders for granola, get them delivered as and when you like!"
        subtitle="Pls DM/ whatsapp me at 88016714 to indicate delivery details."
        options={NUTBAKER_PASS_OPTIONS}
        onChange={(selections) => {
          let required200gQty = 0;
          let required400gQty = 0;
          setShowNutbakerPass200Options(false);
          setShowNutbakerPass400Options(false);
          for (const selection of selections) {
            if (selection.productCode === "NUTBAKER_PASS_OCCASIONAL") {
              required200gQty += 8;
              setShowNutbakerPass200Options(true);
            }
            if (selection.productCode === "NUTBAKER_PASS_REGULAR") {
              required200gQty += 15;
              setShowNutbakerPass200Options(true);
            }
            if (selection.productCode === "NUTBAKER_PASS_SILVER") {
              required400gQty += 8;
              setShowNutbakerPass400Options(true);
            }
            if (selection.productCode === "NUTBAKER_PASS_GOLD") {
              required400gQty += 15;
              setShowNutbakerPass400Options(true);
            }
          }
          setNutbakerPass200Qty(required200gQty);
          setNutbakerPass400Qty(required400gQty);
        }}
        allowQuantitySelection={false}
      />
      {showNutbakerPass200Options && (
        <MultiVariantSelect
          title="Granola Flavours"
          subtitle="For Nutbaker Pass (200g - Occasional/Regular)"
          options={GRANOLA_FLAVOURS.map((flavour) => ({
            productCode: "PLACEHOLDER",
            label: flavour,
          }))}
          onChange={() => {}}
          allowQuantitySelection
          quantity={{
            min: nutbakerPass200Qty,
            max: nutbakerPass200Qty,
            validateZero: true,
          }}
          singleItemMaxQty={nutbakerPass200Qty}
        />
      )}
      {showNutbakerPass400Options && (
        <MultiVariantSelect
          title="Granola Flavours"
          subtitle="For Nutbaker Pass (400g - Silver/Gold)"
          options={GRANOLA_FLAVOURS.map((flavour) => ({
            productCode: "PLACEHOLDER",
            label: flavour,
          }))}
          onChange={() => {}}
          allowQuantitySelection
          quantity={{
            min: nutbakerPass400Qty,
            max: nutbakerPass400Qty,
            validateZero: true,
          }}
          singleItemMaxQty={nutbakerPass400Qty}
        />
      )}
      <MultiVariantSelect
        title="Granola + Oatmeal Cookies"
        subtitle="1 for $20, 2 for $40, 3 for $56"
        options={[
          {
            productCode: "GRANOLA_OATMEAL_COOKIES_BUNDLE",
            label: "1 Pack 200g Granola + 1 Pack Oatmeal Cookies",
          },
        ]}
        onChange={(selections) => {
          setShowGranolaOatmealCookiesBundleOptions(selections.length > 0);
          if (selections.length > 0) {
            setGranolaOatmealBundleQty(selections[0].quantity);
          }
        }}
        allowQuantitySelection={true}
        singleItemMaxQty={3}
      />
      {showGranolaOatmealCookiesBundleOptions && (
        <MultiVariantSelect
          title="Granola Flavours"
          subtitle="For Granola + Oatmeal Cookies Bundle"
          options={GRANOLA_FLAVOURS.map((flavour) => ({
            productCode: "PLACEHOLDER",
            label: flavour,
          }))}
          onChange={() => {}}
          allowQuantitySelection
          quantity={{
            max: granolaOatmealBundleQty,
            min: granolaOatmealBundleQty,
            validateZero: true,
          }}
        />
      )}
      {showGranolaOatmealCookiesBundleOptions && (
        <MultiVariantSelect
          title="Oatmeal Cookies Flavour"
          subtitle="For Granola + Oatmeal Cookies Bundle"
          options={OATMEAL_COOKIE_FLAVOURS.map((flavour) => ({
            productCode: "PLACEHOLDER",
            label: flavour,
          }))}
          onChange={() => {}}
          allowQuantitySelection
          quantity={{
            max: granolaOatmealBundleQty,
            min: granolaOatmealBundleQty,
            validateZero: true,
          }}
        />
      )}

      <div />
    </>
  );
};

export default OrderInfo;
