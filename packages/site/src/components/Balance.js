import React from "react";

import PairText from "./PairText";

const Balance = ({ value = 0, currency = "OSN" }) => {
  return <PairText value={value} unit={currency} />;
};

export default Balance;
