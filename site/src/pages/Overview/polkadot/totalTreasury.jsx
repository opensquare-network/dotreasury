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
import { useBountiesTotalBalance } from "../../../hooks/bounties/useBountiesBalances";
import { useBountiesData } from "../../../hooks/bounties/useBountiesData";
import { useQueryAssetHubTreasuryFree } from "../../../hooks/treasury/useQueryAssetHubTreasuryFree";
import useQueryFellowshipSalaryBalance from "../../../hooks/treasury/useTreasuryFree";
import { STATEMINT_FELLOWSHIP_TREASURY_ACCOUNT } from "../../../constants/statemint";

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
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  ${p_14_medium}
  background-color: var(--neutral200);
  border-radius: 4px;
`;

function TokenItem({ icon, isLoading, totalValue, precision, symbol }) {
  if (isLoading) {
    return <SkeletonBar width={117} height={44} />;
  }

  return (
    <Item>
      <img src={`/imgs/${icon}`} alt={symbol} />
      <ValueDisplay value={totalValue} precision={precision} /> {symbol}
    </Item>
  );
}

export default function OverviewTotalTreasury() {
  const overview = useSelector(overviewSelector);
  const hydration = useHydrationTreasuryBalances();
  const { bounties } = useBountiesData();
  const bountiesTotalBalance = useBountiesTotalBalance(bounties);
  const {
    balance: fellowshipSalaryUsdtBalance,
    // isLoading: isFellowshipSalaryUsdtBalanceLoading,
  } = useQueryFellowshipSalaryBalance("USDt");

  const {
    balance: fellowshipTreasuryDotBalance,
    // isLoading: isFellowshipTreasuryDotBalanceLoading,
  } = useQueryAssetHubTreasuryFree(STATEMINT_FELLOWSHIP_TREASURY_ACCOUNT);

  const dotPrice = overview?.latestSymbolPrice ?? 0;

  const totalDot = BigNumber.sum(
    hydration.dot || 0,
    bountiesTotalBalance.balance || 0,
    fellowshipTreasuryDotBalance || 0,
  );
  const totalUSDt = BigNumber.sum(
    hydration.usdt || 0,
    fellowshipSalaryUsdtBalance || 0,
  );
  const totalUSDC = BigNumber.sum(hydration.usdc || 0);

  const total = BigNumber.sum(
    toPrecision(BigNumber(totalDot).multipliedBy(dotPrice), polkadot.decimals),
    toPrecision(totalUSDt, USDt.decimals),
    toPrecision(totalUSDC, USDC.decimals),
  ).toString();

  const isLoading = hydration.isLoading || bountiesTotalBalance.isLoading;

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
          icon="asset-dot.svg"
          isLoading={isLoading}
          totalValue={totalDot}
          precision={polkadot.decimals}
          symbol={polkadot.symbol}
        />
        <TokenItem
          icon="asset-usdt.svg"
          isLoading={isLoading}
          totalValue={totalUSDt}
          precision={USDt.decimals}
          symbol={USDt.symbol}
        />
        <TokenItem
          icon="asset-usdc.svg"
          isLoading={isLoading}
          totalValue={totalUSDC}
          precision={USDC.decimals}
          symbol={USDC.symbol}
        />
        {/* TODO */}
        <TokenItem
          icon="asset-myth.svg"
          isLoading={isLoading}
          totalValue={0}
          precision={0}
          symbol="MYTH"
        />
      </TokenGroup>
    </Wrapper>
  );
}
