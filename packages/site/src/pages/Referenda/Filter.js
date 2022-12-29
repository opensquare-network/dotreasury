import React from "react";
import styled from "styled-components";
import { Form } from "semantic-ui-react";

import Select from "../../components/Select";

const FormWrapper = styled(Form)`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
`;

const StatusSelect = styled(Select)`
  width: 145px;
`;

const TrackSelect = styled(Select)`
  width: 190px;
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
    "Root",
    "Whitelisted Caller",
    "Staking Admin",
    "Treasurer",
    "Lease Admin",
    "Fellowship Admin",
    "General Admin",
    "Auction Admin",
    "Referendum Canceller",
    "Referendum Killer",
    "Small Tipper",
    "Big Tipper",
    "Small Spender",
    "Medium Spender",
    "Big Spender",
  ].map((item) => ({
    key: item,
    value: item.toLowerCase().replace(" ", "_"),
    text: <span style={{whiteSpace: "nowrap"}}>{item}</span>,
  })),
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
    </FormWrapper>
  );
};

export default Filter;
