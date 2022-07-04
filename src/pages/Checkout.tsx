import { Button } from "@mui/material";
import { Page } from "../App.types";

type CheckoutProps = {
  setPage: (page: Page) => void;
};
const Checkout = (props: CheckoutProps) => {
  const { setPage } = props;
  return (
    <>
      Checkout
      <Button onClick={() => setPage("collection")}>Back</Button>
    </>
  );
};

export default Checkout;
