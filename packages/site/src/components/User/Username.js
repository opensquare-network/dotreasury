import React from "react";
import styled, { css } from "styled-components";
import { Popup } from "semantic-ui-react";

import TextMinor from "../TextMinor";
import { useDisablePopup } from "../../utils/hooks";
import { truncate } from "../../styles/tailwindcss";

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

  const displayName = name ? name : displayAddress;
  return (
    <Popup
      content={
        popupContent ? popupContent : name ? `${name} ${address}` : address
      }
      size="mini"
      disabled={!popup || disabledPopup}
      trigger={<TextUsername noLink={noLink}>{displayName}</TextUsername>}
    />
  );
};

export default Username;
