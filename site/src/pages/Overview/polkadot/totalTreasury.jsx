import styled from "styled-components";
import Card from "../../../components/Card";
import {
  h4_16_semibold,
  p_14_medium,
  p_14_semibold,
} from "../../../styles/text";
import { text_primary } from "../../../styles/tailwindcss";
import { polkadot } from "../../../utils/chains/polkadot";
import ValueDisplay from "../../../components/ValueDisplay";
import { USDt } from "../../../utils/chains/usdt";
import { USDC } from "../../../utils/chains/usdc";
import SkeletonBar from "../../../components/skeleton/bar";

import { MYTH } from "../../../constants/foreignAssets";
import Tooltip from "../../../components/Tooltip";
import TreasuryHistoryLineChart from "../../../components/TreasuryHistoryLineChart";
import { usePolkadotTreasuryData } from "../../../context/PolkadotTreasury";

const Wrapper = styled(Card)`
  padding: 24px;
  ${text_primary}
  display: flex;
  justify-content: space-between;
  @media screen and (max-width: 768px) {
    flex-wrap: wrap;
  }
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
      <div>
        <ValueDisplay value={totalValue} precision={precision} /> {symbol}
      </div>
    </Item>
  );
}

export default function OverviewTotalTreasury() {
  const {
    totalDotValue,
    isTotalDotLoading,
    totalDotFiatValue,
    totalUSDtValue,
    isTotalUSDtLoading,
    totalUSDCValue,
    isTotalUSDCLoading,
    mythTokenBalance,
    isMythTokenLoading,
    totalMythTokenFiatValue,
    totalFiatValue,
    isTotalLoading,
  } = usePolkadotTreasuryData();

  return (
    <Wrapper>
      <div>
        <div style={{ padding: "0 12px" }}>
          <Title>Total Treasury</Title>
          <TotalPrice>
            {isTotalLoading ? (
              <SkeletonBar width={120} height={36} />
            ) : (
              <ValueDisplay value={totalFiatValue} prefix="$" />
            )}
          </TotalPrice>
        </div>

        <TokenGroup>
          <Tooltip
            tooltipContent={
              !isTotalDotLoading && (
                <ValueDisplay value={totalDotFiatValue} prefix="$" />
              )
            }
          >
            <TokenItem
              icon="asset-dot.svg"
              isLoading={isTotalDotLoading}
              totalValue={totalDotValue}
              precision={polkadot.decimals}
              symbol={polkadot.symbol}
            />
          </Tooltip>
          <TokenItem
            icon="asset-usdt.svg"
            isLoading={isTotalUSDtLoading}
            totalValue={totalUSDtValue}
            symbol={USDt.symbol}
          />
          <TokenItem
            icon="asset-usdc.svg"
            isLoading={isTotalUSDCLoading}
            totalValue={totalUSDCValue}
            symbol={USDC.symbol}
          />
          <Tooltip
            tooltipContent={
              !isMythTokenLoading && (
                <ValueDisplay value={totalMythTokenFiatValue} prefix="$" />
              )
            }
          >
            <TokenItem
              icon="asset-myth.svg"
              isLoading={isMythTokenLoading}
              totalValue={mythTokenBalance}
              precision={MYTH.decimals}
              symbol={MYTH.symbol}
            />
          </Tooltip>
        </TokenGroup>
      </div>
      <TreasuryHistoryLineChart />
    </Wrapper>
  );
}
