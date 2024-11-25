import styled from "styled-components";
import { FormWrapper, Divider } from "../../components/Filter";
import Range, { RangeTypes } from "../../components/Filter/Range";
import Select from "../../components/Select";
import { treasurySpendsAssetsFilterOptions } from "../../constants";

const AssetsSelect = styled(Select)`
  width: 160px;
  @media screen and (max-width: 800px) {
    width: 100%;
  }
`;

export default function TreasurySpendsFilter({
  chain,
  asset,
  setAsset,
  min,
  setMin,
  max,
  setMax,
  statusMap,
}) {
  return (
    <FormWrapper>
      <AssetsSelect
        name="assets"
        fluid
        options={treasurySpendsAssetsFilterOptions}
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
