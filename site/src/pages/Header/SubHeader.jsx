import React, { useEffect } from "react";
import styled from "styled-components";
import { Tab } from "semantic-ui-react";
import { NavLink, useLocation } from "react-router-dom";
import TipsMenu from "./TipsMenu";
import ProposalsMenu from "./ProposalsMenu";
import BountiesMenu from "./BountiesMenu";
import BurntMenu from "./BurntMenu";
import InflationMenu from "./InflationMenu";
import OthersIncomeMenu from "./OthersIncomeMenu";
import ProjectsMenu from "./ProjectsMenu";
import TransfersMenu from "./TransfersMenu";
import TansfersSlashMenu from "./TansfersSlashMenu";
import TipFindersMenu from "./TipFindersMenu";
import ProposalBeneficiariesMenu from "./ProposalBeneficiariesMenu";
import UsersMenu from "./UsersMenu";
import ReferendaMenu from "./ReferendaMenu";
import { fetchIncomeCount } from "../../store/reducers/incomeSlice";
import { useSelector, useDispatch } from "react-redux";
import { showMenuTabsSelector } from "../../store/reducers/menuSlice";
import Card from "../../components/Card";
import Container from "../../components/Container";

import SlashMenu from "./SlashMenu";
import {
  currentChainSettings,
  isCentrifuge,
  isKusama,
} from "../../utils/chains";
import GasFeeIncomeMenu from "./GasFeeIncomeMenu";
import BlockRewardsIncomeMenu from "./BlockRewardsMenu";

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
  background-color: ${(p) => (isKusama ? "#000" : "var(--neutral100)")};
`;

const TabWrapper = styled(Tab)`
  overflow-x: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  /* -ms-overflow-style: none; */
  scrollbar-width: none;
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
    color: var(--textSecondary) !important;
    margin-right: 32px !important;
    margin-bottom: 0px !important;
    & div.item {
      margin-bottom: -4px !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
      color: var(--textSecondary) !important;
    }
    & div.ui.label,
    & div > div.ui.label {
      background: var(--secondary) !important;
      height: 20px !important;
      padding: 0 8px !important;
      line-height: 20px !important;
      border-radius: 10px !important;
      margin-left: 8px !important;
      color: var(--primary) !important;
      font-weight: 400;
    }
    &.active,
    &.active > div,
    &.active > div > div {
      font-weight: normal !important;
      color: var(--textPrimary) !important;
      border-color: var(--primary) !important;
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
  border-bottom: 1px solid var(--neutral300);
  > a {
    font-size: 13px;
    line-height: 18px;
    color: var(--textTertiary);
    :hover {
      color: var(--textSecondary);
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
  background: var(--neutral300);
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

  useEffect(() => {
    dispatch(fetchIncomeCount());
  }, [dispatch]);

  const panes =
    showMenuTabs === "Home"
      ? [
          {
            menuItem: {
              as: NavLink,
              id: "homeTab",
              content: <Overview />,
              to: "/",
              exact: true,
              key: "home",
              active: "/" === pathname,
            },
          },
          ...(currentChainSettings.supportOpenGov
            ? [
                {
                  menuItem: {
                    as: NavLink,
                    id: "referendaTab",
                    content: <ReferendaMenu />,
                    to: "/referenda",
                    exact: true,
                    key: "referenda",
                    active: "/referenda" === pathname,
                  },
                },
              ]
            : []),
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
          currentChainSettings.hasTips && {
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
          currentChainSettings.hasBounties && {
            menuItem: {
              as: NavLink,
              id: "bountiesTab",
              content: <BountiesMenu />,
              to: "/bounties",
              exact: true,
              key: "bounties",
              active:
                pathname.indexOf("/bounties") === 0 ||
                pathname.indexOf("/child-bounties") === 0,
            },
          },
          currentChainSettings.hasBurnt && {
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
          currentChainSettings.hasTransfers && {
            menuItem: {
              as: NavLink,
              id: "transfersTab",
              content: <TransfersMenu />,
              to: "/transfers",
              exact: true,
              key: "transfers",
              active: "/transfers" === pathname,
            },
          },
        ].filter(Boolean)
      : showMenuTabs === "Income"
      ? [
          !isCentrifuge
            ? {
                menuItem: {
                  as: NavLink,
                  id: "inflationTab",
                  content: <InflationMenu />,
                  to: "/income",
                  exact: true,
                  key: "inflation",
                  active: "/income" === pathname,
                },
              }
            : {
                menuItem: {
                  as: NavLink,
                  id: "gasFeeTab",
                  content: <BlockRewardsIncomeMenu />,
                  to: "/income",
                  exact: true,
                  key: "blockRewards",
                  active: "/income" === pathname,
                },
              },
          {
            menuItem: {
              id: "slashDropdownTab",
              content: <SlashMenu />,
              key: "slashDropdown",
              active: pathname.includes("/income/slash/"),
            },
          },
          currentChainSettings.hasTransfers && {
            menuItem: {
              as: NavLink,
              id: "transfersSlashTab",
              content: <TansfersSlashMenu />,
              to: "/income/transfers",
              exact: true,
              key: "transfersSlash",
              active:
                "/income/transfers" === pathname ||
                pathname.indexOf("/income/transfers") === 0,
            },
          },
          isCentrifuge && {
            menuItem: {
              as: NavLink,
              id: "gasFeeTab",
              content: <GasFeeIncomeMenu />,
              to: "/income/gasfee",
              exact: true,
              key: "gasfeeIncome",
              active:
                "/income/gasfee" === pathname ||
                pathname.indexOf("/income/gasfee") === 0,
            },
          },
          {
            menuItem: {
              as: NavLink,
              id: "othersIncomeTab",
              content: <OthersIncomeMenu />,
              to: "/income/others",
              exact: true,
              key: "othersIncome",
              active:
                "/income/others" === pathname ||
                pathname.indexOf("/income/others") === 0,
            },
          },
        ].filter(Boolean)
      : showMenuTabs === "Projects"
      ? [
          {
            menuItem: {
              as: NavLink,
              id: "projectsTab",
              content: <ProjectsMenu />,
              to: "/projects",
              exact: true,
              key: "projects",
              active:
                "/projects" === pathname || pathname.indexOf("/projects") === 0,
            },
          },
        ]
      : showMenuTabs === "TipFinders"
      ? [
          {
            menuItem: {
              id: "tipFindersTab",
              to: "/tip-finders",
              key: "tipFinders",
              content: <TipFindersMenu />,
              active: true,
            },
          },
        ]
      : showMenuTabs === "ProposalBeneficiaries"
      ? [
          {
            menuItem: {
              id: "ProposalBeneficiariesTab",
              to: "/proposal-beneficiaries",
              key: "proposalBeneficiaries",
              content: <ProposalBeneficiariesMenu />,
              active: true,
            },
          },
        ]
      : showMenuTabs === "Users"
      ? [
          {
            menuItem: {
              as: NavLink,
              id: "UsersTab",
              to: "/users",
              key: "users",
              content: <UsersMenu />,
              active: true,
            },
          },
        ]
      : [];

  return (
    <Wrapper>
      <WrapperBackground />
      <Container>
        <CustomCard>
          <TopWrapper>
            <NavLink to={"/"}>Home</NavLink>
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
