import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import Container from "../../components/Container";
import MainHeader from "./MainHeader";
import SubHeader from "./SubHeader";
import { chainSymbolSelector } from "../../store/reducers/chainSlice";

const Wrapper = styled.header`
  background: ${(p) => (p.symbol === "ksm" ? "#000" : "#fff")};
  max-height: 136px;
`;

const Header = () => {
  const location = useLocation();
  const hideSubHeader =
    [
      "/login",
      "/register",
      "/forget",
      "/resetpassword",
      "/settings",
      "/verifyemail",
      "/useragreement",
      "/privacy",
    ].includes(location.pathname) ||
    location.pathname.includes("/settings");

  const symbol = useSelector(chainSymbolSelector)?.toLowerCase();

  return (
    <>
      <Wrapper symbol={symbol}>
        <Container>
          <MainHeader />
        </Container>
      </Wrapper>
      {!hideSubHeader && <SubHeader />}
    </>
  );
};

export default Header;
