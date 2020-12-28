import React from "react";
import styled from "styled-components";

import Logo from "./Logo";
import { NavLink } from "react-router-dom";

const Wrapper = styled.header`
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderExamplePage = () => (
  <Wrapper>
    <NavLink to="/">
      <Logo />
    </NavLink>
  </Wrapper>
);

export default HeaderExamplePage;
