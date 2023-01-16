import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { chainSymbolSelector } from "../../../store/reducers/chainSlice";
import { getPrecision, toPrecision } from "../../../utils";
import TipsTableForPC from "./TipsTableForPC";
import TipsTableForMobile from "./TipsTableForMobile";
import { useWindowSize } from "@osn/common";

export default function useTipsTable({ tips, isLoading }) {
  const [tipList, setTipList] = useState();
  const symbol = useSelector(chainSymbolSelector);
  const precision = getPrecision(symbol);
  const [tipValues, setTipValues] = useState({});

  useEffect(() => {
    setTipList(tips);

    const tipValues = tips.reduce((result, tip) => (
      {
        ...result,
        [tip.hash]: `${toPrecision(tip.medianValue || 0, precision, false)}`
      }), {})
    setTipValues(tipValues);
  }, [tips, precision]);

  const updateTipValue = useCallback((hash, tipValue) => {
    setTipValues({
      ...tipValues,
      [hash]: tipValue
    });
  }, [tipValues]);

  const removeTip = useCallback((hash) => {
    setTipList(tipList.filter(tip => tip.hash !== hash));
    const { [hash]: _, ...newTipValues } = tipValues;
    setTipValues(newTipValues)
  }, [tipList, tipValues]);


  const { width } = useWindowSize();

  const Component = width > 800 ? (
    <TipsTableForPC
      symbol={symbol}
      isLoading={isLoading}
      tipList={tipList}
      tipValues={tipValues}
      removeTip={removeTip}
      updateTipValue={updateTipValue}
    />
  ) : (
    <TipsTableForMobile
      symbol={symbol}
      isLoading={isLoading}
      tipList={tipList}
      tipValues={tipValues}
      removeTip={removeTip}
      updateTipValue={updateTipValue}
    />
  );

  return {
    Component,
    tipValues,
    setTipValues,
  }
}
