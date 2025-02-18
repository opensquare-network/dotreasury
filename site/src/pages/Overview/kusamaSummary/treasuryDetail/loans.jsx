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
import SkeletonBar from "../../../../components/skeleton/bar";
import { useMemo } from "react";

const LinkLabel = styled.p`
  display: inline-flex;
  margin-right: 4px;
  margin-bottom: 0;
`;

export default function TreasuryDetailLoans() {
  const { loansHydrationKsmBalance, isLoansHydrationKsmLoading } =
    useKusamaTreasuryData();
  const { price, loading: isPriceLoading } = useFiatPrice();
  const { decimals, symbol } = currentChainSettings;

  const totalFiatValue = toPrecision(
    BigNumber(loansHydrationKsmBalance).multipliedBy(price),
    decimals,
  );

  const isTotalFiatPriceLoading = useMemo(() => {
    return isPriceLoading || isLoansHydrationKsmLoading || price == 0;
  }, [isPriceLoading, isLoansHydrationKsmLoading, price]);

  return (
    <>
      <TreasuryDetailItem
        title="Loans"
        iconSrc="/imgs/data-approved.svg"
        customStyle={{ padding: 0 }}
        content={
          <>
            {isTotalFiatPriceLoading ? (
              <SkeletonBar
                width={160}
                height={22}
                style={{ margin: "3px 0" }}
              />
            ) : (
              <ValueDisplay value={totalFiatValue} prefix="$" />
            )}

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
