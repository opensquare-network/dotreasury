import React, { useState } from "react";
import styled from "styled-components";

import Select from "../../components/Select";
import CompactInput from "../../components/CompactInput";
import { useEffect } from "react";
import { symbolFromNetwork } from "../../utils";

const Wrapper = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;
  align-items: center;

  @media screen and (max-width: 800px) {
    flex-direction: column;
  }

  & .field {
    margin: 0 !important;
  }

  .ui.dropdown .text {
    font-size: 12px !important;
  }
`;

const RangeSelect = styled(Select)`
  width: 160px;
  @media screen and (max-width: 800px) {
    width: 100%;
  }
`;

const RangeWrapper = styled.div`
  @media screen and (max-width: 800px) {
    width: 100%;
  }
  display: flex;
  gap: 4px;
  > div {
    width: 98px;
    flex-grow: 1;
  }
`;

const rangeOptions = [
  { key: "token", value: "token", text: "Range by token" },
  { key: "fiat", value: "fiat", text: "Range by fiat" },
];

const FilterButton = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 4px 8px;

  height: 24px;

  background: #f23252;
  border-radius: 4px;

  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  text-align: center;

  color: #ffffff;
`;

const ResetButton = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;

  height: 24px;

  background: none;
  border-radius: 4px;

  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  text-align: center;

  color: #f23252;
`;

export const RangeTypes = {
  Token: "token",
  Fiat: "fiat",
};

const RangeInput = ({ prefix, suffix, min, setMin, max, setMax, onEnter }) => {
  return (
    <RangeWrapper>
      <CompactInput
        prefix={prefix}
        suffix={suffix}
        placeholder="Min"
        value={min}
        onChange={(e) => setMin(e.target.value)}
        onEnter={onEnter}
      />
      <CompactInput
        prefix={prefix}
        suffix={suffix}
        placeholder="Max"
        value={max}
        onChange={(e) => setMax(e.target.value)}
        onEnter={onEnter}
      />
    </RangeWrapper>
  );
};

const Range = ({
  chain,
  rangeType,
  setRangeType,
  min,
  setMin,
  max,
  setMax,
}) => {
  const chainSymbol = symbolFromNetwork(chain)?.toUpperCase();
  const suffix = rangeType === RangeTypes.Token ? chainSymbol : "";
  const prefix = rangeType === RangeTypes.Fiat ? "$" : "";

  const [minValue, setMinValue] = useState(min);
  const [maxValue, setMaxValue] = useState(max);
  useEffect(() => {
    setMinValue(min);
    setMaxValue(max);
  }, [min, max]);

  const hasMinMaxValue = minValue || maxValue;
  const hasMinMax = min || max;

  const doFilter = () => {
    setMin(minValue);
    setMax(maxValue);
  };

  const doReset = () => {
    setMin("");
    setMax("");
    setMinValue("");
    setMaxValue("");
  };

  return (
    <Wrapper>
      <RangeSelect
        name="range"
        fluid
        options={rangeOptions}
        value={rangeType}
        onChange={(e, { name, value }) => setRangeType(value)}
      />
      <RangeInput
        prefix={prefix}
        suffix={suffix}
        min={minValue}
        setMin={setMinValue}
        max={maxValue}
        setMax={setMaxValue}
        onEnter={doFilter}
      />
      {hasMinMaxValue && <FilterButton onClick={doFilter}>Filter</FilterButton>}
      {hasMinMax && <ResetButton onClick={doReset}>Reset</ResetButton>}
    </Wrapper>
  );
};

export default Range;
