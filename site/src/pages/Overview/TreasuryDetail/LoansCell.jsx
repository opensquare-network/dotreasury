import CellHeader from "./common/CellHeader";
import AddressAssetBlock from "./common/AddressAssetBlock";
import ImageWithDark from "../../../components/ImageWithDark";
import { CellAssetBlocks, CellWrapper } from "./common/styleds";

export default function LoansCell() {
  return (
    <CellWrapper>
      <CellHeader
        label="Loans"
        description="Loans receivable"
        value="≈ $84,527,100"
        icon={
          <ImageWithDark src="/imgs/data-approved.svg" width={48} height={48} />
        }
      />
      <CellAssetBlocks>
        <AddressAssetBlock
          label="Centrifuge"
          href="https://polkadot.js.org/apps/#/explorer"
          assets={[{ symbol: "USDC", value: "≈ 1,680,000" }]}
        />
        <AddressAssetBlock
          label="Bifrost"
          href="https://polkadot.js.org/apps/#/explorer"
          assets={[{ symbol: "DOT", value: "≈ 1,680,000" }]}
        />
        <AddressAssetBlock
          label="Pendulum"
          href="https://polkadot.js.org/apps/#/explorer"
          assets={[{ symbol: "DOT", value: "≈ 1,680,000" }]}
        />
      </CellAssetBlocks>
    </CellWrapper>
  );
}
