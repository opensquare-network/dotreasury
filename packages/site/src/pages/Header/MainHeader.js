import React, { useState, useRef } from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";

import Logo from "./Logo";
import { NavLink } from "react-router-dom";
import ScanHeight from "./ScanHeight";
import UserLogin from "./UserLogin";
import MenuSwitch from "./MenuSwitch";
import { useMenuTab } from "../../utils/hooks";
import { useSelector } from "react-redux";
import { chainSelector } from "../../store/reducers/chainSlice";

const Wrapper = styled.header`
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  @media screen and (max-width: 640px) {
    justify-content: space-between;
    flex-grow: 3;
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  @media screen and (max-width: 850px) {
    box-shadow: 0px 4px 12px rgba(29, 37, 60, 0.08);
    display: none;
    width: 100vw;
    flex-direction: column;
    position: absolute;
    top: 69px;
    left: -16px;
    z-index: 9999;
    background-color: white;
    padding: 22px 0;
    border-bottom: 1px solid #eeeeee;
    > * {
      margin-top: 8px;
      &:first-child {
        margin-top: 0;
      }
    }
    > a div,
    > a button {
      margin-right: 0 !important;
    }
    > .button button {
      width: 83vw;
    }
    > .signUp {
      border: 1px solid #df405d;
      border-radius: 4px;
    }
    > .login {
      margin-top: 16px;
    }
    > div {
      margin-right: 0 !important;
    }
  }
`;

const MenuIcon = styled(Image)`
  display: none !important;
  @media screen and (max-width: 850px) {
    display: block !important;
    cursor: pointer;
  }
`;

const ScanHeightWrapper = styled.div`
  margin-left: 24px;
`;

const HeaderExamplePage = () => {
  const chain = useSelector(chainSelector);
  const [menuShow, setMenuShow] = useState(false);
  useMenuTab();

  const menuWrap = useRef();
  const menuClick = (e) => {
    if (e.target !== menuWrap.current) {
      setMenuShow(false);
    }
  };
  let menuIconSrc = "/imgs/menu-icon-open.svg";
  if (menuShow) {
    menuIconSrc = "/imgs/menu-icon-close.svg";
  }
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
      <MenuIcon src={menuIconSrc} onClick={() => setMenuShow(!menuShow)} />
      <Right
        style={{ display: menuShow ? "flex" : "" }}
        onClick={menuClick}
        ref={menuWrap}
      >
        <NavLink to={`/${chain}`}>
          <MenuSwitch menuTabsName="Home" />
        </NavLink>
        <NavLink to={`/${chain}/income`}>
          <MenuSwitch menuTabsName="Income" />
        </NavLink>
        <NavLink to={`/${chain}/projects`}>
          <MenuSwitch menuTabsName="Projects" />
        </NavLink>
        <UserLogin />
      </Right>
    </Wrapper>
  );
};

export default HeaderExamplePage;
