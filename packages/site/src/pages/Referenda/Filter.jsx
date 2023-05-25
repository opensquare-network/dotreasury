import React from "react";
import styled from "styled-components";
import { Form } from "semantic-ui-react";

import Select from "../../components/Select";
import Range from "../../components/Filter/Range";

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

const Divider = styled.div`
  width: 1px;
  height: 20px;
  background: var(--neutral300);
  @media screen and (max-width: 800px) {
    width: 100%;
    height: 1px;
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

export const RangeTypes = {
  Token: "token",
  Fiat: "fiat",
};

const Filter = ({
  chain,
  track,
  setTrack,
  status,
  setStatus,
  rangeType,
  setRangeType,
  min,
  setMin,
  max,
  setMax,
}) => {
  return (
    <FormWrapper>
      <TrackSelect
        name="tracks"
        fluid
        options={tracksOptions}
        defaultValue={track}
        onChange={(e, { name, value }) => setTrack(value)}
      />
      <StatusSelect
        name="status"
        fluid
        options={statusOptions}
        defaultValue={status}
        onChange={(e, { name, value }) => setStatus(value)}
      />
      <Divider />
      <Range
        chain={chain}
        rangeType={rangeType}
        setRangeType={setRangeType}
        min={min}
        setMin={setMin}
        max={max}
        setMax={setMax}
      />
    </FormWrapper>
  );
};

export default Filter;
