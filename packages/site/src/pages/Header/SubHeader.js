import React, { useEffect } from "react";
import styled from "styled-components";
import { Tab, Divider } from "semantic-ui-react";
import { NavLink, useLocation } from "react-router-dom";
import TipsMenu from "./TipsMenu";
import ProposalsMenu from "./ProposalsMenu";
import BountiesMenu from "./BountiesMenu";
import TreasurySlashMenu from "./TreasurySlashMenu";
import DemocracySlashMenu from "./DemocracySlashMenu";
import StakingSlashMenu from "./StakingSlashMenu";
import IdentitySlashMenu from "./IdentitySlashMenu";
import ElectionPhragmenSlashMenu from "./ElectionPhragmenSlashMenu";
import InflationMenu from "./InflationMenu";
import { fetchIncomeCount } from "../../store/reducers/incomeSlice";
import { useSelector, useDispatch } from "react-redux";
import { showMenuTabsSelector } from "../../store/reducers/menuSlice";

import {
  PRIMARY_THEME_COLOR,
  SECONDARY_THEME_COLOR,
  TEXT_DARK_MAJOR,
  TEXT_DARK_MINOR,
} from "../../constants";
import BurntMenu from "./BurntMenu";

const DividerWrapper = styled(Divider)`
  margin: 0 !important;
  border-top: 1px solid rgba(238, 238, 238, 1) !important;
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

const TabExampleSecondaryPointing = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const showMenuTabs = useSelector(showMenuTabsSelector);

  useEffect(() => {
    dispatch(fetchIncomeCount());
  });

  const panes =
    showMenuTabs === "Home"
      ? [
          {
            menuItem: {
              as: NavLink,
              id: "homeTab",
              content: "Overview",
              to: "/",
              exact: true,
              key: "home",
              active: "/" === pathname,
            },
          },
          {
            menuItem: {
              as: NavLink,
              id: "proposalsTab",
              content: <ProposalsMenu />,
              to: "/proposals",
              exact: true,
              key: "proposals",
              active:
                "/proposals" === pathname ||
                pathname.indexOf("/proposals") === 0,
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
              active: "/tips" === pathname || pathname.indexOf("/tips") === 0,
            },
          },
          {
            menuItem: {
              as: NavLink,
              id: "bountiesTab",
              content: <BountiesMenu />,
              to: "/bounties",
              exact: true,
              key: "bounties",
              active:
                "/bounties" === pathname || pathname.indexOf("/bounties") === 0,
            },
          },
          {
            menuItem: {
              as: NavLink,
              id: "burntTab",
              content: <BurntMenu />,
              to: "/burnt",
              exact: true,
              key: "burnt",
              active: "/burnt" === pathname || pathname.indexOf("/burnt") === 0,
            },
          },
        ]
      : showMenuTabs === "Income"
      ? [
          {
            menuItem: {
              as: NavLink,
              id: "treasurySlashTab",
              content: <TreasurySlashMenu />,
              to: "/income/slash/treasury",
              exact: true,
              key: "treasurySlash",
              active:
                "/income/slash/treasury" === pathname ||
                pathname.indexOf("/income/slash/treasury") === 0,
            },
          },
          {
            menuItem: {
              as: NavLink,
              id: "democracySlashTab",
              content: <DemocracySlashMenu />,
              to: "/income/slash/democracy",
              exact: true,
              key: "democracySlash",
              active:
                "/income/slash/democracy" === pathname ||
                pathname.indexOf("/income/slash/democracy") === 0,
            },
          },
          {
            menuItem: {
              as: NavLink,
              id: "identitySlashTab",
              content: <IdentitySlashMenu />,
              to: "/income/slash/identity",
              exact: true,
              key: "identitySlash",
              active:
                "/income/slash/identity" === pathname ||
                pathname.indexOf("/income/slash/identity") === 0,
            },
          },
          {
            menuItem: {
              as: NavLink,
              id: "stakingSlashTab",
              content: <StakingSlashMenu />,
              to: "/income/slash/staking",
              exact: true,
              key: "stakingSlash",
              active:
                "/income/slash/staking" === pathname ||
                pathname.indexOf("/income/slash/staking") === 0,
            },
          },
          {
            menuItem: {
              as: NavLink,
              id: "electionPhragmenSlashTab",
              content: <ElectionPhragmenSlashMenu />,
              to: "/income/slash/electionphragmen",
              exact: true,
              key: "electionPhragmenSlash",
              active:
                "/income/slash/electionphragmen" === pathname ||
                pathname.indexOf("/income/slash/electionphragmen") === 0,
            },
          },
          {
            menuItem: {
              as: NavLink,
              id: "inflationTab",
              content: <InflationMenu />,
              to: "/income/inflation",
              exact: true,
              key: "inflation",
              active:
                "/income/inflation" === pathname ||
                pathname.indexOf("/income/inflation") === 0,
            },
          },
        ]
      : [];

  return (
    <>
      <DividerWrapper />
      <TabWrapper
        menu={{ secondary: true, pointing: true }}
        panes={panes}
        activeIndex={"tipsTab"}
      />
    </>
  );
};

export default TabExampleSecondaryPointing;
