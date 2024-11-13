import CellHeader from "./common/CellHeader";
import AddressAssetBlock from "./common/AddressAssetBlock";
import ImageWithDark from "../../../components/ImageWithDark";
import { CellAssetBlocks, CellWrapper } from "./common/styleds";

export default function MythCell() {
  return (
    <CellWrapper>
      <CellHeader
        label="Myth Token"
        description="Airdrop & distribution of Myth tokens"
        value="≈ $84,527,100"
        icon={
          <ImageWithDark src="/imgs/data-myth.svg" width={48} height={48} />
        }
      />
      <CellAssetBlocks>
        <AddressAssetBlock
          label="Distribution Addr"
          href="https://polkadot.js.org/apps/#/explorer"
          assets={[{ symbol: "MYTH", value: "≈ 1,680,000" }]}
        />
      </CellAssetBlocks>
    </CellWrapper>
  );
}
