import * as React from "react";
import Identicon from "@osn/polkadot-react-identicon";
import styled from "styled-components";

const Wrapper = styled(Identicon)`
  svg circle:first-child {
    fill: var(--neutral200);
  }
`;

export default function Avatar({ address, size = 24 }) {
  const theme = "polkadot";
  return <Wrapper value={address} size={size} theme={theme} />;
}
