import React from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";

import Container from "../../components/Container";
import MainHeader from "./MainHeader";
import SubHeader from "./SubHeader";
import { isKusama } from "../../utils/chains";

const Wrapper = styled.header`
  background-color: ${() => (isKusama ? "#000" : "var(--neutral100)")};
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
    ].includes(location.pathname) || location.pathname.includes("/settings");

  return (
    <>
      <Wrapper>
        <Container>
          <MainHeader />
        </Container>
      </Wrapper>
      {!hideSubHeader && <SubHeader />}
    </>
  );
};

export default Header;
