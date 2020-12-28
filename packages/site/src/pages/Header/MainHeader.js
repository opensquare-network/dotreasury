import React from "react";
import styled from "styled-components";

import Logo from "./Logo";
// import Nav from "./Nav";

const Wrapper = styled.header`
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderExamplePage = () => (
  <Wrapper>
    <Logo />
    {/* <Nav /> */}
  </Wrapper>
);

export default HeaderExamplePage;
