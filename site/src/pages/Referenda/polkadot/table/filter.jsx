import React from "react";
import {
  FormWrapper,
  StatusSelector,
} from "../../../../components/OpenGovFilter";
import Select from "../../../../components/Select";
import styled from "styled-components";
import { usePolkadotApplicationsTrackOptions } from "../../../../context/PolkadotApplications";
import { useTreasurySpendAssetsFilterOptions } from "../../../../hooks/useTreasurySpendsAssetsFilterOptions";

const AssetsSelect = styled(Select)`
  width: 160px;
  @media screen and (max-width: 800px) {
    width: 100%;
  }
`;

function translateTracksOptions(tracksStatusList) {
  return [
    { key: "all", value: "-1", text: "All tracks" },
    ...tracksStatusList.map((item) => ({
      key: item,
      value: item.toLowerCase().replace(" ", "_"),
      text: <span style={{ whiteSpace: "nowrap" }}>{item}</span>,
    })),
  ];
}

const TrackSelect = styled(Select)`
  width: 160px;
  @media screen and (max-width: 800px) {
    width: 100%;
  }
`;

function TrackSelector({ track, setTrack }) {
  const tracksOptions = usePolkadotApplicationsTrackOptions();

  const options = translateTracksOptions(tracksOptions);
  return (
    <TrackSelect
      name="tracks"
      fluid
      options={options}
      value={track}
      onChange={(e, { name, value }) => setTrack(value)}
    />
  );
}

function AssetsSelector({ assets, setAssets }) {
  const treasurySpendsAssetsFilterOptions =
    useTreasurySpendAssetsFilterOptions();
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
