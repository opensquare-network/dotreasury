import React, { useRef, useState } from "react";
import { Label, Menu } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { incomeCountSelector } from "../../../store/reducers/incomeSlice";
import { ReactComponent as DropdownSVG } from "./dropdown.svg";
import styled from "styled-components";
import { useOutsideClick } from "../../../utils/hooks";
import DemocracySlashMenu from "./DmocracySlashMenu";
import ElectionPhragmenSlashMenu from "./ElectionPhragmenSlashMenu";
import ReferendaSlashMenu from "./ReferendaSlashMenu";
import FellowshipReferendaSlashMenu from "./FellowshipReferendaSlashMenu";
import IdentitySlashMenu from "./IdentitySlashMenu";
import StakingSlashMenu from "./StakingSlashMenu";
import TreasurySlashMenu from "./TreasurySlashMenu";
import { chainSelector, chainSymbolSelector } from "../../../store/reducers/chainSlice";
import { useHistory, useLocation } from "react-router";

const Divider = styled.div`
  position: relative;
  width: 1px;
  height: 20px;
  background: #eeeeee;
  left: 16px;
`;

const PopupMenu = styled.div`
  position: absolute;
  padding: 4px 0;
  left: -50%;
  top: calc(100% + 8px);
  width: 100%;
  z-index: 999;
  @media screen and (max-width: 600px) {
    width: 100vw;
    left: 0;
    top: 100%;
    border-radius: 0;
    padding: 8px 0;
  }

  background: #FFFFFF;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08), 0px 1px 8px rgba(0, 0, 0, 0.04);
  border-radius: 4px;
  width: 220px;
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
  const slashPopupMenu = useRef(null);
  const [showSlashPopupMenu, setShowSlashPopupMenu] = useState(false);
  useOutsideClick(slashPopupMenu, () => {
    setShowSlashPopupMenu(false);
  });
  const chain = useSelector(chainSelector);
  const isKusama = chain === "kusama";
  const symbol = useSelector(chainSymbolSelector)?.toLowerCase();;
  const history = useHistory();
  const { pathname } = useLocation();
  const incomeCount = useSelector(incomeCountSelector);

  const popupMenu = (e) => {
    setShowSlashPopupMenu(true);
  };

  const navigate = (path) => {
    history.push(path);
    setTimeout(() => {
      setShowSlashPopupMenu(false);
    }, 100);
  }

  let tabName = "Slashes";
  let count = (incomeCount?.treasurySlash || 0) +
    (incomeCount?.democracySlash || 0) +
    (incomeCount?.identitySlash || 0) +
    (incomeCount?.electionPhragmenSlash || 0) +
    (incomeCount?.stakingSlash || 0) +
    (incomeCount?.referendaSlash || 0) +
    (incomeCount?.fellowshipReferendaSlash || 0);

  if (pathname.includes(`/income/slash/treasury`)) {
    tabName = "Treasury slash";
    count = incomeCount?.treasurySlash || 0;
  } else if (pathname.includes(`/income/slash/identity`)) {
    tabName = "Identity slash";
    count = incomeCount?.identitySlash || 0;
  } else if (pathname.includes(`/income/slash/democracy`)) {
    tabName = "Democracy slash";
    count = incomeCount?.democracySlash || 0;
  } else if (pathname.includes(`/income/slash/staking`)) {
    tabName = "Staking slash";
    count = incomeCount?.stakingSlash || 0;
  } else if (pathname.includes(`/income/slash/electionphragmen`)) {
    tabName = "Election slash";
    count = incomeCount?.electionPhragmenSlash || 0;
  } else if (pathname.includes(`/income/slash/referenda`)) {
    tabName = "Referenda slash";
    count = incomeCount?.referendaSlash || 0;
  } else if (pathname.includes(`/income/slash/fellowship-referenda`)) {
    tabName = "Fellowship slash";
    count = incomeCount?.fellowshipReferendaSlash || 0;
  }

  return (
    <>
      <Wrapper onClick={popupMenu}>
        <Menu.Item key="SlashDropdown">
          {tabName} <DropdownSVG /> <Label>{count}</Label>
          <Divider />
        </Menu.Item>
        {showSlashPopupMenu && (
          <PopupMenu ref={slashPopupMenu}>
            <StakingSlashMenu onClick={() => navigate(`/${symbol}/income/slash/staking`)} />
            <TreasurySlashMenu onClick={() => navigate(`/${symbol}/income/slash/treasury`)} />
            <ElectionPhragmenSlashMenu onClick={() => navigate(`/${symbol}/income/slash/electionphragmen`)} />
            <DemocracySlashMenu onClick={() => navigate(`/${symbol}/income/slash/democracy`)} />
            <IdentitySlashMenu onClick={() => navigate(`/${symbol}/income/slash/identity`)} />
            {isKusama && (
              <>
                <ReferendaSlashMenu onClick={() => navigate(`/${symbol}/income/slash/referenda`)} />
                <FellowshipReferendaSlashMenu onClick={() => navigate(`/${symbol}/income/slash/fellowship-referenda`)} />
              </>
            )}
          </PopupMenu>
        )}
      </Wrapper>
    </>
  );
}

export default SlashMenu;
