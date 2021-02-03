import React from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";

import Container from "../../components/Container";
import MainHeader from "./MainHeader";
import SubHeader from "./SubHeader";

const Wrapper = styled.header`
  background: #fff;
  max-height: 136px;
  border-bottom: 1px solid #eee;
`;

const Header = () => {
  const location = useLocation();
  const hideSubHeader = [
    "/login",
    "/register",
    "/forget",
    "/resetpassword",
    "/settings",
    "/verifyemail",
  ].includes(location.pathname) || location.pathname.includes("/settings");

  return (
    <Wrapper>
      <Container>
        <MainHeader />
        {!hideSubHeader && <SubHeader />}
      </Container>
    </Wrapper>
  );
};

export default Header;
