import React, { useEffect } from "react";
import styled from "styled-components";
import { Tab } from "semantic-ui-react";
import { NavLink, useLocation } from "react-router-dom";
import TipsMenu from "./TipsMenu";
import ProposalsMenu from "./ProposalsMenu";
import BountiesMenu from "./BountiesMenu";
import BurntMenu from "./BurntMenu";
import TreasurySlashMenu from "./TreasurySlashMenu";
import DemocracySlashMenu from "./DemocracySlashMenu";
import StakingSlashMenu from "./StakingSlashMenu";
import IdentitySlashMenu from "./IdentitySlashMenu";
import ElectionPhragmenSlashMenu from "./ElectionPhragmenSlashMenu";
import InflationMenu from "./InflationMenu";
import OthersIncomeMenu from "./OthersIncomeMenu";
import ProjectsMenu from "./ProjectsMenu";
import TransfersMenu from "./TransfersMenu";
import TansfersSlashMenu from "./TansfersSlashMenu";
import { fetchIncomeCount } from "../../store/reducers/incomeSlice";
import { useSelector, useDispatch } from "react-redux";
import { showMenuTabsSelector } from "../../store/reducers/menuSlice";
import {
  chainSelector,
  chainSymbolSelector,
} from "../../store/reducers/chainSlice";
import Card from "../../components/Card";
import Container from "../../components/Container";

import {
  PRIMARY_THEME_COLOR,
  SECONDARY_THEME_COLOR,
  TEXT_DARK_MAJOR,
  TEXT_DARK_MINOR,
} from "../../constants";

const Wrapper = styled.div`
  position: relative;
`;

const WrapperBackground = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 42px;
  width: 100%;
  z-index: -1;
  background: ${(p) => (p.symbol === "ksm" ? "#000" : "#fff")};
`;

const TabWrapper = styled(Tab)`
  overflow-x: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  /* scrollbar-width: none; */
  overflow-y: auto;

  background: transparent;

  div {
    border-bottom: 0 !important;
  }

  a {
    padding-left: 0 !important;
    padding-right: 0 !important;
    border-width: 4px !important;
    font-family: "Inter" !important;
    color: ${TEXT_DARK_MINOR} !important;
    margin-right: 32px !important;
    margin-bottom: 0px !important;
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
    &.item {
      padding: 2px 0 !important;
    }
  }
`;

const CustomCard = styled(Card)`
  padding: 0 24px;
  @media screen and (max-width: 600px) {
    border-radius: 0;
  }
`;

const TopWrapper = styled.div`
  padding: 11px 0;
  border-bottom: 1px solid #f4f4f4;
  > a {
    font-size: 13px;
    line-height: 18px;
    color: rgba(0, 0, 0, 0.3);
    :hover {
      color: ${TEXT_DARK_MINOR};
    }
  }
`;

const OverviewWrapper = styled.div`
  line-height: 22px !important;
`;

const Divider = styled.div`
  position: relative;
  width: 1px;
  height: 20px;
  background: #eeeeee;
  left: 16px;
