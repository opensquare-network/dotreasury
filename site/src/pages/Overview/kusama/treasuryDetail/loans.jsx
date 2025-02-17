import BigNumber from "bignumber.js";
import { useKusamaTreasuryData } from "../../../../context/KusamaTreasury";
import useFiatPrice from "../../../../hooks/useFiatPrice";
import { toPrecision } from "../../../../utils";
import { currentChainSettings } from "../../../../utils/chains";
import ValueInfo from "./common/valueInfo";
import { ExternalLink } from "../../polkadot/treasuryDetail/common/assetItem";
import TreasuryDetailItem from "../../polkadot/treasuryDetail/common/item";
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
        content={
          <>
            <ValueDisplay value={totalFiatValue} prefix="$" />
            <ValueInfo
              balance={loansHydrationKsmBalance}
              isLoading={isLoansHydrationKsmLoading}
              showApproximationSymbol={false}
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
