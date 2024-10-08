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
import moment from "moment";
import "moment/locale/en-sg";
import { useCallback, useEffect } from "react";
import { CollectionInfo, DynamicConfigs, Page } from "../App.types";

type CollectionProps = {
  setPage: (page: Page) => void;
  collectionInfo: CollectionInfo;
  setCollectionInfo: React.Dispatch<React.SetStateAction<CollectionInfo>>;
  configs: DynamicConfigs | null;
};

const Container = styled.div`
  grid-area: body;
  display: flex;
  flex-direction: column;
  justify-content: start;
`;

const Checkout = (props: CollectionProps) => {
  const { setPage, collectionInfo, setCollectionInfo, configs } = props;

  const isDateValid = useCallback(
    (date: Date | undefined) => {
      if (!date) {
        return false;
      }
      const allowedDays =
        collectionInfo.collectionMode === "self-collection"
          ? [0, 1, 2, 3, 4, 5, 6]
          : [1, 3, 5];
      const blockedDateConfigs = configs?.blockedDates;
      let isDateBlocked = false;
      if (blockedDateConfigs?.start && blockedDateConfigs?.end) {
        // due to bug in firebase UI, miliseconds of timestamp being set is non-zero
        // as a result, we have to coerce the miliseconds to zero to ensure the comparison is correct
        // this is particularly important for the datepicker's functionality of determine whether a date is selectable,
        // since it checks the start of day (00:00:00.000)
        const blockedDatesStart = new Date(
          new Date(blockedDateConfigs.start).setMilliseconds(0)
        );
        const blockedDatesEnd = new Date(
          new Date(blockedDateConfigs.end).setMilliseconds(0)
        );
        isDateBlocked = date >= blockedDatesStart && date <= blockedDatesEnd;
      }
      return (
        allowedDays.includes(moment(date).day()) &&
        !isDateBlocked &&
        date > moment().add(2, "days").startOf("day").toDate()
      );
    },
    [collectionInfo.collectionMode, configs?.blockedDates]
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
            A delivery fee of $10 will be charged for orders below $50.
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
              label="Self-collection at 391037"
              control={<Radio />}
              value="self-collection"
            />
            <FormControlLabel
              label="Delivery (Mon/Wed/Fri)"
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
                return !isDateValid(moment(date).toDate());
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
                sx={{ marginBottom: "1em" }}
                label="Condo Name (if applicable)"
                value={collectionInfo.condoName}
                onChange={(e) =>
                  setCollectionInfo((prev) => ({
                    ...prev,
                    condoName: e.target.value,
                  }))
                }
              ></TextField>

              <TextField
                label="Delivery Instructions (e.g. condo tower, lift lobby details)"
                value={collectionInfo.deliveryInstructions}
                onChange={(e) =>
                  setCollectionInfo((prev) => ({
                    ...prev,
                    deliveryInstructions: e.target.value,
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