`;

const Overview = () => {
  return (
    <OverviewWrapper className="item">
      Overview
      <Divider />
    </OverviewWrapper>
  );
};

const TabExampleSecondaryPointing = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const showMenuTabs = useSelector(showMenuTabsSelector);
  const chain = useSelector(chainSelector);
  const symbol = useSelector(chainSymbolSelector)?.toLowerCase();

  useEffect(() => {
    dispatch(fetchIncomeCount(chain));
  }, [dispatch, chain]);

  const panes =
    showMenuTabs === "Home"
      ? [
          {
            menuItem: {
              as: NavLink,
              id: "homeTab",
              content: <Overview />,
              to: `/${symbol}`,
              exact: true,
              key: "home",
              active: `/${symbol}` === pathname,
            },
          },
          {
            menuItem: {
              as: NavLink,
              id: "proposalsTab",
              content: <ProposalsMenu />,
              to: `/${symbol}/proposals`,
              exact: true,
              key: "proposals",
              active:
                `/${symbol}/proposals` === pathname ||
                pathname.indexOf(`/${symbol}/proposals`) === 0,
            },
          },
          {
            menuItem: {
              as: NavLink,
              id: "tipsTab",
              content: <TipsMenu />,
              to: `/${symbol}/tips`,
              exact: true,
              key: "tips",
              active:
                `/${symbol}/tips` === pathname ||
                pathname.indexOf(`/${symbol}/tips`) === 0,
            },
          },
          {
            menuItem: {
              as: NavLink,
              id: "bountiesTab",
              content: <BountiesMenu />,
              to: `/${symbol}/bounties`,
              exact: true,
              key: "bounties",
              active:
                `/${symbol}/bounties` === pathname ||
                pathname.indexOf(`/${symbol}/bounties`) === 0,
            },
          },
          {
            menuItem: {
              as: NavLink,
              id: "burntTab",
              content: <BurntMenu />,
              to: `/${symbol}/burnt`,
              exact: true,
              key: "burnt",
              active:
                `/${symbol}/burnt` === pathname ||
                pathname.indexOf(`/${symbol}/burnt`) === 0,
            },
          },
          {
            menuItem: {
              as: NavLink,
              id: "transfersTab",
              content: <TransfersMenu />,
              to: `/${symbol}/transfers`,
              exact: true,
              key: "transfers",
              active: `/${symbol}/transfers` === pathname,
            },
          },
        ]
      : showMenuTabs === "Income"
      ? [
          {
            menuItem: {
              as: NavLink,
              id: "inflationTab",
              content: <InflationMenu />,
              to: `/${symbol}/income`,
              exact: true,
              key: "inflation",
              active: `/${symbol}/income` === pathname,
            },
          },
          {
            menuItem: {
              as: NavLink,
              id: "stakingSlashTab",
              content: <StakingSlashMenu />,
              to: `/${symbol}/income/slash/staking`,
              exact: true,
              key: "stakingSlash",
              active:
                `${symbol}/income/slash/staking` === pathname ||
                pathname.indexOf(`${symbol}/income/slash/staking`) === 0,
            },
          },
          {
            menuItem: {
              as: NavLink,
              id: "treasurySlashTab",
              content: <TreasurySlashMenu />,
              to: `/${symbol}/income/slash/treasury`,
              exact: true,
              key: "treasurySlash",
              active:
                `/${symbol}/income/slash/treasury` === pathname ||
                pathname.indexOf(`/${symbol}/income/slash/treasury`) === 0,
            },
          },
          {
            menuItem: {
              as: NavLink,
              id: "electionPhragmenSlashTab",
              content: <ElectionPhragmenSlashMenu />,
              to: `/${symbol}/income/slash/electionphragmen`,
              exact: true,
              key: "electionPhragmenSlash",
              active:
                `/${symbol}/income/slash/electionphragmen` === pathname ||
                pathname.indexOf(`/${symbol}/income/slash/electionphragmen`) ===
                  0,
            },
          },
          {
            menuItem: {
              as: NavLink,
              id: "democracySlashTab",
              content: <DemocracySlashMenu />,
              to: `/${symbol}/income/slash/democracy`,
              exact: true,
              key: "democracySlash",
              active:
                `/${symbol}/income/slash/democracy` === pathname ||
                pathname.indexOf(`/${symbol}/income/slash/democracy`) === 0,
            },
          },
          {
            menuItem: {
              as: NavLink,
              id: "identitySlashTab",
              content: <IdentitySlashMenu />,
              to: `/${symbol}/income/slash/identity`,
              exact: true,
              key: "identitySlash",
              active:
                `/${symbol}/income/slash/identity` === pathname ||
                pathname.indexOf(`/${symbol}/income/slash/identity`) === 0,
            },
          },
          {
            menuItem: {
              as: NavLink,
              id: "transfersSlashTab",
              content: <TansfersSlashMenu />,
              to: `/${symbol}/income/transfers`,
              exact: true,
              key: "transfersSlash",
              active:
                `/${symbol}/income/transfers` === pathname ||
                pathname.indexOf(`/${symbol}/income/transfers`) === 0,
            },
          },
          {
            menuItem: {
              as: NavLink,
              id: "othersIncomeTab",
              content: <OthersIncomeMenu />,
              to: `/${symbol}/income/others`,
              exact: true,
              key: "othersIncome",
              active:
                `/${symbol}/income/others` === pathname ||
                pathname.indexOf(`/${symbol}/income/others`) === 0,
            },
          },
        ]
      : showMenuTabs === "Projects"
      ? [
          {
            menuItem: {
              as: NavLink,
              id: "projectsTab",
              content: <ProjectsMenu />,
              to: `/${symbol}/projects`,
              exact: true,
              key: "projects",
              active:
                `/${symbol}/projects` === pathname ||
                pathname.indexOf(`/${symbol}/projects`) === 0,
            },
          },
        ]
      : [];

  return (
    <Wrapper>
      <WrapperBackground symbol={symbol} />
      <Container>
        <CustomCard>
          <TopWrapper>
            <NavLink to={`/${symbol}`}>Home</NavLink>
          </TopWrapper>
          <TabWrapper
            menu={{ secondary: true, pointing: true }}
            panes={panes}
            activeIndex={"tipsTab"}
          />
        </CustomCard>
      </Container>
    </Wrapper>
  );
};

export default TabExampleSecondaryPointing;
