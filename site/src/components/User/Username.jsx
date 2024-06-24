import React from "react";
import styled, { css } from "styled-components";
import { Popup } from "semantic-ui-react";

import TextMinor from "../TextMinor";
import { useDisablePopup } from "../../utils/hooks";
import { truncate } from "../../styles/tailwindcss";
import { KNOWN_ADDR_MATCHERS } from "../../utils/knownAddr";
import IdentitySpecial from "../Icon/identity-special.svg";
import Tooltip from "../Tooltip";
import { p_12_medium } from "../../styles/text";

const TextUsername = styled(TextMinor)`
  white-space: nowrap;
  ${truncate};
  cursor: pointer;
  flex-grow: 1;
  font-size: 14px;
  line-height: 22px;
  ${(p) =>
    p.noLink
      ? css`
          color: var(--textPrimary) !important;
        `
      : css`
          color: var(--textSecondary) !important;
          &:hover {
            color: var(--textPrimary) !important;
            text-decoration-line: underline;
          }
        `}
`;

const SpecialAccountWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Text = styled.span`
  ${p_12_medium}
  color: var(--textPrimaryContrast);
`;

const Username = ({ address, name, ellipsis, popup, popupContent, noLink }) => {
  const disabledPopup = useDisablePopup();

  let displayAddress;
  if (typeof address === "string") {
    if (ellipsis) {
      displayAddress = `${address.substring(0, 4)}...${address.substring(
        address.length - 4,
        address.length,
      )}`;
    } else {
      displayAddress = address;
    }
  } else if (typeof address === "object") {
    if (ellipsis) {
      displayAddress = `${address.id.substring(0, 4)}...${address.id.substring(
        address.id.length - 4,
        address.id.length,
      )}`;
    } else {
      displayAddress = address.id;
    }
  }

  const knownAddr = KNOWN_ADDR_MATCHERS.map((matcher) => matcher(address)).find(
    Boolean,
  );

  const displayName = name ? name : knownAddr ? knownAddr : displayAddress;
  return (
    <SpecialAccountWrapper>
      {knownAddr && (
        <Tooltip tooltipContent={<Text>Special account</Text>}>
          <img src={IdentitySpecial} alt="special" width={12} height={12} />
        </Tooltip>
      )}
      <Popup
        content={
          popupContent ? popupContent : name ? `${name} ${address}` : address
        }
        size="mini"
        disabled={!popup || disabledPopup}
        trigger={<TextUsername noLink={noLink}>{displayName}</TextUsername>}
      />
    </SpecialAccountWrapper>
  );
};

export default Username;
