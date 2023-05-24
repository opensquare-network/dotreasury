import React from "react";
import styled from "styled-components";
import { Form } from "semantic-ui-react";

import Select from "../../components/Select";

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

const Filter = ({ setTrack, setStatus }) => {
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
      <RangeSelect
        name="range"
        fluid
        options={rangeOptions}
        defaultValue="range-by-asset"

      />
    </FormWrapper>
  );
};

export default Filter;
