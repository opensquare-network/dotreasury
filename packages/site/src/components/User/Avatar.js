import * as React from "react";
import Identicon from "@polkadot/react-identicon";

export default function Avatar({ address }) {
  const size = 24;
  const theme = "polkadot";

  return <Identicon value={address} size={size} theme={theme} />;
}
