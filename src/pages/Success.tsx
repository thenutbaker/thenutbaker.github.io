import styled from "@emotion/styled";
import { Typography } from "@mui/material";

const Container = styled.div`
  grid-area: body;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media (min-width: 780px) {
    grid-area: body;
  }
  @media (max-width: 780px) {
    grid-column-start: 1;
    grid-column-end: 4;
    grid-row-start: 2;
    grid-row-end: 2;
  }
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

const Success = () => {
  return (
    <Container>
      <Logo src="/transparent.png" />
      <Typography
        sx={{
          color: "white",
          marginTop: "1em",
          fontSize: "1.2em",
          textAlign: "center",
          "@media(max-width: 780px)": {
            marginLeft: "1em",
            marginRight: "1em",
          },
        }}
      >
        Thanks for choosing The Nutbaker! Your order has been processed and
        we'll contact you shortly.
      </Typography>
    </Container>
  );
};
export default Success;
