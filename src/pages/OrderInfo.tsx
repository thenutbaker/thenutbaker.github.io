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
import { ProductCode } from "../products.const";
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
            {specials &&
              specials.ui_elements.map((uiElement) => {
                if (uiElement.type === UiElementType.Header) {
                  return (
                    <SectionHeader
                      title={uiElement.title}
                      subtitle={uiElement.subtitle}
                      {...(uiElement.subtitleSetInnerHtml && {
                        subtitleSetInnerHtml: true,
                      })}
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
                      minSingleQuantity={uiElement.minSingleQuantity}
                      singleItemMaxQty={uiElement.singleItemMaxQuantity}
                      quantity={uiElement.quantity}
                      allowQuantitySelection
                    />
                  );
                } else if (
                  uiElement.type === UiElementType.SelectionWithFlavours
                ) {
                  return (
                    <MultiVariantSelect
                      setErrorMap={setErrorMap}
                      setItems={setItems}
                      items={items}
                      title={uiElement.title}
                      subtitle={uiElement.subtitle}
                      options={(flavours?.[uiElement.flavourKey] ?? []).map(
                        (flavour) => ({
                          productCode: uiElement.productCode,
                          label: flavour,
                        })
                      )}
                      minSingleQuantity={uiElement.minSingleQuantity}
                      quantity={uiElement.quantity}
                      allowQuantitySelection
                    />
                  );
                }
                return null;
              })}
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
