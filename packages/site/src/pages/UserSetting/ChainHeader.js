import React from "react";
import styled from "styled-components";
import { Tab } from "semantic-ui-react";

import {
  PRIMARY_THEME_COLOR,
  SECONDARY_THEME_COLOR,
  TEXT_DARK_MAJOR,
  TEXT_DARK_MINOR,
} from "../../constants";

const TabWrapper = styled(Tab)`
  display: flex;
  height: 48px;
  background: transparent;

  div {
    border-bottom: 0 !important;
  }

  a {
    /* height: 65px; */
    padding-left: 0 !important;
    padding-right: 0 !important;
    border-width: 4px !important;
    font-family: "Inter" !important;
    color: ${TEXT_DARK_MINOR} !important;
    margin-right: 32px !important;
    & > div.item {
      margin-bottom: -4px !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
      color: ${TEXT_DARK_MINOR} !important;
    }
    & > div.ui.label,
    & > div > div.ui.label {
      background: ${SECONDARY_THEME_COLOR} !important;
      height: 20px !important;
      padding: 0 8px !important;
      line-height: 20px !important;
      border-radius: 10px !important;
      margin-left: 8px !important;
      color: ${PRIMARY_THEME_COLOR} !important;
      font-weight: 400;
    }
    &.active,
    &.active > div {
      font-weight: normal !important;
      color: ${TEXT_DARK_MAJOR} !important;
      border-color: ${PRIMARY_THEME_COLOR} !important;
    }
  }
`;

const ChainHeader = ({
  activeChain = "polkadot",
  setActiveChain = () => {},
}) => {
  const panes = [
    {
      menuItem: {
        id: "polkadotTab",
        content: "Polkadot",
        key: "polkadot",
        active: activeChain === "polkadot",
        onClick: () => {
          setActiveChain("polkadot");
        },
      },
    },
    {
      menuItem: {
        id: "kusamaTab",
        content: "Kusama",
        key: "kusama",
        active: activeChain === "kusama",
        onClick: () => {
          setActiveChain("kusama");
        },
      },
    },
  ];

  return (
    <TabWrapper
      menu={{ secondary: true, pointing: true }}
      panes={panes}
      activeIndex={"kusamaTab"}
    />
  );
};

export default ChainHeader;
