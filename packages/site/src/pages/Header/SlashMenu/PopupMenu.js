import React, { useState } from "react";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import { Popup } from "semantic-ui-react";
import { chainSelector, chainSymbolSelector } from "../../../store/reducers/chainSlice";
import DemocracySlashMenu from "./DmocracySlashMenu";
import ElectionPhragmenSlashMenu from "./ElectionPhragmenSlashMenu";
import ReferendaSlashMenu from "./ReferendaSlashMenu";
import FellowshipReferendaSlashMenu from "./FellowshipReferendaSlashMenu";
import IdentitySlashMenu from "./IdentitySlashMenu";
import StakingSlashMenu from "./StakingSlashMenu";
import TreasurySlashMenu from "./TreasurySlashMenu";

const popperStyle = {
  all: "unset",
  width: "220px",
  background: "#FFFFFF",
  boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.08), 0px 1px 8px rgba(0, 0, 0, 0.04)",
  borderRadius: "4px",
};

export default function PopupMenu({ trigger }) {
  const chain = useSelector(chainSelector);
  const isKusama = chain === "kusama";
  const symbol = useSelector(chainSymbolSelector)?.toLowerCase();;
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);

  const navigate = (path) => {
    history.push(path);
    setIsOpen(false);
  }

  const popupContent = (
    <div>
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
    </div>
  );

  return (
    <Popup
      basic={true}
      open={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      style={popperStyle}
      content={popupContent}
      on="click"
      trigger={trigger}
      hideOnScroll
    />
  );
}
