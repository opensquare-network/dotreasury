import React from "react";
import styled from "styled-components";
import { Form } from "semantic-ui-react";

import Select from "../Select";
import Range from "../Filter/Range";

export const FormWrapper = styled(Form)`
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

export const StatusSelect = styled(Select)`
  width: 145px;
  @media screen and (max-width: 800px) {
    width: 100%;
  }
`;

export const TrackSelect = styled(Select)`
  width: 160px;
  @media screen and (max-width: 800px) {
    width: 100%;
  }
`;

export const Divider = styled.div`
  width: 1px;
  height: 20px;
  background: var(--neutral300);
  @media screen and (max-width: 800px) {
    width: 100%;
    height: 1px;
  }
`;

export const tracksStatusList = [
  "Treasurer",
  "Big Spender",
  "Medium Spender",
  "Small Spender",
  "Big Tipper",
  "Small Tipper",
];

const tracksOptions = [
  { key: "all", value: "-1", text: "All tracks" },
  ...tracksStatusList.map((item) => ({
    key: item,
    value: item.toLowerCase().replace(" ", "_"),
    text: <span style={{ whiteSpace: "nowrap" }}>{item}</span>,
  })),
];

function getStatusOptions(statusMap) {
  return [
    { key: "all", value: "-1", text: "All status" },
    ...Array.from(new Set(Object.values(statusMap))).map((key) => ({
      key,
      value: Object.entries(statusMap)
        .filter(([, v]) => v === key)
        .map(([k]) => k)
        .join("||"),
      text: key,
    })),
  ];
}

export function TrackSelector({ track, setTrack }) {
  return (
    <TrackSelect
      name="tracks"
      fluid
      options={tracksOptions}
      value={track}
      onChange={(e, { name, value }) => setTrack(value)}
    />
  );
}

export function StatusSelector({ status, setStatus, statusMap }) {
  const options = getStatusOptions(statusMap);

  return (
    <StatusSelect
      name="status"
      fluid
      options={options}
      value={status}
      onChange={(e, { name, value }) => setStatus(value)}
    />
  );
}

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
  statusMap,
  showRange = true,
}) => {
  return (
    <FormWrapper>
      <TrackSelector track={track} setTrack={setTrack} />
      <StatusSelector
        status={status}
        setStatus={setStatus}
        statusMap={statusMap}
      />
      {showRange && (
        <>
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
        </>
      )}
    </FormWrapper>
  );
};

export default Filter;
