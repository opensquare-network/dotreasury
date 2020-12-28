import React from "react";
import styled from "styled-components";
import { Divider, Tab } from "semantic-ui-react";
import { NavLink, useLocation } from "react-router-dom";
import TipsMenu from "./TipsMenu";

import {
  TEXT_DARK_MAJOR,
  TEXT_DARK_MINOR,
  PRIMARY_THEME_COLOR,
  SECONDARY_THEME_COLOR,
} from "../../constants";

const DividerWrapper = styled(Divider)`
  margin: 0 !important;
`;

const TabWrapper = styled(Tab)`
  height: 65px;
  overflow-x: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow-y: auto;

  background: transparent;

  div {
    border-bottom: 0 !important;
  }

  a {
    height: 65px;
    padding-left: 0 !important;
    padding-right: 0 !important;
    border-width: 4px !important;
    font-family: Inter !important;
    color: ${TEXT_DARK_MINOR} !important;
    margin-right: 32px !important;
    & > div.item {
      padding-left: 0 !important;
      padding-right: 0 !important;
      color: ${TEXT_DARK_MINOR} !important;
    }
    & > div.ui.label, & > div > div.ui.label {
      background: ${SECONDARY_THEME_COLOR} !important;
      height: 20px !important;
      padding 0 8px !important;
      line-height: 20px !important;
      border-radius: 10px !important;
      margin-left: 8px !important;
      color: ${PRIMARY_THEME_COLOR} !important;
      font-weight: 400;
    }
    &.active, &.active > div {
      font-weight: normal !important;
      color: ${TEXT_DARK_MAJOR} !important;
      border-color: ${PRIMARY_THEME_COLOR} !important;
    }
  }
`;



const TabExampleSecondaryPointing = () => {
  const {pathname} = useLocation();

  const panes = [
    {
      menuItem: {
        as: NavLink,
        id: "homeTab",
        content: "Treasury Overview",
        to: "/",
        exact: true,
        key: "home",
        active: "/" === pathname
      },
    },
    {
      menuItem: {
        as: NavLink,
        id: "proposalsTab",
        content: "Proposals",
        to: "/proposals",
        exact: true,
        key: "proposals",
        active: "/proposals" === pathname
      },
    },
    {
      menuItem: {
        as: NavLink,
        id: "bountiesTab",
        content: "Bounties",
        to: "/bounties",
        exact: true,
        key: "bounties",
        active: "/bounties" === pathname
      },
    },
    {
      menuItem: {
        as: NavLink,
        id: "tipsTab",
        content: <TipsMenu />,
        to: "/tips",
        exact: true,
        key: "tips",
        active: "/tips" === pathname || pathname.indexOf("/tips") === 0
      }
    },
  ];

  return (<>
    <DividerWrapper />
    <TabWrapper menu={{ secondary: true, pointing: true }} panes={panes} activeIndex={"tipsTab"} />
  </>)
};

export default TabExampleSecondaryPointing;
