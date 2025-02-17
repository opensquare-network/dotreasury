import BigNumber from "bignumber.js";
import { useKusamaTreasuryData } from "../../../../context/KusamaTreasury";
import useFiatPrice from "../../../../hooks/useFiatPrice";
import SummaryItem from "../../../../components/Summary/Item";
import ImageWithDark from "../../../../components/ImageWithDark";
import { toPrecision } from "../../../../utils";
import { currentChainSettings } from "../../../../utils/chains";
import AssetFooter from "./common/assetFooter";
import AssetContent from "./common/assetContent";
import { ExternalLink } from "../../polkadot/treasuryDetail/common/assetItem";
import { KUSAMA_ASSETHUB_ACCOUNT } from "../../../../constants/kusama";

export default function TreasuryDetailOnAssetHub() {
  const {
    ksmTreasuryBalanceOnAssetHub,
    isKsmTreasuryBalanceOnAssetHubLoading,
  } = useKusamaTreasuryData();
  const { price } = useFiatPrice();
  const { decimals, symbol } = currentChainSettings;

  const totalFiatValue = toPrecision(
    BigNumber(ksmTreasuryBalanceOnAssetHub).multipliedBy(price),
    decimals,
  );

  return (
    <SummaryItem
      icon={<ImageWithDark src="/imgs/data-available.svg" />}
      title={
        <ExternalLink
          href={`https://assethub-kusama.subscan.io/account/${KUSAMA_ASSETHUB_ACCOUNT}`}
          externalIcon
          externalIconColor="textSecondary"
        >
          KSM on Asset hub
        </ExternalLink>
      }
      content={
        <div>
          <AssetContent
            balance={ksmTreasuryBalanceOnAssetHub}
            isLoading={isKsmTreasuryBalanceOnAssetHubLoading}
            symbol={symbol}
            decimals={decimals}
          />
          <AssetFooter
            balance={totalFiatValue}
            isLoading={isKsmTreasuryBalanceOnAssetHubLoading}
          />
        </div>
      }
    />
  );
}
