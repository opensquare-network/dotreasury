import React from "react";

import PairText from "./PairText";
import { toPrecision } from "../utils";

const Balance = ({ value = 0, currency = "KSM" }) => {
  if (value === null || value === undefined) value = 0;
  const precision = toPrecision(value, 12, false);
  return <PairText value={precision} unit={currency} />;
};

export default Balance;
