import React from "react";
import styled from "styled-components";
import { Form } from "semantic-ui-react";

import Select from "../../components/Select";
import CompactInput from "../../components/CompactInput";

const FormWrapper = styled(Form)`
  display: flex;
  justify-content: flex-end;
  gap: 16px;

  & .field {
    margin: 0 !important;
  }

  .ui.dropdown .text {
    font-size: 12px !important;
  }
`;

const StatusSelect = styled(Select)`
  width: 145px;
`;

const TrackSelect = styled(Select)`
  width: 160px;
`;

const RangeSelect = styled(Select)`
  width: 160px;
`;

const Divider = styled.div`
  width: 1px;
  height: 20px;
  background: var(--neutral300);
`;

const RangeWrapper = styled.div`
  display: flex;
  gap: 4px;
  > div {
    width: 98px;
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
  { key: "range-by-asset", value: "range-by-asset", text: "Range by asset" },
  { key: "range-by-currency", value: "range-by-currency", text: "Range by currency" },
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

const RangeInput = ({ prefix, suffix, setMin, setMax }) => {
  return (
    <RangeWrapper>
      <CompactInput
        prefix={prefix}
        suffix={suffix}
        placeholder="Min"
        onChange={e => setMin(e.target.value)}
      />
      <CompactInput
        prefix={prefix}
        suffix={suffix}
        placeholder="Max"
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
  const suffix = rangeType === "range-by-asset" ? chainSymbol : "";
  const prefix = rangeType === "range-by-asset" ? "" : "$";
  const hasMinMax = min || max;

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
        defaultValue="range-by-asset"
        onChange={(e, { name, value }) => setRangeType(value)}
      />
      <RangeInput prefix={prefix} suffix={suffix} setMin={setMin} setMax={setMax} />
      {hasMinMax ? (
        <ResetButton>Reset</ResetButton>
      ) : (
        <FilterButton>Filter</FilterButton>
      )}
    </FormWrapper>
  );
};

export default Filter;
