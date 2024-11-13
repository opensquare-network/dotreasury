import CellHeader from "./common/CellHeader";
import AddressAssetBlock from "./common/AddressAssetBlock";
import ImageWithDark from "../../../components/ImageWithDark";
import { CellAssetBlocks, CellWrapper } from "./common/styleds";

export default function FellowshipCell() {
  return (
    <CellWrapper>
      <CellHeader
        label="Fellowship"
        description="Fellowship spending account & salary treasury"
        value="≈ $84,527,100"
        icon={
          <ImageWithDark
            src="/imgs/data-fellowship.svg"
            width={48}
            height={48}
          />
        }
      />
      <CellAssetBlocks>
        <AddressAssetBlock
          label="Treasury"
          href="https://polkadot.js.org/apps/#/explorer"
          assets={[{ symbol: "DOT", value: "≈ 1,680,000" }]}
        />
        <AddressAssetBlock
          label="Salary"
          href="https://polkadot.js.org/apps/#/explorer"
          assets={[{ symbol: "USDt", value: "≈ 1,680,000" }]}
        />
      </CellAssetBlocks>
    </CellWrapper>
  );
}
