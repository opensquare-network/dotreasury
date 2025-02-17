import BigNumber from "bignumber.js";
import { useKusamaTreasuryData } from "../../../../context/KusamaTreasury";
import useFiatPrice from "../../../../hooks/useFiatPrice";
import { toPrecision } from "../../../../utils";
import { currentChainSettings } from "../../../../utils/chains";
import AssetFooter from "./common/assetFooter";
import { ExternalLink } from "../../polkadot/treasuryDetail/common/assetItem";
import TreasuryDetailItem from "./common/item";
import ValueDisplay from "../../../../components/ValueDisplay";
import styled from "styled-components";

const LinkLabel = styled.p`
  display: inline-flex;
  margin-right: 4px;
  margin-bottom: 0;
`;

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
    <>
      <TreasuryDetailItem
        title="Loans"
        iconSrc="/imgs/data-approved.svg"
        customStyle={{ padding: 0 }}
        content={
          <>
            <ValueDisplay value={totalFiatValue} prefix="$" />
            <AssetFooter
              balance={loansHydrationKsmBalance}
              isLoading={isLoansHydrationKsmLoading}
              showApproximationSymbol={false}
              showPrefixSymbol={false}
              prefix={
                <LinkLabel>
                  <ExternalLink
                    href="https://kusama.subsquare.io/referenda/490"
                    externalIcon
                    externalIconColor="textSecondary"
                  >
                    Hydration
                  </ExternalLink>
                </LinkLabel>
              }
              suffix={<span>&nbsp;{symbol}</span>}
            />
          </>
        }
        isLoading={isLoansHydrationKsmLoading}
      />
    </>
  );
}
