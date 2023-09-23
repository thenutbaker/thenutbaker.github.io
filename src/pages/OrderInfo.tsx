import styled from "@emotion/styled";
import { Button, CircularProgress, Paper, Typography } from "@mui/material";
import { useState } from "react";
import {
  DynamicConfigs,
  DynamicFlavours,
  DynamicSpecials,
  Items,
  Page,
  UiElementType,
} from "../App.types";
import MultiVariantSelect from "../components/MultiVariantSelect";
import SectionHeader from "../components/SectionHeader";
import {
  LACTATION_GRANOLA_FLAVOURS,
  NUTBAKER_HANDS_ON_VARIANTS,
  NUTBAKER_PASS_OPTIONS,
  ProductCode,
} from "../products.const";
import { calculatePriceString } from "../utils";

type OrderInfoProps = {
  setItems: React.Dispatch<React.SetStateAction<Items>>;
  setPage: (page: Page) => void;
  items: Items;
  flavours: DynamicFlavours | null;
  specials: DynamicSpecials | null;
  configs: DynamicConfigs | null;
};

const Container = styled.div`
  grid-area: body;
  display: flex;
  flex-direction: column;
  justify-content: start;
  padding-bottom: 6rem;
  @media (min-width: 780px) {
    padding-bottom: 8rem;
  }
`;

const CircularProgressContainer = styled.div`
  grid-area: body;
  display: flex;
  justify-content: center;
  align-content: center;
  margin-top: 2rem;
  color: #f5d998;
`;

