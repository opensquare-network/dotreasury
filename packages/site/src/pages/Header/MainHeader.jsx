import React, { useState, useRef } from "react";
import styled, { css } from "styled-components";
import { Image } from "semantic-ui-react";

import Logo from "./Logo";
import { NavLink } from "react-router-dom";
import ScanHeight from "./ScanHeight";
import MenuSwitch from "./MenuSwitch";
import { useMenuTab } from "../../utils/hooks";
import { useSelector } from "react-redux";
import { chainSymbolSelector } from "../../store/reducers/chainSlice";
import ConnectWallet from "../../components/ConnectWallet";
import { useDark } from "../../context/theme";

const Wrapper = styled.header`
  height: 76px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  @media screen and (max-width: 600px) {
    padding: 0 24px;
  }
`;

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Left = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  button.ui {
    background-color: transparent !important;
    color: var(--textPrimary) !important;
    ${(p) =>
      p.symbol === "ksm" &&
      css`
        color: var(--textPrimaryContrast) !important;
      `}

    &:hover {
      color: var(--primary) !important;
    }
  }
  @media screen and (max-width: 850px) {
    box-shadow: 0px 4px 12px rgba(29, 37, 60, 0.08);
    display: none;
    width: 100vw;
    flex-direction: column;
    position: absolute;
    left: -16px;
    top: 69px;
    z-index: 9999;
    background-color: var(--neutral100);
    padding: 22px 0;
    border-bottom: 1px solid var(--neutral400);
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
      border: 1px solid var(--pink500);
      border-radius: 4px;
    }
    > .login {
      margin-top: 16px;
    }
    > div {
      margin-right: 0 !important;
    }
    button.ui {
      color: var(--textPrimary) !important;
    }
  }
  @media screen and (max-width: 600px) {
    left: 0;
  }
`;

const MenuIcon = styled.div`
  width: 24px;
  height: 24px;
  display: none !important;
  margin-left: 0.5rem;
  @media screen and (max-width: 850px) {
    display: flex !important;
    cursor: pointer;
    align-items: center;
    justify-content: center;
  }
`;

const ScanHeightWrapper = styled.div`
  margin-left: 24px;
`;

const HeaderExamplePage = () => {
  const dark = useDark();
  const symbol = useSelector(chainSymbolSelector)?.toLowerCase();
  const [menuShow, setMenuShow] = useState(false);
  useMenuTab();

  const menuWrap = useRef();
  const menuClick = (e) => {
    if (e.target !== menuWrap.current) {
      setMenuShow(false);
    }
  };
  let menuIconSrc =
    symbol === "ksm" ? "/imgs/icon-ham-white.svg" : "/imgs/icon-ham-black.svg";
  if (menuShow) {
    menuIconSrc =
      symbol === "ksm"
        ? "/imgs/menu-icon-close-white.svg"
        : "/imgs/menu-icon-close.svg";
  }
  if (dark) {
    menuIconSrc = "/imgs/icon-ham-white.svg";
    if (menuShow) {
      menuIconSrc = "/imgs/menu-icon-close-white.svg";
    }
  }
  return (
    <Wrapper symbol={symbol}>
      <Left>
        <NavLink to="/">
          <Logo symbol={symbol} />
        </NavLink>
      </Left>
      <FlexWrapper>
        <Right
          symbol={symbol}
          style={{ display: menuShow ? "flex" : "" }}
          onClick={menuClick}
          ref={menuWrap}
        >
          <NavLink to={`/${symbol}/income`}>
            <MenuSwitch menuTabsName="Income" />
          </NavLink>
          <NavLink to={`/${symbol}/projects`}>
            <MenuSwitch menuTabsName="Projects" />
          </NavLink>
          <NavLink to={`/${symbol}/users`}>
            <MenuSwitch menuTabsName="Users" />
          </NavLink>
          <ConnectWallet />
        </Right>
        <ScanHeightWrapper>
          <ScanHeight />
        </ScanHeightWrapper>
        <MenuIcon onClick={() => setMenuShow(!menuShow)}>
          <Image src={menuIconSrc} />
        </MenuIcon>
      </FlexWrapper>
    </Wrapper>
  );
};

export default HeaderExamplePage;
