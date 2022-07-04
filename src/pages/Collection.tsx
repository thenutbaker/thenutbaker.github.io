import { Button } from "@mui/material";
import { Page } from "../App.types";

type CollectionProps = {
  setPage: (page: Page) => void;
};
const Checkout = (props: CollectionProps) => {
  const { setPage } = props;
  return (
    <>
      Collection
      <Button onClick={() => setPage("order")}>Back</Button>
      <Button onClick={() => setPage("checkout")}>Next: Checkout</Button>
    </>
  );
};

export default Checkout;
