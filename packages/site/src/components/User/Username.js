import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {Popup} from "semantic-ui-react";

import TextMinor from "../TextMinor";
import { TEXT_DARK_MAJOR } from "../../constants";
import { useWindowSize } from "../../utils/hooks";

const TextUsername = styled(TextMinor)`
  white-space: nowrap;
  cursor: pointer;
  flex-grow: 1;
  &:hover {
    color: ${TEXT_DARK_MAJOR};
    text-decoration-line: underline;
  }
`;

const Username = ({ address, name, ellipsis, popup }) => {
  const [disabledPopup, setDisabledPopup] = useState(true)
  const [width] = useWindowSize();
  useEffect(() => {
    setDisabledPopup(!popup || width < 1128)
  }, [popup, width])
  let displayAddress = address;
  if (ellipsis && address) {
    displayAddress = `${address.substring(0, 6)}...${address.substring(address.length - 6, address.length)}`
  }
  const displayName = name ? name : displayAddress;
  return (
    <Popup
      content={address}
      size='mini'
      disabled={disabledPopup}
      trigger={<TextUsername>{displayName}</TextUsername>}
    />
  );
};

export default Username;
