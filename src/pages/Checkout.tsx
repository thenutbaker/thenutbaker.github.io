import styled from "@emotion/styled";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Button,
  CircularProgress,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import { Fragment, useState } from "react";
import { apiUrl, priceOrder } from "../api";
import { CollectionInfo, Items, Page } from "../App.types";
import { usePriceBreakdown } from "../usePriceBreakdown";

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
  const { setPage, items, collectionInfo } = props;

  // promoCode is what the customer typed; appliedPromoCode is set once the
  // backend has accepted it, and is the only promo code sent with the order
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromoCode, setAppliedPromoCode] = useState("");
  const promoApplied = appliedPromoCode !== "" && appliedPromoCode === promoCode;

  const {
    breakdown,
    isLoading: isPriceLoading,
    hasError: priceHasError,
  } = usePriceBreakdown({
    items,
    collectionMode: collectionInfo.collectionMode,
    ...(appliedPromoCode && { promoCode: appliedPromoCode }),
  });

  const [isPromoQueryLoading, setIsPromoQueryLoading] = useState(false);
  const [promoSnackOpen, setPromoSnackOpen] = useState(false);
  const [promoError, setPromoError] = useState("");

  const [isSubmisssionLoading, setSubmissionIsLoading] = useState(false);
  const [errorSnackOpen, setErrorSnackOpen] = useState(false);

  const applyPromo = async () => {
    setIsPromoQueryLoading(true);
    try {
      const result = await priceOrder({
        items,
        collectionMode: collectionInfo.collectionMode,
        promoCode,
      });
      if (result.promoError) {
        setPromoError(result.promoError);
        setAppliedPromoCode("");
      } else {
        setPromoError("");
        setAppliedPromoCode(promoCode);
        setPromoSnackOpen(true);
      }
    } catch (err) {
      console.error(err);
      setPromoError("An error occurred, please try again later");
      setAppliedPromoCode("");
    } finally {
      setIsPromoQueryLoading(false);
    }
  };

  const submit = async () => {
    if (!breakdown) {
      return;
    }
    setSubmissionIsLoading(true);
    try {
      await axios.post(apiUrl("makeOrder"), {
        price: breakdown.formattedTotal,
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
        ...(appliedPromoCode && { promoCode: appliedPromoCode }),
      });
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
          {!breakdown ? (
            priceHasError ? (
              <Typography sx={{ color: "error.main" }}>
                Unable to calculate prices. Please try again later.
              </Typography>
            ) : (
              <CircularProgress sx={{ alignSelf: "center" }} />
            )
          ) : (
            <OrderSummaryContainer>
              {breakdown.items.map((item) => (
                <Fragment key={item.productCode}>
                  <Typography sx={{ fontSize: "1em" }}>{item.label}</Typography>
                  <Typography>{item.formattedPrice}</Typography>
                  <VariantsContainer>
                    {item.variants.map(({ variant, quantity }) => (
                      <Typography
                        key={variant}
                        sx={{
                          fontSize: "0.8em",
                          "@media(min-width: 780px)": {
                            fontSize: "0.9em",
                          },
                        }}
                      >{`${quantity}x ${variant}`}</Typography>
                    ))}
                  </VariantsContainer>
                </Fragment>
              ))}
              {breakdown.deliveryFee > 0 && (
                <>
                  <Typography sx={{ fontSize: "1em" }}>Delivery Fee</Typography>
                  <Typography>{breakdown.formattedDeliveryFee}</Typography>
                </>
              )}
              {breakdown.promo && breakdown.promo.discount > 0 && (
                <>
                  <Typography sx={{ fontSize: "1em" }}>
                    {breakdown.promo.description}
                  </Typography>
                  <Typography>{`- ${breakdown.promo.formattedDiscount}`}</Typography>
                </>
              )}
              <Divider />
              <Typography sx={{ fontSize: "1em" }}>Total</Typography>
              <Typography>{breakdown.formattedTotal}</Typography>
            </OrderSummaryContainer>
          )}
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
                setPromoCode(e.target.value);
                setAppliedPromoCode("");
                setPromoError("");
              }}
              error={promoError.length > 0}
              onKeyDown={(e) => {
                if (e.key === "Enter" && promoCode.length > 0) {
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
          <Typography
            sx={{ color: "red", fontWeight: "medium", marginBottom: "0.5em" }}
          >
            Please remember to click on the "Confirm Order" button after paying!
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
          // the total must be up to date before the order is placed
          disabled={!breakdown || isPriceLoading || priceHasError}
        >
          Confirm Order
        </LoadingButton>
      </Paper>
    </>
  );
};

export default Checkout;
