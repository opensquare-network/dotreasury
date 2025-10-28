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
import { useTreasuryAccount } from "../../../../hooks/treasury/useQueryRelayChainFree";
import useApi from "../../../../hooks/useApi";

function Title() {
  const api = useApi();
  const account = useTreasuryAccount(api);
  if (!account) {
    return "KSM on Asset hub";
  }

  return (
    <ExternalLink
      href={`https://assethub-kusama.subscan.io/account/${account}`}
      externalIcon
      externalIconColor="textSecondary"
    >
      KSM on Asset hub
    </ExternalLink>
  );
}

export default function TreasuryDetailOnAssetHub() {
  const { relayChainFreeBalance, isRelayChainFreeLoading } =
    useKusamaTreasuryData();
  const { price, loading: isPriceLoading } = useFiatPrice();
  const { decimals, symbol } = currentChainSettings;

  const totalFiatValue = toPrecision(
    BigNumber(relayChainFreeBalance).multipliedBy(price),
    decimals,
  );

  return (
    <SummaryItem
      icon={<ImageWithDark src="/imgs/data-available.svg" />}
      title={<Title />}
      content={
        <div>
          <AssetContent
            balance={relayChainFreeBalance}
            isLoading={isRelayChainFreeLoading || isPriceLoading}
            symbol={symbol}
            decimals={decimals}
          />
          <AssetFooter
            balance={totalFiatValue}
            isLoading={isRelayChainFreeLoading}
          />
        </div>
      }
    />
  );
}
