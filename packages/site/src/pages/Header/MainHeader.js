import React from "react";
import styled from "styled-components";

import Logo from "./Logo";
import { NavLink } from "react-router-dom";
import ScanHeight from "./ScanHeight";

const Wrapper = styled.header`
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Left = styled.div`
display: flex;
align-items: center;
`

const Right = styled.div`
`

const ScanHeightWrapper = styled.div`
margin-left: 24px;
`

const HeaderExamplePage = () => {

  return (
    <Wrapper>
      <Left>
        <NavLink to="/">
          <Logo />
        </NavLink>
        <ScanHeightWrapper>
          <ScanHeight />
        </ScanHeightWrapper>
      </Left>
      <Right></Right>
    </Wrapper>
  )
};

export default HeaderExamplePage;
