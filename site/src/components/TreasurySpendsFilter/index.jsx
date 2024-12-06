import styled from "styled-components";
import { StatusSelect, FormWrapper, Divider } from "../../components/Filter";
import Range, { RangeTypes } from "../../components/Filter/Range";
import Select from "../../components/Select";
import { useTreasurySpendAssetsFilterOptions } from "../../hooks/useTreasurySpendsAssetsFilterOptions";

const AssetsSelect = styled(Select)`
  width: 160px;
  @media screen and (max-width: 800px) {
    width: 100%;
  }
`;

export default function TreasurySpendsFilter({
  chain,
  status,
  setStatus,
  asset,
  setAsset,
  min,
  setMin,
  max,
  setMax,
  statusMap,
}) {
  const treasurySpendAssetsFilterOptions =
    useTreasurySpendAssetsFilterOptions();

  const statusOptions = [
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

  return (
    <FormWrapper>
      <StatusSelect
        name="status"
        fluid
        options={statusOptions}
        value={status}
        onChange={(_, { value }) => {
          setStatus(value);
        }}
      />
      <AssetsSelect
        name="assets"
        fluid
        options={treasurySpendAssetsFilterOptions}
        value={asset}
        onChange={(_, { value }) => {
          setAsset(value);
        }}
      />
      <Divider />
      <Range
        chain={chain}
        rangeType={RangeTypes.Fiat}
        rangeReadonly
        min={min}
        setMin={setMin}
        max={max}
        setMax={setMax}
      />
    </FormWrapper>
  );
}
