import React from "react";
import styled from "styled-components";
import { Divider, Tab, Menu, Label } from "semantic-ui-react";

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
    color: ${TEXT_DARK_MINOR} !important;
    margin-right: 32px !important;
    & > div.ui.label {
      background: ${SECONDARY_THEME_COLOR} !important;
      height: 20px !important;
      padding 0 8px !important;
      line-height: 20px !important;
      border-radius: 10px !important;
      margin-left: 8px !important;
      color: ${PRIMARY_THEME_COLOR} !important;
      font-weight: 400;
    }
    &.active {
      font-weight: normal !important;
      color: ${TEXT_DARK_MAJOR} !important;
      border-color: ${PRIMARY_THEME_COLOR} !important;
    }
    
  }
`;

const panes = [
  {
    menuItem: "Treasury Overview",
  },
  {
    menuItem: "Proposal",
  },
  {
    menuItem: "Bounties",
  },
  {
    menuItem: (
      <Menu.Item key="Tips">
        Tips<Label>12</Label>
      </Menu.Item>
    ),
  },
];

const TabExampleSecondaryPointing = () => (
  <>
    <DividerWrapper />
    <TabWrapper menu={{ secondary: true, pointing: true }} panes={panes} />
  </>
);

export default TabExampleSecondaryPointing;
