import styled from "styled-components";
import CellHeader from "./common/CellHeader";
import AddressAssetBlock from "./common/AddressAssetBlock";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 376px;
`;

export default function AssetsCell() {
  return (
    <Wrapper>
      <CellHeader
        label="Assets"
        description="Funds of DOT & stablecoin"
        value="≈ $84,527,100"
        icon={null}
      />
      <AddressAssetBlock
        label="Main"
        href="https://polkadot.js.org/apps/#/explorer"
        assets={[
          { symbol: "DOT", value: "≈ 1,680,000" },
          { symbol: "USDt", value: "≈ 1,680,000" },
          { symbol: "USDC", value: "≈ 1,680,000" },
        ]}
      />
    </Wrapper>
  );
}
