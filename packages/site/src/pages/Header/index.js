import React from "react";
import styled from "styled-components";

import Container from "../../components/Container";
import MainHeader from "./MainHeader";
import SubHeader from "./SubHeader";

const Wrapper = styled.header`
  background: #fff;
  height: 136px;
  border-bottom: 1px solid #eee;
`;

const Header = () => (
  <Wrapper>
    <Container>
      <MainHeader />
      <SubHeader />
    </Container>
  </Wrapper>
);

export default Header;
