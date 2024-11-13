import CellHeader from "./common/CellHeader";
import AddressAssetBlock from "./common/AddressAssetBlock";
import ImageWithDark from "../../../components/ImageWithDark";
import { CellAssetBlocks, CellWrapper } from "./common/styleds";

export default function AssetsCell() {
  return (
    <CellWrapper>
      <CellHeader
        label="Assets"
        description="Funds of DOT & stablecoin"
        value="≈ $84,527,100"
        icon={
          <ImageWithDark
            src="/imgs/data-available.svg"
            width={48}
            height={48}
          />
        }
      />
      <CellAssetBlocks>
        <AddressAssetBlock
          label="Main"
          href="https://polkadot.js.org/apps/#/explorer"
          assets={[{ symbol: "DOT", value: "≈ 1,680,000" }]}
        />
        <AddressAssetBlock
          label="Asset Hub"
          href="https://polkadot.js.org/apps/#/explorer"
          assets={[
            { symbol: "DOT", value: "≈ 1,680,000" },
            { symbol: "USDt", value: "≈ 1,680,000" },
            { symbol: "USDC", value: "≈ 1,680,000" },
          ]}
        />
      </CellAssetBlocks>
    </CellWrapper>
  );
}
