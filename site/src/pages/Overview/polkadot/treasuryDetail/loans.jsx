import BigNumber from "bignumber.js";
import ValueDisplay from "../../../../components/ValueDisplay";
import {
  useLoansBifrostDotBalance,
  useLoansCentrifugeUsdcBalance,
  useLoansPendulumDotBalance,
} from "../../../../hooks/treasury/useLoansBalances";
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

const AssetGroup = styled.div`
  ${space_y(8)}
`;

export default function TreasuryDetailLoans() {
  const overview = useSelector(overviewSelector);
  const dotPrice = overview?.latestSymbolPrice ?? 0;

  const bifrost = useLoansBifrostDotBalance();
  const totalBifrostValue = BigNumber(
    toPrecision(bifrost.balance, polkadot.decimals),
  ).multipliedBy(dotPrice);
  const pendulum = useLoansPendulumDotBalance();
  const totalPendulumValue = BigNumber(
    toPrecision(pendulum.balance, polkadot.decimals),
  ).multipliedBy(dotPrice);
  const centrifuge = useLoansCentrifugeUsdcBalance();

  const isLoading =
    bifrost.isLoading || pendulum.isLoading || centrifuge.isLoading;

  const total = BigNumber.sum(
    totalBifrostValue,
    totalPendulumValue,
    toPrecision(centrifuge.balance, USDt.decimals),
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
              value={centrifuge.balance}
              precision={USDt.decimals}
              isLoading={centrifuge.isLoading}
            />
          </AssetItem>
          <AssetItem
            title="Bifrost"
            titleLink="https://polkadot.subsquare.io/referenda/432"
          >
            <AssetValueDisplay
              symbol="dot"
              value={bifrost.balance}
              precision={polkadot.decimals}
              isLoading={bifrost.isLoading}
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
              value={pendulum.balance}
              precision={polkadot.decimals}
              isLoading={pendulum.isLoading}
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