const OrderInfo = (props: OrderInfoProps) => {
  const { setItems, items, setPage, flavours, specials, configs } = props;
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
      {flavours && configs ? (
        <>
          <Container>
            {flavours?.granola_of_the_month?.length > 0 && (
              <>
                <SectionHeader
                  title="Granola of the month"
                  subtitle={configs.granolaOfTheMonthDescription ?? ""}
                />
                <MultiVariantSelect
                  setErrorMap={setErrorMap}
                  setItems={setItems}
                  items={items}
                  title="Granola of the month (200g)"
                  subtitle="$14 per pack"
                  options={[
                    {
                      label: flavours?.granola_of_the_month ?? "",
                      productCode: "GRANOLA_200_FOTM",
                    },
                  ]}
                  allowQuantitySelection
                />
                <MultiVariantSelect
                  setErrorMap={setErrorMap}
                  setItems={setItems}
                  items={items}
                  title="Granola of the month (400g)"
                  subtitle="$25 per pack"
                  options={[
                    {
                      label: flavours?.granola_of_the_month ?? "",
                      productCode: "GRANOLA_400_FOTM",
                    },
                  ]}
                  allowQuantitySelection
                />{" "}
              </>
            )}
            <SectionHeader
              title="Granola (The Classics)"
              subtitle="Medley of oats, rice puffs, nuts, and seeds"
            />
            <MultiVariantSelect
              setErrorMap={setErrorMap}
              setItems={setItems}
              items={items}
              title="50g Granola"
              subtitle="4 for $16, 5 for $19, 6 for $22, 7 for $25. Minimum order of 4 packs per flavour"
              options={(flavours?.granola ?? []).map((flavour) => ({
                productCode: "GRANOLA_50",
                label: flavour,
              }))}
              quantity={{ min: 4 }}
              minSingleQuantity={4}
              allowQuantitySelection
            />
            <MultiVariantSelect
              setErrorMap={setErrorMap}
              setItems={setItems}
              items={items}
              title="200g Granola"
              subtitle={"1 for $15, 2 for $28, 3 for $42, 4 for $54"}
              options={(flavours?.granola ?? []).map((flavour) => ({
                productCode: "GRANOLA_200",
                label: flavour,
              }))}
              allowQuantitySelection
            />
            <MultiVariantSelect
              setErrorMap={setErrorMap}
              setItems={setItems}
              items={items}
              title="400g Granola"
              subtitle="1 for $26, 2 for $50, 3 for $75, 4 for $98"
              options={(flavours?.granola ?? []).map((flavour) => ({
                productCode: "GRANOLA_400",
                label: flavour,
              }))}
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
              options={(flavours?.low_carb_granola ?? []).map((flavour) => ({
                productCode: "LOW_CARB_GRANOLA_200",
                label: flavour,
              }))}
              allowQuantitySelection
            />
            <MultiVariantSelect
              setErrorMap={setErrorMap}
              setItems={setItems}
              items={items}
              title="400g Granola (Low Carb)"
              subtitle="$35 per pack"
              options={(flavours?.low_carb_granola ?? []).map((flavour) => ({
                productCode: "LOW_CARB_GRANOLA_400",
                label: flavour,
              }))}
              allowQuantitySelection
            />

            <SectionHeader
              title="Lactation Granola"
              subtitle="We fortify oats (a natural milk booster) with omega-3 rich ingredients like walnuts, chia and flax seeds to help mamas stimulate milk production!"
            />
            <MultiVariantSelect
              setErrorMap={setErrorMap}
              setItems={setItems}
              items={items}
              title="200g Lactation Granola"
              subtitle={"$18 per pack"}
              options={LACTATION_GRANOLA_FLAVOURS.map((flavour) => ({
                productCode: "LACTATION_GRANOLA_200",
                label: flavour,
              }))}
              allowQuantitySelection
            />
            <MultiVariantSelect
              setErrorMap={setErrorMap}
              setItems={setItems}
              items={items}
              title="400g Lactation Granola"
              subtitle="$35 per pack"
              options={LACTATION_GRANOLA_FLAVOURS.map((flavour) => ({
                productCode: "LACTATION_GRANOLA_400",
                label: flavour,
              }))}
              allowQuantitySelection
            />

            <SectionHeader
              title="Nutty Crisps/Florentines"
              subtitle="Sweet-savoury blend of nuts and seeds. Thin and crispy, they're seriously addictive!"
            />
            <MultiVariantSelect
              setErrorMap={setErrorMap}
              setItems={setItems}
              items={items}
              title="100g Nutty Crisps/Florentines"
              subtitle={"$10 per pack"}
              options={(flavours?.nuttie_florentines ?? []).map((flavour) => ({
                productCode: "NUTTIE_FLORENTINES_100",
                label: flavour,
              }))}
              allowQuantitySelection
            />
            <MultiVariantSelect
              setErrorMap={setErrorMap}
              setItems={setItems}
              items={items}
              title="200g Nutty Crisps/Florentines"
              subtitle={"$19 per pack"}
              options={(flavours?.nuttie_florentines_short ?? []).map(
                (flavour) => ({
                  productCode: "NUTTIE_FLORENTINES_200",
                  label: flavour,
                })
              )}
              allowQuantitySelection
            />
            <MultiVariantSelect
              setErrorMap={setErrorMap}
              setItems={setItems}
              items={items}
              title="300g Nutty Crisps/Florentines"
              subtitle={"$28 per pack"}
              options={(flavours?.nuttie_florentines_short ?? []).map(
                (flavour) => ({
                  productCode: "NUTTIE_FLORENTINES_300",
                  label: flavour,
                })
              )}
              allowQuantitySelection
            />

            {specials &&
              specials.ui_elements.map((uiElement) => {
                if (uiElement.type === UiElementType.Header) {
                  return (
                    <SectionHeader
                      title={uiElement.title}
                      subtitle={uiElement.subtitle}
                    ></SectionHeader>
                  );
                } else if (uiElement.type === UiElementType.Selection) {
                  return (
                    <MultiVariantSelect
                      setErrorMap={setErrorMap}
                      setItems={setItems}
                      items={items}
                      title={uiElement.title}
                      subtitle={uiElement.subtitle}
                      options={uiElement.options}
                      allowQuantitySelection
                    />
                  );
                }
                return null;
              })}

            <SectionHeader title="Muffins" />
            <MultiVariantSelect
              setErrorMap={setErrorMap}
              setItems={setItems}
              items={items}
              title="Box of 4"
              subtitle="1 for $15, 2 for $29, 3 for $42, 4 for $55"
              options={(flavours?.muffins ?? []).map((flavour) => ({
                productCode: "MUFFINS_4",
                label: flavour,
              }))}
              allowQuantitySelection
            />
            <MultiVariantSelect
              setErrorMap={setErrorMap}
              setItems={setItems}
              items={items}
              title="Box of 6"
              subtitle="1 for $20, 2 for $38, 3 for $56"
              options={(flavours?.muffins ?? []).map((flavour) => ({
                productCode: "MUFFINS",
                label: flavour,
              }))}
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
              allowQuantitySelection={false}
            />

            <SectionHeader
              title="The Nutbaker - Hands-on!"
              subtitle="Love our bakes and want to have a go at making them yourself? Sign up for our hands-on session where you'll get to customise your choice of Nutbaker bakes and make them from scratch in no more than 2 hours! Dates and times are flexible - we'll get in touch to work something out!"
            />
            <MultiVariantSelect
              setErrorMap={setErrorMap}
              setItems={setItems}
              items={items}
              title="The Nutbaker - Hands-on!"
              subtitle="Min 2 pax, max 4 pax. 2-3 pax: $80 per pax. 4 pax: $70 per pax"
              options={NUTBAKER_HANDS_ON_VARIANTS.map((variant) => ({
                label: variant,
                productCode: "NUTBAKER_HANDS_ON",
              }))}
              quantity={{ min: 2, max: 4 }}
              minSingleQuantity={2}
              allowQuantitySelection
            />
          </Container>

          <Paper
            sx={{
              backgroundColor: "#D2973D",
              gridColumnStart: "1",
              gridColumnEnd: "4",
              padding: "1em",
              display: "flex",
              marginBottom: "0",
              justifyContent: "space-between",
              height: "fit-content",
              alignContent: "center",
              position: "fixed",
              bottom: 0,
              right: 0,
              left: 0,
              gridArea: "footer",
              zIndex: "1",
            }}
          >
            <Typography
              sx={{
                fontWeight: "medium",
                marginTop: "auto",
                marginBottom: "auto",
                "@media (min-width: 780px)": {
                  fontSize: "1.2em",
                },
              }}
            >
              Total: {calculatePriceString(items, specials)}
            </Typography>
            <Button
              sx={{
                backgroundColor: "#F5D998",
                color: "black",
                padding: "0.5em",
                marginLeft: "0.5em",
                "@media (min-width: 780px)": {
                  fontSize: "1.2em",
                },
              }}
              onClick={() => setPage("collection")}
              disabled={
                numItems === 0 ||
                Object.values(errorMap).some((hasError) => hasError)
              }
            >
              Next: Collection Details
            </Button>
          </Paper>
        </>
      ) : (
        <CircularProgressContainer>
          <CircularProgress color="inherit" />
        </CircularProgressContainer>
      )}
    </>
  );
};

export default OrderInfo;
