import styled from "@emotion/styled";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { CollectionInfo, Page } from "../App.types";
import "moment/locale/en-sg";

type CollectionProps = {
  setPage: (page: Page) => void;
  collectionInfo: CollectionInfo;
  setCollectionInfo: React.Dispatch<React.SetStateAction<CollectionInfo>>;
};

const Container = styled.div`
  grid-area: body;
  display: flex;
  flex-direction: column;
  justify-content: start;
`;

const BLOCKED_DATES: { start: Date; end: Date } | null = {
  start: new Date("2022-11-05T00:00:00+08:00"),
  end: new Date("2022-11-07T00:00:00+08:00"),
};

const Checkout = (props: CollectionProps) => {
  const { setPage, collectionInfo, setCollectionInfo } = props;
  const [backendPinged, setBackendPinged] = useState(false);

  useEffect(() => {
    if (!backendPinged) {
      axios
        .get(
          "https://asia-southeast1-nutbaker-form-backend.cloudfunctions.net/ping"
        )
        .then(() => setBackendPinged(true))
        .catch((err) => {
          console.error(err);
        });
    }
  }, [backendPinged]);

  const isDateValid = useCallback(
    (date: Date | undefined) => {
      if (!date) {
        return false;
      }
      const allowedDays =
        collectionInfo.collectionMode === "self-collection"
          ? [2, 4, 6]
          : [0, 3];
      return (
        allowedDays.includes(moment(date).day()) &&
        (date < BLOCKED_DATES.start || date > BLOCKED_DATES.end) &&
        date > moment().add(2, "days").startOf("day").toDate()
      );
    },
    [collectionInfo.collectionMode]
  );

  useEffect(() => {
    if (collectionInfo.collectionMode === "self-collection") {
      let newSelfCollectionDate = collectionInfo.selfCollectionDate;
      while (!isDateValid(newSelfCollectionDate)) {
        newSelfCollectionDate = moment(newSelfCollectionDate)
          .add(1, "day")
          .toDate();
      }
      setCollectionInfo((prev) => ({
        ...prev,
        selfCollectionDate: newSelfCollectionDate,
      }));
    } else {
      let newDeliveryDate = collectionInfo.deliveryDate;
      while (!isDateValid(newDeliveryDate)) {
        newDeliveryDate = moment(newDeliveryDate).add(1, "day").toDate();
      }
      setCollectionInfo((prev) => ({
        ...prev,
        deliveryDate: newDeliveryDate,
      }));
    }
  }, [
    collectionInfo.collectionMode,
    collectionInfo.selfCollectionDate,
    collectionInfo.deliveryDate,
    setCollectionInfo,
    isDateValid,
  ]);

  const selectedDateValid =
    collectionInfo.collectionMode === "self-collection"
      ? isDateValid(collectionInfo.selfCollectionDate)
      : isDateValid(collectionInfo.deliveryDate);

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
            Contact Details
          </Typography>
          <TextField
            label="Name"
            required
            value={collectionInfo.name}
            sx={{ marginBottom: "1em" }}
            onChange={(e) =>
              setCollectionInfo((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          ></TextField>
          <TextField
            label="Contact Number"
            required
            value={collectionInfo.contactNumber}
            type="tel"
            onChange={(e) => {
              const sanitized = e.target.value.replace(/\D/, "");
              if (sanitized.length > 8) {
                return;
              }
              setCollectionInfo((prev) => ({
                ...prev,
                contactNumber: sanitized,
              }));
            }}
          ></TextField>
          <FormControlLabel
            sx={{
              gridColumnStart: "1",
              gridColumnEnd: "1",
            }}
            control={
              <Checkbox
                onChange={(e) =>
                  setCollectionInfo((prev) => ({
                    ...prev,
                    isGift: e.target.checked,
                  }))
                }
              />
            }
            label="I'm buying this as a gift"
            checked={collectionInfo.isGift}
          />
          {collectionInfo.isGift && (
            <TextField
              label="Gift recipient's name"
              required
              value={collectionInfo.giftRecipientName}
              onChange={(e) =>
                setCollectionInfo((prev) => ({
                  ...prev,
                  giftRecipientName: e.target.value,
                }))
              }
            ></TextField>
          )}
        </Paper>

        <Paper
          sx={{
            gridColumnStart: "2",
            marginTop: "1em",
            marginBottom: "2em",
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
            Delivery/Collection Details
          </Typography>
          <Typography
            sx={{
              fontSize: "0.8em",
              marginBottom: "0.5em",
              "@media(min-width: 780px)": {
                fontSize: "0.9em",
              },
            }}
          >
            A delivery fee of $8 will be charged for orders below $50.
            Self-collection is free of charge.
          </Typography>
          <RadioGroup
            onChange={(e) =>
              setCollectionInfo((prev) => ({
                ...prev,
                collectionMode: e.target.value as
                  | "self-collection"
                  | "delivery",
              }))
            }
            value={collectionInfo.collectionMode}
          >
            <FormControlLabel
              label="Self-collection at 37A Pine Lane (Tue/Thu/Sat, 6pm-9pm)"
              control={<Radio />}
              value="self-collection"
            />
            <FormControlLabel
              label="Delivery (Wed/Sun)"
              control={<Radio />}
              value="delivery"
            />
          </RadioGroup>
          <LocalizationProvider
            dateAdapter={AdapterMoment}
            adapterLocale="en-sg"
          >
            <DatePicker
              label={
                collectionInfo.collectionMode === "self-collection"
                  ? "Collection Date"
                  : "Delivery Date"
              }
              onChange={(date) => {
                setCollectionInfo((prev) => ({
                  ...prev,
                  [collectionInfo.collectionMode === "self-collection"
                    ? "selfCollectionDate"
                    : "deliveryDate"]: moment(date).toDate(),
                }));
              }}
              value={
                collectionInfo.collectionMode === "self-collection"
                  ? collectionInfo.selfCollectionDate
                  : collectionInfo.deliveryDate
              }
              disablePast
              shouldDisableDate={(date) => {
                return !isDateValid(date);
              }}
              renderInput={(params) => {
                return <TextField {...params} />;
              }}
            />
          </LocalizationProvider>
          {collectionInfo.collectionMode === "delivery" && (
            <>
              <TextField
                sx={{ marginTop: "1em" }}
                label="Delivery address"
                required
                value={collectionInfo.deliveryAddress}
                onChange={(e) =>
                  setCollectionInfo((prev) => ({
                    ...prev,
                    deliveryAddress: e.target.value,
                  }))
                }
              ></TextField>
              <TextField
                sx={{ marginTop: "1em" }}
                label="Postal Code"
                required
                value={collectionInfo.postalCode}
                onChange={(e) => {
                  const sanitized = e.target.value.replace(/\D/, "");
                  if (sanitized.length > 6) {
                    return;
                  }
                  setCollectionInfo((prev) => ({
                    ...prev,
                    postalCode: sanitized,
                  }));
                }}
              ></TextField>
              <TextField
                sx={{ marginTop: "1em", marginBottom: "1em" }}
                label="Unit Number (if applicable)"
                value={collectionInfo.unitNumber}
                onChange={(e) => {
                  const sanitized = e.target.value.replace(
                    /[^0-9\-#a-zA-Z]/,
                    ""
                  );
                  setCollectionInfo((prev) => ({
                    ...prev,
                    unitNumber: sanitized,
                  }));
                }}
              ></TextField>
              <TextField
                label="Condo Name (if applicable)"
                value={collectionInfo.condoName}
                onChange={(e) =>
                  setCollectionInfo((prev) => ({
                    ...prev,
                    condoName: e.target.value,
                  }))
                }
              ></TextField>
            </>
          )}
        </Paper>
      </Container>

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
          }}
          onClick={() => setPage("order")}
        >
          Back
        </Button>

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
          onClick={() => {
            setPage("checkout");
          }}
          disabled={
            !selectedDateValid ||
            !collectionInfo.name.length ||
            collectionInfo.contactNumber.length !== 8 ||
            (collectionInfo.isGift &&
              !collectionInfo.giftRecipientName?.length) ||
            (collectionInfo.collectionMode === "delivery" &&
              (!collectionInfo.deliveryAddress?.length ||
                (collectionInfo.postalCode?.length ?? 0) < 6))
          }
        >
          Next: Checkout
        </Button>
      </Paper>
    </>
  );
};

export default Checkout;
