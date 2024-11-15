import React from "react";
import {
  FormWrapper,
  StatusSelect,
  tracksStatusList,
  StatusSelector,
  TrackSelector,
} from "../../../../components/OpenGovFilter";

export const tracksOptions = [
  { key: "all", value: "-1", text: "All tracks" },
  ...tracksStatusList.map((item) => ({
    key: item,
    value: item,
    text: <span style={{ whiteSpace: "nowrap" }}>{item}</span>,
  })),
];

const assetsOptions = [
  { key: "all", value: "-1", text: "All assets" },
  ...["DOT", "USDC", "USDT", "MYTH"].map((item) => ({
    key: item,
    value: item,
    text: <span style={{ whiteSpace: "nowrap" }}>{item}</span>,
  })),
];

function AssetsSelector({ assets, setAssets }) {
  return (
    <StatusSelect
      name="status"
      fluid
      options={assetsOptions}
      value={assets}
      onChange={(e, { name, value }) => setAssets(value)}
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
