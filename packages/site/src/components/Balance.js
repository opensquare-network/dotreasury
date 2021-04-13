import React from "react";

import PairText from "./PairText";
import { toPrecision, getPrecision } from "../utils";
import { useSelector } from "react-redux";
import { chainSymbolSelector } from "../store/reducers/chainSlice";

const Balance = ({ value = 0, currency }) => {
  const symbol = useSelector(chainSymbolSelector);

  if (value === null || value === undefined) value = 0;
  const precision = toPrecision(value, getPrecision(currency || symbol), false);
  return <PairText value={precision} unit={currency || symbol} />;
};

export default Balance;
