import React from "react";
import styled from "styled-components";
import { Popup } from "semantic-ui-react";

import TextMinor from "../TextMinor";
import { useDisablePopup } from "../../utils/hooks";

const TextUsername = styled(TextMinor)`
  white-space: nowrap;
  cursor: pointer;
  flex-grow: 1;
  font-size: 14px;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.65) !important;
  &:hover {
    color: rgba(0, 0, 0, 0.9) !important;
    text-decoration-line: underline;
  }
`;

const Username = ({ address, name, ellipsis, popup, popupContent }) => {
  const disabledPopup = useDisablePopup();
  let displayAddress;
  if (typeof address === "string") {
    if (ellipsis) {
      displayAddress = `${address.substring(0, 4)}...${address.substring(
        address.length - 4,
        address.length
      )}`;
    } else {
      displayAddress = address;
    }
  } else if (typeof address === "object") {
    if (ellipsis) {
      displayAddress = `${address.id.substring(0, 4)}...${address.id.substring(
        address.id.length - 4,
        address.id.length
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
      trigger={<TextUsername>{displayName}</TextUsername>}
    />
  );
};

export default Username;
