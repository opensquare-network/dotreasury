import CellHeader from "./common/CellHeader";
import { AddressAssetBlockMultiLabal } from "./common/AddressAssetBlock";
import ImageWithDark from "../../../components/ImageWithDark";
import { CellAssetBlocks, CellWrapper } from "./common/styleds";

export default function HydrationCell() {
  return (
    <CellWrapper>
      <CellHeader
        label="Hydration"
        description="Treasury stablecoin acquisition"
        value="≈ $84,527,100"
        icon={
          <ImageWithDark
            src="/imgs/data-hydration.svg"
            width={48}
            height={48}
          />
        }
      />
      <CellAssetBlocks>
        <AddressAssetBlockMultiLabal
          labels={[
            {
              label: "Acquisition Addr #1",
              href: "https://polkadot.js.org/apps/#/explorer",
            },
            {
              label: "Acquisition Addr #2",
              href: "https://polkadot.js.org/apps/#/explorer",
            },
          ]}
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
