import React from "react";
import {
  FormWrapper,
  tracksStatusList,
  StatusSelector,
  TrackSelector,
} from "../../../../components/OpenGovFilter";
import Select from "../../../../components/Select";
import { treasurySpendsAssetsFilterOptions } from "../../../../constants";
import styled from "styled-components";

const AssetsSelect = styled(Select)`
  width: 160px;
  @media screen and (max-width: 800px) {
    width: 100%;
  }
`;

export const tracksOptions = [
  { key: "all", value: "-1", text: "All tracks" },
  ...tracksStatusList.map((item) => ({
    key: item,
    value: item,
    text: <span style={{ whiteSpace: "nowrap" }}>{item}</span>,
  })),
];

function AssetsSelector({ assets, setAssets }) {
  return (
    <AssetsSelect
      name="assets"
      fluid
      options={treasurySpendsAssetsFilterOptions}
      value={assets}
      onChange={(_, { value }) => {
        setAssets(value);
      }}
    />
  );
}

const Filter = ({
  track,
  setTrack,
  status,
  setStatus,
  assets,
  setAssets,
  statusMap,
}) => {
  return (
    <FormWrapper>
      <TrackSelector track={track} setTrack={setTrack} />
      <AssetsSelector assets={assets} setAssets={setAssets} />
      <StatusSelector
        status={status}
        setStatus={setStatus}
        statusMap={statusMap}
      />
    </FormWrapper>
  );
};

export default Filter;
