import React, { useState } from "react";
import { useHistory } from "react-router";
import { Popup as PopupOrigin } from "semantic-ui-react";
import DemocracySlashMenu from "./DmocracySlashMenu";
import ElectionPhragmenSlashMenu from "./ElectionPhragmenSlashMenu";
import ReferendaSlashMenu from "./ReferendaSlashMenu";
import FellowshipReferendaSlashMenu from "./FellowshipReferendaSlashMenu";
import IdentitySlashMenu from "./IdentitySlashMenu";
import StakingSlashMenu from "./StakingSlashMenu";
import TreasurySlashMenu from "./TreasurySlashMenu";
import styled from "styled-components";
import { rounded_4, shadow_200 } from "../../../styles/tailwindcss";
import { currentChainSettings } from "../../../utils/chains";

const Popup = styled(PopupOrigin)`
  width: 220px;
  padding: 0 !important;
  border-color: var(--neutral300) !important;
  ${rounded_4} !important;
  margin-top: 0 !important;
  ${shadow_200} !important;
  background-color: var(--neutral100) !important;
`;

export default function PopupMenu({ trigger }) {
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);

  const navigate = (path) => {
    history.push(path);
    setIsOpen(false);
  };

  const popupContent = (
    <div>
      {currentChainSettings.hasStaking && (
        <StakingSlashMenu onClick={() => navigate("/income/slash/staking")} />
      )}
      <TreasurySlashMenu onClick={() => navigate("/income/slash/treasury")} />
      <ElectionPhragmenSlashMenu
        onClick={() => navigate("/income/slash/electionphragmen")}
      />
      <DemocracySlashMenu onClick={() => navigate("/income/slash/democracy")} />
      <IdentitySlashMenu onClick={() => navigate("/income/slash/identity")} />
      {currentChainSettings.supportOpenGov && (
        <>
          <ReferendaSlashMenu
            onClick={() => navigate("/income/slash/referenda")}
          />
          <FellowshipReferendaSlashMenu
            onClick={() => navigate("/income/slash/fellowship-referenda")}
          />
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
      // style={popperStyle}
      content={popupContent}
      on="click"
      trigger={trigger}
      hideOnScroll
    />
  );
}
