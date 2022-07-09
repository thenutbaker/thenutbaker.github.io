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
import { CollectionInfo, Page } from "../App.types";

type CollectionProps = {
  setPage: (page: Page) => void;
  collectionInfo: CollectionInfo;
  setCollectionInfo: React.Dispatch<React.SetStateAction<CollectionInfo>>;
};

const Checkout = (props: CollectionProps) => {
  const { setPage, collectionInfo, setCollectionInfo } = props;

  const isDateValid = (date: Date | undefined) => {
    if (!date) {
      return false;
    }
    const allowedDays =
      collectionInfo.collectionMode === "self-collection" ? [2, 4, 6] : [3, 7];
    return allowedDays.includes(moment(date).day());
  };

  const selectedDateValid =
    collectionInfo.collectionMode === "self-collection"
      ? isDateValid(collectionInfo.selfCollectionDate)
      : isDateValid(collectionInfo.deliveryDate);

  return (
    <>
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
          A delivery fee of $7 will be charged for orders below $50.
          Self-collection is free of charge.
        </Typography>
        <RadioGroup
          onChange={(e) =>
            setCollectionInfo((prev) => ({
              ...prev,
              collectionMode: e.target.value as "self-collection" | "delivery",
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
        <LocalizationProvider dateAdapter={AdapterMoment}>
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
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </Paper>

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
          maxHeight: "fit-content",
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
          }}
          onClick={() => {}}
          disabled={
            !selectedDateValid ||
            !collectionInfo.name.length ||
            collectionInfo.contactNumber.length !== 8 ||
            (collectionInfo.isGift && !collectionInfo.giftRecipientName?.length)
          }
        >
          Next: Checkout
        </Button>
      </Paper>
    </>
  );
};

export default Checkout;
