import styled from "@emotion/styled";
import { LoadingButton } from "@mui/lab";
import { Alert, Button, Paper, Snackbar, Typography } from "@mui/material";
import axios from "axios";
import moment from "moment";
import { useState } from "react";
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
  const totalPriceString = formatMinor(
    calculatePriceMinor(items) + (deliveryFeeRequired ? 700 : 0)
  );

  const [isLoading, setIsLoading] = useState(false);
  const [errorSnackOpen, setErrorSnackOpen] = useState(false);
  const submit = async () => {
    setIsLoading(true);
    try {
      await axios.post("https://nutbaker-form-backend.herokuapp.com/orders", {
        price: totalPriceString,
        items,
        collectionInfo: {
          ...collectionInfo,
          ...(collectionInfo.selfCollectionDate && {
            selfCollectionDate: moment(
              collectionInfo.selfCollectionDate
            ).format("DD/MM/YYYY"),
          }),
          ...(collectionInfo.deliveryDate && {
            deliveryDate: moment(collectionInfo.deliveryDate).format(
              "DD/MM/YYYY"
            ),
          }),
        },
      });
      setIsLoading(false);
      setPage("success");
    } catch (err) {
      console.error(err);
      setErrorSnackOpen(true);
      setIsLoading(false);
    }
  };

  const onSnackClose = () => {
    setErrorSnackOpen(false);
  };
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
                  return null;
                }
                return (
                  <>
                    <Snackbar
                      open={errorSnackOpen}
                      autoHideDuration={6000}
                      onClose={onSnackClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                    >
                      <Alert
                        onClose={onSnackClose}
                        severity="error"
                        sx={{ width: "100%" }}
                      >
                        An error occurred. Please try again later.
                      </Alert>
                    </Snackbar>
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
            <Typography>{totalPriceString}</Typography>
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
          <Typography sx={{ marginBottom: "0.5em" }}>
            Payment can be made via 2 options:
          </Typography>
          <Typography sx={{ marginBottom: "0.5em" }}>
            1. PayNow or Google Pay to 88016714
          </Typography>
          <Typography sx={{ marginBottom: "0.5em" }}>
            2. Pay via PayNow QR. If you are using a computer, scan the code
            using your phone's internet banking application. If you are using
            your phone, take a screenshot of the QR code, open your banking app
            and upload the image
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
          zIndex: "1",
        }}
      >
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
          disabled={isLoading}
        >
          Back
        </Button>

        <LoadingButton
          sx={{
            backgroundColor: "#F5D998",
            color: "black",
            padding: "0.5em",
            marginLeft: "0.5em",
            "@media (min-width: 780px)": {
              fontSize: "1.2em",
            },
          }}
          onClick={submit}
          loading={isLoading}
        >
          Confirm Order
        </LoadingButton>
      </Paper>
    </>
  );
};

export default Checkout;
