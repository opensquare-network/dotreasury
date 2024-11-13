import CellHeader from "./common/CellHeader";
import AddressAssetBlock from "./common/AddressAssetBlock";
import ImageWithDark from "../../../components/ImageWithDark";
import { CellAssetBlocks, CellWrapper } from "./common/styleds";

export default function BountiesCell() {
  const bountiesCount = 62;
  return (
    <CellWrapper>
      <CellHeader
        label={`Bounties · ${bountiesCount}`}
        description="Funds for bounty programs"
        value="≈ $84,527,100"
        icon={
          <ImageWithDark src="/imgs/data-bounties.svg" width={48} height={48} />
        }
      />
      <CellAssetBlocks>
        <AddressAssetBlock assets={[{ symbol: "DOT", value: "≈ 1,680,000" }]} />
      </CellAssetBlocks>
    </CellWrapper>
  );
}
