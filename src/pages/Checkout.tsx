import styled from "@emotion/styled";
import { Button, Paper, Typography } from "@mui/material";
import { CollectionInfo, Items, Page } from "../App.types";
import { ProductCode, PRODUCTS } from "../products.const";
import {
  calculatePriceMinor,
  calculatePriceString,
  formatMinor,
} from "../utils";

type CheckoutProps = {
  setPage: (page: Page) => void;
  items: Items;
  collectionInfo: CollectionInfo;
};

const OrderSummaryContainer = styled.div`
  display: grid;
  grid-template-columns: 9fr 1fr;
`;

const VariantsContainer = styled.div`
  display: flex;
  flex-direction: column;
  grid-column-start: 1;
  grid-column-end: 3;
  margin-bottom: 1em;
`;

const Divider = styled.hr`
  border: 1px lightgrey solid;
  width: 100%;
  margin-bottom: 1em;
  grid-column-start: 1;
  grid-column-end: 3;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  grid-area: body;
  justify-items: start;
`;

const PayNowQr = styled.img`
  max-width: 20em;
  max-height: 20em;
  align-self: center;
`;

const Checkout = (props: CheckoutProps) => {
  const { setPage, items, collectionInfo } = props;
  const deliveryFeeRequired =
    collectionInfo.collectionMode === "delivery" &&
    calculatePriceMinor(items) < 5000;
  return (
    <>
      <Container>
        <Paper
          sx={{
            gridColumnStart: "2",
            marginTop: "1em",
            padding: "1em",
            maxHeight: "fit-content",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              fontSize: "1em",
              fontWeight: "medium",
              "@media(min-width: 780px)": {
                fontSize: "1.2em",
              },
            }}
          >
            Order Summary
          </Typography>
          <Divider />
          <OrderSummaryContainer>
            {(Object.keys(items) as ProductCode[]).map(
              (productCode: ProductCode) => {
                const product = PRODUCTS[productCode];
                const itemsOfProduct = items[productCode];
                if (!itemsOfProduct) {
                  return;
                }
                return (
                  <>
                    <Typography sx={{ fontSize: "1em" }}>
                      {product.label}
                    </Typography>
                    <Typography>
                      {calculatePriceString({ [productCode]: itemsOfProduct })}
                    </Typography>
                    <VariantsContainer>
                      {Object.keys(itemsOfProduct).map((variant) => {
                        return (
                          <Typography
                            sx={{
                              fontSize: "0.8em",
                              "@media(min-width: 780px)": {
                                fontSize: "0.9em",
                              },
                            }}
                          >{`${itemsOfProduct[variant]}x ${variant}`}</Typography>
                        );
                      })}
                    </VariantsContainer>
                  </>
                );
              }
            )}
            {deliveryFeeRequired && (
              <>
                <Typography sx={{ fontSize: "1em" }}>Delivery Fee</Typography>
                <Typography>$7.00</Typography>
              </>
            )}
            <Divider />
            <Typography sx={{ fontSize: "1em" }}>Total</Typography>
            <Typography>
              {formatMinor(
                calculatePriceMinor(items) + (deliveryFeeRequired ? 700 : 0)
              )}
            </Typography>
          </OrderSummaryContainer>
        </Paper>
        <Paper
          sx={{
            gridColumnStart: "2",
            marginTop: "1em",
            padding: "1em",
            maxHeight: "fit-content",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              marginBottom: "0.5em",
              fontSize: "1em",
              fontWeight: "medium",
              "@media(min-width: 780px)": {
                fontSize: "1.2em",
              },
            }}
          >
            Payment Instructions
          </Typography>
          <Typography>
            Payment can be made via PayNow or Google Pay to 88016714.
            Alternatively, the QR code below can be used.
          </Typography>
          <PayNowQr src="/paynow.jpg" />
        </Paper>
      </Container>

      <Paper
        sx={{
          backgroundColor: "#D2973D",
          gridColumnStart: "1",
          gridColumnEnd: "4",
          marginTop: "4em",
          gridArea: "footer",
          padding: "1em",
          display: "flex",
          marginBottom: "0",
          justifyContent: "space-between",
          height: "fit-content",
          position: "sticky",
          bottom: 0,
          right: 0,
          left: 0,
        }}
      >
        <Button
          sx={{
            backgroundColor: "#F5D998",
            color: "black",
            padding: "0.5em",
            marginLeft: "0.5em",
          }}
          onClick={() => setPage("collection")}
        >
          Back
        </Button>

        <Button
          sx={{
            backgroundColor: "#F5D998",
            color: "black",
            padding: "0.5em",
            marginLeft: "0.5em",
          }}
          onClick={() => {
            setPage("checkout");
          }}
        >
          Confirm Order
        </Button>
      </Paper>
    </>
  );
};

export default Checkout;
