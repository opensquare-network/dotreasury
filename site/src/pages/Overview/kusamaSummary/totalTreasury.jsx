import styled from "styled-components";
import {
  h4_16_semibold,
  p_14_medium,
  p_14_semibold,
} from "../../../styles/text";
import { text_primary } from "../../../styles/tailwindcss";
import { kusama } from "../../../utils/chains/kusama";
import ValueDisplay from "../../../components/ValueDisplay";
import SkeletonBar from "../../../components/skeleton/bar";
import Tooltip from "../../../components/Tooltip";
import { useKusamaTreasuryData } from "../../../context/KusamaTreasury";

const Wrapper = styled.div`
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
  margin-top: 12px;
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
  const { totalKsmValue, totalKsmFiatValue, isTotalKsmLoading } =
    useKusamaTreasuryData();

  return (
    <Wrapper>
      <div style={{ padding: "0 12px" }}>
        <Title>Total Treasury</Title>
        <TotalPrice>
          {isTotalKsmLoading ? (
            <SkeletonBar width={120} height={36} />
          ) : (
            <ValueDisplay value={totalKsmFiatValue} prefix="$" />
          )}
        </TotalPrice>
      </div>

      <TokenGroup>
        <Tooltip
          tooltipContent={
            !isTotalKsmLoading && (
              <ValueDisplay value={totalKsmValue} prefix="$" />
            )
          }
        >
          <TokenItem
            icon="asset-ksm.svg"
            isLoading={isTotalKsmLoading}
            totalValue={totalKsmValue}
            precision={kusama.decimals}
            symbol={kusama.symbol}
          />
        </Tooltip>
      </TokenGroup>
    </Wrapper>
  );
}
