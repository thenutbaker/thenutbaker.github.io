import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import OrderInfo from "./pages/OrderInfo";
import { useState } from "react";
import styled from "@emotion/styled";
import Checkout from "./pages/Checkout";
import { Item, Page } from "./App.types";
import Success from "./pages/Success";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 5fr 1fr;
  padding-bottom: 1em;
  background-color: #5a777b;
  min-height: 100vh;
`;

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState<Page>("order");
  return (
    <Container>
      {page === "order" && <OrderInfo setItems={setItems} setPage={setPage} />}
      {page === "checkout" && <Checkout setPage={setPage} />}
      {page === "success" && <Success />}
    </Container>
  );
}

export default App;
