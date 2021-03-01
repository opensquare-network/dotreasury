import React from "react";
import styled from "styled-components";

import Logo from "./Logo";
import { NavLink } from "react-router-dom";
import ScanHeight from "./ScanHeight";
import Setting from "./Setting";
import MenuSwitch from "./MenuSwitch";
import { useMenuTab } from "../../utils/hooks";

const Wrapper = styled.header`
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
`;

const ScanHeightWrapper = styled.div`
  margin-left: 24px;
`

const HeaderExamplePage = () => {
  useMenuTab();
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
        <NavLink to="/">
          <MenuSwitch menuTabsName="Home" />
        </NavLink>
        <NavLink to="/income">
          <MenuSwitch menuTabsName="Income" />
        </NavLink>
        <NavLink to="/projects">
          <MenuSwitch menuTabsName="Projects" />
        </NavLink>
        <Setting />
      </Right>
    </Wrapper>
  );
};

export default HeaderExamplePage;
