import BigNumber from "bignumber.js";
import { useKusamaTreasuryData } from "../../../../context/KusamaTreasury";
import useFiatPrice from "../../../../hooks/useFiatPrice";
import SummaryItem from "../../../../components/Summary/Item";
import ImageWithDark from "../../../../components/ImageWithDark";
import { toPrecision } from "../../../../utils";
import { currentChainSettings } from "../../../../utils/chains";
import ValueInfo from "./common/valueInfo";
import ValueWrap from "./common/valueWrap";

export default function TreasuryDetailOnRelayChain() {
  const { relayChainFreeBalance, isRelayChainFreeLoading } =
    useKusamaTreasuryData();
  const { price: ksmPrice } = useFiatPrice();
  const { decimals, symbol } = currentChainSettings;

  const totalFiatValue = BigNumber(
    toPrecision(relayChainFreeBalance, decimals),
  ).multipliedBy(ksmPrice);

  return (
    <SummaryItem
      icon={<ImageWithDark src="/imgs/data-available.svg" />}
      title="KSM on Relay chain"
      content={
        <div>
          <ValueWrap
            balance={relayChainFreeBalance}
            isLoading={isRelayChainFreeLoading}
            symbol={symbol}
            decimals={decimals}
          />
          <ValueInfo
            balance={totalFiatValue}
            symbolPrice={ksmPrice}
            isLoading={isRelayChainFreeLoading}
          />
        </div>
      }
    />
  );
}
