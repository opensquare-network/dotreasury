import BigNumber from "bignumber.js";
import { useKusamaTreasuryData } from "../../../../context/KusamaTreasury";
import useFiatPrice from "../../../../hooks/useFiatPrice";
import SummaryItem from "../../../../components/Summary/Item";
import ImageWithDark from "../../../../components/ImageWithDark";
import { toPrecision } from "../../../../utils";
import { currentChainSettings } from "../../../../utils/chains";
import ValueInfo from "./common/valueInfo";
import ValueWrap from "./common/valueWrap";
import { ExternalLink } from "../../polkadot/treasuryDetail/common/assetItem";
import { KUSAMA_ASSETHUB_ACCOUNT } from "../../../../constants/kusama";

export default function TreasuryDetailLoans() {
  const { loansHydrationKsmBalance, isLoansHydrationKsmLoading } =
    useKusamaTreasuryData();
  const { price } = useFiatPrice();
  const { decimals, symbol } = currentChainSettings;

  const totalFiatValue = toPrecision(
    BigNumber(loansHydrationKsmBalance).multipliedBy(price),
    decimals,
  );

  return (
    <SummaryItem
      icon={<ImageWithDark src="/imgs/data-approved.svg" />}
      title="Loans"
      content={
        <div>
          <ValueWrap
            balance={loansHydrationKsmBalance}
            isLoading={isLoansHydrationKsmLoading}
            symbol={symbol}
            decimals={decimals}
          />
          <ValueInfo
            balance={totalFiatValue}
            isLoading={isLoansHydrationKsmLoading}
            prefix={
              <ExternalLink
                href="https://kusama.subsquare.io/referenda/490"
                externalIcon
                externalIconColor="textSecondary"
              >
                Hydration
              </ExternalLink>
            }
          />
        </div>
      }
    />
  );
}
