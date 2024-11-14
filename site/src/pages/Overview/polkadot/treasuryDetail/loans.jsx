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
  const bifrost = useLoansBifrostDotBalance();
  const pendulum = useLoansPendulumDotBalance();
  const centrifuge = useLoansCentrifugeUsdcBalance();

  const overview = useSelector(overviewSelector);
  const dotPrice = overview?.latestSymbolPrice ?? 0;

  const isLoading =
    bifrost.isLoading || pendulum.isLoading || centrifuge.isLoading;

  const total = BigNumber.sum(
    toPrecision(
      BigNumber(bifrost.balance).multipliedBy(dotPrice),
      polkadot.decimals,
    ),
    toPrecision(
      BigNumber(pendulum.balance).multipliedBy(dotPrice),
      polkadot.decimals,
    ),
    toPrecision(centrifuge.balance, USDt.decimals),
  ).toString();

  return (
    <TreasuryDetailItem
      title="Loans"
      titleTooltipContent="Loans receivable"
      iconSrc="/imgs/data-asset-2.svg"
      content={<ValueDisplay value={total} precision={0} />}
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
            />
          </AssetItem>
        </AssetGroup>
      }
    />
  );
}
