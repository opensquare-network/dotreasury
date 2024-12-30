import TreasuryDetailItem from "./common/item";
import { toPrecision } from "../../../../utils";
import { USDt } from "../../../../utils/chains/usdt";
import ValueDisplay from "../../../../components/ValueDisplay";
import { STATEMINT_AMBASSADOR_TREASURY_ACCOUNT } from "../../../../constants/statemint";
import AssetValueDisplay from "./common/assetValueDisplay";
import { usePolkadotTreasuryData } from "../../../../context/PolkadotTreasury";
import AssetWrapper from "./common/assetWrapper";
import { ExternalLink } from "./common/assetItem";

export default function TreasuryDetailAmbassador() {
  const { ambassadorUSDtBalance, isAmbassadorUSDtLoading } =
    usePolkadotTreasuryData();

  return (
    <TreasuryDetailItem
      title={
        <ExternalLink
          href={`https://assethub-polkadot.subscan.io/account/${STATEMINT_AMBASSADOR_TREASURY_ACCOUNT}`}
          externalIcon
          externalIconColor="textSecondary"
        >
          Ambassador
        </ExternalLink>
      }
      iconSrc="/imgs/data-collectives.svg"
      content={
        <ValueDisplay
          value={toPrecision(ambassadorUSDtBalance, USDt.decimals)}
          prefix="$"
        />
      }
      isLoading={isAmbassadorUSDtLoading}
      footer={
        <AssetWrapper>
          <AssetValueDisplay
            symbol="usdt"
            value={ambassadorUSDtBalance}
            precision={USDt.decimals}
            isLoading={isAmbassadorUSDtLoading}
          />
        </AssetWrapper>
      }
    />
  );
}
