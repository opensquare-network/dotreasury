import styled from "styled-components";
import Card from "../../../components/Card";
import {
  h4_16_semibold,
  p_14_medium,
  p_14_semibold,
} from "../../../styles/text";
import { useHydrationTreasuryBalances } from "../../../hooks/hydration/useHydrationTreasuryBalances";
import { text_primary } from "../../../styles/tailwindcss";
import BigNumber from "bignumber.js";
import { polkadot } from "../../../utils/chains/polkadot";
import ValueDisplay from "../../../components/ValueDisplay";
import { USDt } from "../../../utils/chains/usdt";
import { USDC } from "../../../utils/chains/usdc";
import SkeletonBar from "../../../components/skeleton/bar";
import { useSelector } from "react-redux";
import { overviewSelector } from "../../../store/reducers/overviewSlice";
import { toPrecision } from "../../../utils";

const Wrapper = styled(Card)`
  padding: 24px;
  ${text_primary}
`;

const Title = styled.h4`
  ${h4_16_semibold}
  margin-bottom: 0;
`;

const TotalPrice = styled.div`
  ${p_14_semibold}
  font-weight: 700;
  font-size: 24px;
  line-height: 36px;
  margin-top: 4px;
`;

const TokenGroup = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 24px;
`;

const Item = styled.div`
  padding: 12px;
  ${p_14_medium}
  background-color: var(--neutral200);
  border-radius: 4px;
`;

function TokenItem({ isLoading, totalValue, precision, symbol }) {
  if (isLoading) {
    return <SkeletonBar width={117} height={44} />;
  }

  return (
    <Item>
      <ValueDisplay value={totalValue} precision={precision} /> {symbol}
    </Item>
  );
}

export default function OverviewTotalTreasury() {
  const overview = useSelector(overviewSelector);
  const hydration = useHydrationTreasuryBalances();

  const dotPrice = overview?.latestSymbolPrice ?? 0;

  const totalDot = BigNumber.sum(hydration.dot || 0);
  const totalUSDt = BigNumber.sum(hydration.usdt || 0);
  const totalUSDC = BigNumber.sum(hydration.usdc || 0);

  const total = BigNumber.sum(
    toPrecision(BigNumber(totalDot).multipliedBy(dotPrice), polkadot.decimals),
    toPrecision(totalUSDt, USDt.decimals),
    toPrecision(totalUSDC, USDC.decimals),
  ).toString();

  const isLoading = hydration.isLoading;

  return (
    <Wrapper>
      <div>
        <Title>Total Treasury</Title>
        <TotalPrice>
          {isLoading ? (
            <SkeletonBar width={120} height={36} />
          ) : (
            <ValueDisplay value={total} precision={0} />
          )}
        </TotalPrice>
      </div>

      <TokenGroup>
        <TokenItem
          isLoading={isLoading}
          totalValue={totalDot}
          precision={polkadot.decimals}
          symbol={polkadot.symbol}
        />
        <TokenItem
          isLoading={isLoading}
          totalValue={totalUSDt}
          precision={USDt.decimals}
          symbol={USDt.symbol}
        />
        <TokenItem
          isLoading={isLoading}
          totalValue={totalUSDC}
          precision={USDC.decimals}
          symbol={USDC.symbol}
        />
        {/* TODO */}
        <TokenItem
          isLoading={isLoading}
          totalValue={0}
          precision={0}
          symbol="MYTH"
        />
      </TokenGroup>
    </Wrapper>
  );
}
