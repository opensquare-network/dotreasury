import React from "react";
import { Label, Menu } from "semantic-ui-react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { useLocation } from "react-router";
import PopupMenu from "./PopupMenu";
import { incomeCountSelector } from "../../../store/reducers/incomeSlice";
import { ReactComponent as DropdownSVG } from "./dropdown.svg";

const Divider = styled.div`
  position: relative;
  width: 1px;
  height: 20px;
  background: var(--neutral300);
  left: 16px;
`;

const Wrapper = styled.div`
  position: relative;

  svg {
    path {
      fill: rgba(0, 0, 0, 0.3);
    }
  }

  :hover {
    svg {
      path {
        fill: rgba(0, 0, 0, 0.5);
      }
    }
  }
`;

function SlashMenu() {
  const { pathname } = useLocation();
  const incomeCount = useSelector(incomeCountSelector);

  let tabName = "Slashes";
  let count =
    (incomeCount?.treasurySlash || 0) +
    (incomeCount?.democracySlash || 0) +
    (incomeCount?.identitySlash || 0) +
    (incomeCount?.electionPhragmenSlash || 0) +
    (incomeCount?.stakingSlash || 0) +
    (incomeCount?.referendaSlash || 0) +
    (incomeCount?.fellowshipReferendaSlash || 0);

  if (pathname.includes("/income/slash/treasury")) {
    tabName = "Treasury slash";
    count = incomeCount?.treasurySlash || 0;
  } else if (pathname.includes("/income/slash/identity")) {
    tabName = "Identity slash";
    count = incomeCount?.identitySlash || 0;
  } else if (pathname.includes("/income/slash/democracy")) {
    tabName = "Democracy slash";
    count = incomeCount?.democracySlash || 0;
  } else if (pathname.includes("/income/slash/staking")) {
    tabName = "Staking slash";
    count = incomeCount?.stakingSlash || 0;
  } else if (pathname.includes("/income/slash/electionphragmen")) {
    tabName = "Election slash";
    count = incomeCount?.electionPhragmenSlash || 0;
  } else if (pathname.includes("/income/slash/referenda")) {
    tabName = "Referenda slash";
    count = incomeCount?.referendaSlash || 0;
  } else if (pathname.includes("/income/slash/fellowship-referenda")) {
    tabName = "Fellowship slash";
    count = incomeCount?.fellowshipReferendaSlash || 0;
  }

  return (
    <PopupMenu
      trigger={
        <Wrapper>
          <Menu.Item key="SlashDropdown">
            {tabName} <DropdownSVG /> <Label>{count}</Label>
            <Divider />
          </Menu.Item>
        </Wrapper>
      }
    />
  );
}

export default SlashMenu;
