import React , { useState, useRef } from "react";
import styled from "styled-components";
import { Image } from "semantic-ui-react";

import Logo from "./Logo";
import { NavLink } from "react-router-dom";
import ScanHeight from "./ScanHeight";
import UserLogin from "./UserLogin";
import Setting from "./Setting";
import MenuSwitch from "./MenuSwitch";
import { useMenuTab } from "../../utils/hooks";

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
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  @media screen and (max-width: 850px) {
    display: none;
    width: 100vw;
    flex-direction: column;
    position: absolute;
    top: 69px;
    left: -16px;
    z-index: 9999;
    background-color: white;
    padding: 22px 0;
    border-bottom: 1px solid #EEEEEE;
    >*{
      margin-top: 8px;
      &:first-child{
        margin-top: 0;
      }
    }
    >a div, >a button{
      margin-right: 0!important;
    }
    >.button button{
      width: 83vw;
    }
    >.signUp{
      border: 1px solid #DF405D;
      border-radius: 4px;
    }
    >.login{
      margin-top: 16px;
    }
    >div{
      margin-right: 0!important;
    }
  }
`;

const MenuIcon = styled(Image)`
  display: none!important;
  @media screen and (max-width: 850px) {
    display: block!important;
    cursor: pointer;
  }
`;


const ScanHeightWrapper = styled.div`
  margin-left: 24px;
  @media screen and (max-width: 556px) {
    display: none;
  }
`;

const HeaderExamplePage = () => {
  const [menuShow, setMenuShow] = useState(false);
  useMenuTab();

  const menuWrap = useRef();
  const menuClick = (e) => {
    if(e.target !== menuWrap.current) {
      setMenuShow(false);
    }
  };
  let menuIconSrc = '/imgs/menu-icon-open.svg';
  if(menuShow) {
    menuIconSrc = '/imgs/menu-icon-close.svg';
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
      <MenuIcon
        src={menuIconSrc}
        onClick={() => setMenuShow(!menuShow)}
      />
      <Right style={{display: menuShow?'flex':''}} onClick={menuClick} ref={menuWrap}>
        <NavLink to="/">
          <MenuSwitch menuTabsName="Home" />
        </NavLink>
        <NavLink to="/income">
          <MenuSwitch menuTabsName="Income" />
        </NavLink>
        <Setting />
        <UserLogin />
      </Right>
    </Wrapper>
  );
};

export default HeaderExamplePage;
