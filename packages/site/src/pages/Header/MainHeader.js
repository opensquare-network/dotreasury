import React from "react";
import styled from "styled-components";

import Logo from "./Logo";
import { NavLink } from "react-router-dom";
import ScanHeight from "./ScanHeight";
import Setting from "./Setting";
import Text from "../../components/Text";
import { PRIMARY_THEME_COLOR } from "../../constants";

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
  display: flex;
  align-items: center;
`

const ScanHeightWrapper = styled.div`
  margin-left: 24px;
`
const NavButton = styled(Text)`
  margin-right: 32px;
  :hover {
    color: ${PRIMARY_THEME_COLOR};
  }
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
      <Right>
        <NavLink to="/projects">
          <NavButton>projects</NavButton>
        </NavLink>
        <Setting />
      </Right>
    </Wrapper>
  )
};

export default HeaderExamplePage;
