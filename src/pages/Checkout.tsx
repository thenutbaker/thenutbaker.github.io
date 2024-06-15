import styled from "@emotion/styled";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Button,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import axios, { AxiosError } from "axios";
import moment from "moment";
import { useState } from "react";
import { CollectionInfo, DynamicSpecials, Items, Page } from "../App.types";
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
  specials: DynamicSpecials | null;
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

const PromoContainer = styled.div`
  display: grid;
  grid-template-columns: 5fr 1fr;
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
  const { setPage, items, collectionInfo, specials } = props;

  const [promoCode, setPromoCode] = useState("");
  const [promoDescription, setPromoDescription] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const priceMinor = calculatePriceMinor(items, specials);
  const deliveryFeeRequired =
    collectionInfo.collectionMode === "delivery" && priceMinor < 5000;
  const totalPriceString = formatMinor(
    priceMinor + (deliveryFeeRequired ? 1000 : 0) - promoDiscount
  );

  const [isPromoQueryLoading, setIsPromoQueryLoading] = useState(false);
  const [promoSnackOpen, setPromoSnackOpen] = useState(false);
  const [promoError, setPromoError] = useState("");

  const [isSubmisssionLoading, setSubmissionIsLoading] = useState(false);
  const [errorSnackOpen, setErrorSnackOpen] = useState(false);

  const applyPromo = async () => {
    setIsPromoQueryLoading(true);
    try {
      const response = await axios.post(
        "https://asia-southeast1-nutbaker-form-backend.cloudfunctions.net/applyPromo",
        {
          promoCode,
          priceMinor,
        }
      );
      setPromoDiscount(response.data.promoDiscount);
      setPromoDescription(response.data.promoDescription);
      setPromoError("");
      setPromoSnackOpen(true);
      setPromoApplied(true);
    } catch (err) {
      if (err instanceof AxiosError && err?.response?.data?.errorMessage) {
        setPromoError(err.response.data.errorMessage);
      } else {
        setPromoError("An error occurred, please try again later");
      }
      setPromoDiscount(0);
    } finally {
      setIsPromoQueryLoading(false);
    }
  };
  const submit = async () => {
    setSubmissionIsLoading(true);
    try {
      await axios.post(
        "https://asia-southeast1-nutbaker-form-backend.cloudfunctions.net/makeOrder",
        {
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
          ...(promoCode.length && { promoCode }),
        }
      );
      setSubmissionIsLoading(false);
      setPage("success");
    } catch (err) {
      console.error(err);
      setErrorSnackOpen(true);
      setSubmissionIsLoading(false);
    }
  };

  const onPromoSnackClose = () => {
    setPromoSnackOpen(false);
  };
  const onErrorSnackClose = () => {
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
                let product: { label: string } = PRODUCTS[productCode];
                if (!product) {
                  product = specials?.products?.find(
                    (specialProduct) =>
                      specialProduct.productCode === productCode
                  ) ?? { label: "error" };
                }
                const itemsOfProduct = items[productCode];
                if (!itemsOfProduct) {
                  return null;
                }
                return (
                  <>
                    <Snackbar
                      open={errorSnackOpen}
                      autoHideDuration={6000}
                      onClose={onErrorSnackClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                    >
                      <Alert
                        onClose={onErrorSnackClose}
                        severity="error"
                        sx={{ width: "100%" }}
                      >
                        An error occurred. Please try again later.
                      </Alert>
                    </Snackbar>
                    <Snackbar
                      open={promoSnackOpen}
                      autoHideDuration={3000}
                      onClose={onPromoSnackClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                    >
                      <Alert
                        onClose={onPromoSnackClose}
                        severity="success"
                        sx={{ width: "100%" }}
                      >
                        Promo applied successfully!
                      </Alert>
                    </Snackbar>
                    <Typography sx={{ fontSize: "1em" }}>
                      {product.label}
                    </Typography>
                    <Typography>
                      {calculatePriceString(
                        { [productCode]: itemsOfProduct },
                        specials
                      )}
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
                <Typography>$10.00</Typography>
              </>
            )}
            {promoDiscount > 0 && (
              <>
                <Typography sx={{ fontSize: "1em" }}>
                  {promoDescription}
                </Typography>
                <Typography>{`- ${formatMinor(promoDiscount)}`}</Typography>
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
            Promo
          </Typography>
          <PromoContainer>
            <TextField
              label="Promo code"
              required
              value={promoCode}
              onChange={(e) => {
                setPromoApplied(false);
                setPromoCode(e.target.value);
              }}
              error={promoError.length > 0}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  applyPromo();
                }
              }}
            ></TextField>
            <Button
              sx={{
                marginLeft: "0.5em",
              }}
              onClick={() => {
                applyPromo();
              }}
              disabled={
                promoCode.length === 0 || isPromoQueryLoading || promoApplied
              }
            >
              {isPromoQueryLoading
                ? "Loading"
                : promoApplied
                ? "Applied"
                : "Submit"}
            </Button>
            <Typography
              sx={{
                color: "error.main",
                marginTop: "0.2em",
                fontSize: "0.8em",
              }}
            >
              {promoError}
            </Typography>
          </PromoContainer>
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
          disabled={isSubmisssionLoading}
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
          loading={isSubmisssionLoading}
        >
          Confirm Order
        </LoadingButton>
      </Paper>
    </>
  );
};

export default Checkout;
