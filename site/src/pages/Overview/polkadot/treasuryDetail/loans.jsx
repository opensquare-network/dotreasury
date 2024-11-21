import BigNumber from "bignumber.js";
import ValueDisplay from "../../../../components/ValueDisplay";

import { toPrecision } from "../../../../utils";
import TreasuryDetailItem from "./common/item";
import { polkadot } from "../../../../utils/chains/polkadot";
import { USDt } from "../../../../utils/chains/usdt";
import { useSelector } from "react-redux";
import { overviewSelector } from "../../../../store/reducers/overviewSlice";
import { space_y } from "../../../../styles/tailwindcss";
import styled from "styled-components";
import AssetValueDisplay from "./common/assetValueDisplay";
import AssetItem from "./common/assetItem";
import { usePolkadotTreasuryData } from "../../../../context/PolkadotTreasury";

const AssetGroup = styled.div`
  ${space_y(8)}
`;

export default function TreasuryDetailLoans() {
  const {
    loansCentrifugeUSDCBalance,
    isLoansCentrifugeUSDCLoading,
    loansBifrostDotBalance,
    isLoansBifrostDotLoading,
    loansPendulumDotBalance,
    isLoansPendulumDotLoading,
  } = usePolkadotTreasuryData();
  const overview = useSelector(overviewSelector);
  const dotPrice = overview?.latestSymbolPrice ?? 0;

  const totalBifrostValue = BigNumber(
    toPrecision(loansBifrostDotBalance, polkadot.decimals),
  ).multipliedBy(dotPrice);
  const totalPendulumValue = BigNumber(
    toPrecision(loansPendulumDotBalance, polkadot.decimals),
  ).multipliedBy(dotPrice);

  const isLoading =
    isLoansBifrostDotLoading ||
    isLoansPendulumDotLoading ||
    isLoansCentrifugeUSDCLoading;

  const total = BigNumber.sum(
    totalBifrostValue,
    totalPendulumValue,
    toPrecision(loansCentrifugeUSDCBalance, USDt.decimals),
  ).toString();

  return (
    <TreasuryDetailItem
      title="Loans"
      titleTooltipContent="Loans to ecosystem projects"
      iconSrc="/imgs/data-asset-2.svg"
      content={<ValueDisplay value={total} prefix="$" />}
      isLoading={isLoading}
      footer={
        <AssetGroup>
          <AssetItem
            title="Centrifuge"
            titleLink="https://polkadot.subsquare.io/referenda/1122"
          >
            <AssetValueDisplay
              symbol="usdc"
              value={loansCentrifugeUSDCBalance}
              precision={USDt.decimals}
              isLoading={isLoansCentrifugeUSDCLoading}
            />
          </AssetItem>
          <AssetItem
            title="Bifrost"
            titleLink="https://polkadot.subsquare.io/referenda/432"
          >
            <AssetValueDisplay
              symbol="dot"
              value={loansBifrostDotBalance}
              precision={polkadot.decimals}
              isLoading={isLoansBifrostDotLoading}
              valueTooltipContent={
                <ValueDisplay value={totalBifrostValue} prefix="$" />
              }
            />
          </AssetItem>
          <AssetItem
            title="Pendulum"
            titleLink="https://polkadot.subsquare.io/referenda/748"
          >
            <AssetValueDisplay
              symbol="dot"
              value={loansPendulumDotBalance}
              precision={polkadot.decimals}
              isLoading={isLoansPendulumDotLoading}
              valueTooltipContent={
                <ValueDisplay value={totalPendulumValue} prefix="$" />
              }
            />
          </AssetItem>
        </AssetGroup>
      }
    />
  );
}
