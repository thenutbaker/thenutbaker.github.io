import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import OrderInfo from "./pages/OrderInfo";
import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import Checkout from "./pages/Checkout";
import {
  CollectionInfo,
  DynamicConfigs,
  DynamicFlavours,
  DynamicSpecials,
  Items,
  Page,
} from "./App.types";
import Success from "./pages/Success";
import { Link, Typography } from "@mui/material";
import Collection from "./pages/Collection";
import axios from "axios";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 5fr 1fr;
  background-color: #5a777b;
  min-height: 100vh;
  align-items: start;
  grid-template-rows: ${(props: { equalRows: boolean }) =>
    props.equalRows ? "1fr 1fr 1fr" : "max-content 1fr max-content"};
  grid-template-areas:
    ". header ."
    ". body ."
    "footer footer footer";
  @media (min-width: 780px) {
    grid-template-columns: 1fr 2fr 1fr;
  }
`;

const HeaderContainer = styled.div`
  grid-area: header;
  display: flex;
  flex-direction: column;
`;
const HeaderTextContainer = styled.div`
  display: inline;
  flex-direction: row;
  justify-content: center;
  margin-top: 1em;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
`;
const Logo = styled.img`
  height: 5em;
  @media (min-width: 780px) {
    height: 10em;
  }
  margin-top: 1em;
  margin-left: auto;
  margin-right: auto;
  grid-area: header;
`;

function App() {
  const [items, setItems] = useState<Items>({});
  const [collectionInfo, setCollectionInfo] = useState<CollectionInfo>({
    name: "",
    contactNumber: "",
    collectionMode: "self-collection",
    selfCollectionDate: new Date(),
    deliveryDate: new Date(),
    deliveryAddress: "",
    unitNumber: "",
    condoName: "",
    isGift: false,
  });

  const [flavours, setFlavours] = useState<DynamicFlavours | null>(null);
  const [configs, setConfigs] = useState<DynamicConfigs | null>(null);
  const [specials, setSpecials] = useState<DynamicSpecials | null>(null);

  useEffect(() => {
    const fetchDynamic = async () => {
      const response = await axios.get(
        "https://asia-southeast1-nutbaker-form-backend.cloudfunctions.net/getDynamic"
      );
      setFlavours(response.data.flavours);
      setConfigs(response.data.configs);
      setSpecials(response.data.specials);
    };
    fetchDynamic();
  }, []);

  const [page, setPage] = useState<Page>("order");
  return (
    <Container equalRows={page === "success"}>
      {page !== "success" && (
        <HeaderContainer>
          <Logo src="/transparent.png" />

          <HeaderTextContainer>
            <Typography
              sx={{
                color: "white",
                fontSize: "0.9em",
                "@media (min-width: 780px)": {
                  fontSize: "1em",
                },
              }}
              display="inline-block"
            >
              For details on ingredients, please refer to the "Menu" story tab
              on our&nbsp;
            </Typography>
            <Link
              href="https://www.instagram.com/the_nutbaker_sg/?igshid=YmMyMTA2M2Y="
              target="_blank"
              color="#F5D998"
              display="inline-block"
              sx={{
                fontSize: "0.9em",
                "@media (min-width: 780px)": {
                  fontSize: "1em",
                },
              }}
            >
              Instagram
            </Link>
            <Typography
              sx={{
                color: "white",
                fontSize: "0.9em",
                "@media (min-width: 780px)": {
                  fontSize: "1em",
                },
              }}
              display="inline-block"
            >
              &nbsp;page
            </Typography>
          </HeaderTextContainer>
          <HeaderTextContainer>
            <Typography
              sx={{
                color: "white",
                fontSize: "0.9em",
                "@media (min-width: 780px)": {
                  fontSize: "1em",
                },
              }}
              display="inline-block"
            >
              If you are purchasing gifts for multiple recipients, please
              contact us directly.
            </Typography>
          </HeaderTextContainer>
          <HeaderTextContainer>
            <Typography
              sx={{
                color: "white",
                fontSize: "0.9em",
                "@media (min-width: 780px)": {
                  fontSize: "1em",
                },
              }}
              display="inline-block"
            >
              {"Free delivery for orders > $50."}
            </Typography>
          </HeaderTextContainer>
        </HeaderContainer>
      )}

      {page === "order" && (
        <OrderInfo
          setItems={setItems}
          setPage={setPage}
          items={items}
          flavours={flavours}
          specials={specials}
        />
      )}
      {page === "collection" && (
        <Collection
          setPage={setPage}
          collectionInfo={collectionInfo}
          setCollectionInfo={setCollectionInfo}
          configs={configs}
        />
      )}
      {page === "checkout" && (
        <Checkout
          setPage={setPage}
          collectionInfo={collectionInfo}
          items={items}
          specials={specials}
        />
      )}
      {page === "success" && <Success />}
    </Container>
  );
}

export default App;
