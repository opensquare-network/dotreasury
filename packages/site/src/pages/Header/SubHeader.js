import React from "react";
import styled from "styled-components";
import { Divider, Tab, Menu, Label } from "semantic-ui-react";

const DividerWrapper = styled(Divider)`
  margin: 0 !important;
`;

const TabWrapper = styled(Tab)`
  background: transparent;

  div {
    border-bottom: 0 !important;
  }

  a {
    height: 65px;
    padding-left: 0 !important;
    padding-right: 0 !important;
    border-width: 4px !important;
    color: rgba(29, 37, 60, 0.64) !important;
    margin-right: 32px !important;
    & > div.ui.label {
      background: rgba(223, 64, 93, 0.1) !important;
      height: 20px !important;
      padding 0 8px !important;
      line-height: 20px !important;
      border-radius: 10px !important;
      margin-left: 8px !important;
      color: #DF405D !important;
      font-weight: 400;
    }
    &.active {
      font-weight: normal !important;
      color: #1D253C !important;
      border-color: #DF405D !important;
    }
    
  }
`;

const panes = [
  {
    menuItem: "Treasury Overview",
  },
  {
    menuItem: (
      <Menu.Item key="Tips">
        Tips<Label>15</Label>
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
