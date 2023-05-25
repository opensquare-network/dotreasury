import React, { useState } from "react";
import styled from "styled-components";
import { Form } from "semantic-ui-react";

import Select from "../../components/Select";
import CompactInput from "../../components/CompactInput";

const FormWrapper = styled(Form)`
  display: flex;
  gap: 16px;
  flex-grow: 1;
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

const StatusSelect = styled(Select)`
  width: 145px;
  @media screen and (max-width: 800px) {
    width: 100%;
  }
`;

const TrackSelect = styled(Select)`
  width: 160px;
  @media screen and (max-width: 800px) {
    width: 100%;
  }
`;

const RangeSelect = styled(Select)`
  width: 160px;
  @media screen and (max-width: 800px) {
    width: 100%;
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 20px;
  background: var(--neutral300);
  @media screen and (max-width: 800px) {
    width: 100%;
    height: 1px;
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

const statusOptions = [
  { key: "all", value: "-1", text: "All status" },
  ...[
    "Confirming",
    "Deciding",
    "Queueing",
    "Submitted",
    "Approved",
    "Cancelled",
    "Killed",
    "TimedOut",
    "Rejected",
    "Executed",
  ].map((item) => ({
    key: item,
    value: item,
    text: item,
  })),
];

const tracksOptions = [
  { key: "all", value: "-1", text: "All tracks" },
  ...[
    "Treasurer",
    "Small Tipper",
    "Big Tipper",
    "Small Spender",
    "Medium Spender",
    "Big Spender",
  ].map((item) => ({
    key: item,
    value: item.toLowerCase().replace(" ", "_"),
    text: <span style={{ whiteSpace: "nowrap" }}>{item}</span>,
  })),
];

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

  background: #F23252;
  border-radius: 4px;

  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  text-align: center;

  color: #FFFFFF;
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

  color: #F23252;
`;

export const RangeTypes = {
  Token: "token",
  Fiat: "fiat",
};

const RangeInput = ({ prefix, suffix, min, setMin, max, setMax }) => {
  return (
    <RangeWrapper>
      <CompactInput
        prefix={prefix}
        suffix={suffix}
        placeholder="Min"
        value={min}
        onChange={e => setMin(e.target.value)}
      />
      <CompactInput
        prefix={prefix}
        suffix={suffix}
        placeholder="Max"
        value={max}
        onChange={e => setMax(e.target.value)}
      />
    </RangeWrapper>
  );
};

const Filter = ({
  chain,
  setTrack,
  setStatus,
  rangeType,
  setRangeType,
  min,
  setMin,
  max,
  setMax,
}) => {
  const chainSymbol = chain === "kusama" ? "KSM" : "DOT";
  const suffix = rangeType === RangeTypes.Token ? chainSymbol : "";
  const prefix = rangeType === RangeTypes.Fiat ? "$": "";

  const [minValue, setMinValue] = useState(min);
  const [maxValue, setMaxValue] = useState(max);
  const hasMinMax = minValue || maxValue;

  return (
    <FormWrapper>
      <TrackSelect
        name="tracks"
        fluid
        options={tracksOptions}
        defaultValue="-1"
        onChange={(e, { name, value }) => setTrack(value)}
      />
      <StatusSelect
        name="status"
        fluid
        options={statusOptions}
        defaultValue="-1"
        onChange={(e, { name, value }) => setStatus(value)}
      />
      <Divider />
      <RangeSelect
        name="range"
        fluid
        options={rangeOptions}
        defaultValue={rangeType}
        onChange={(e, { name, value }) => setRangeType(value)}
      />
      <RangeInput
        prefix={prefix}
        suffix={suffix}
        min={minValue}
        setMin={setMinValue}
        max={maxValue}
        setMax={setMaxValue}
      />
      {hasMinMax && (
        <>
          <FilterButton onClick={() => {
            setMin(minValue);
            setMax(maxValue);
          }}>Filter</FilterButton>
          <ResetButton onClick={() => {
            setMin("");
            setMax("");
            setMinValue("");
            setMaxValue("");
          }}>Reset</ResetButton>
        </>
      )}
    </FormWrapper>
  );
};

export default Filter;
