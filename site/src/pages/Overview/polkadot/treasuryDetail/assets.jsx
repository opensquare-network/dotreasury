import styled from "styled-components";
import ValueDisplay from "../../../../components/ValueDisplay";
import { space_y } from "../../../../styles/tailwindcss";
import TreasuryDetailItem from "./common/item";
import AssetItem from "./common/assetItem";
import {
  ASSET_HUB_ACCOUNT,
  ASSET_HUB_USDC_ASSET_ID,
  ASSET_HUB_USDT_ASSET_ID,
} from "../../../../constants/assetHub";
import AssetValueDisplay from "./common/assetValueDisplay";
import { polkadot } from "../../../../utils/chains/polkadot";
import BigNumber from "bignumber.js";
import { useSelector } from "react-redux";
import { overviewSelector } from "../../../../store/reducers/overviewSlice";
import { toPrecision } from "../../../../utils";
import { useAssetHubDot } from "../../../../hooks/assetHub/useAssetHubDot";
import { useAssetHubAsset } from "../../../../hooks/assetHub/useAssetHubAsset";
import { USDt } from "../../../../utils/chains/usdt";
import { USDC } from "../../../../utils/chains/usdc";
import useQueryRelayChainFree from "../../../../hooks/treasury/useQueryRelayChainFree";

const AssetGroup = styled.div`
  ${space_y(8)}
`;

export default function TreasuryDetailAssets() {
  const overview = useSelector(overviewSelector);
  const dotPrice = overview?.latestSymbolPrice ?? 0;

  const relayChainFree = useQueryRelayChainFree();
  const totalRelayChainFreeValue = BigNumber(
    toPrecision(relayChainFree.balance, polkadot.decimals),
  ).multipliedBy(dotPrice);
  const [dotValue, dotLoading] = useAssetHubDot();
  const totalDotValue = BigNumber(
    toPrecision(dotValue, polkadot.decimals),
  ).multipliedBy(dotPrice);
  const [usdtValue, usdtLoading] = useAssetHubAsset(ASSET_HUB_USDT_ASSET_ID);
  const [usdcValue, usdcLoading] = useAssetHubAsset(ASSET_HUB_USDC_ASSET_ID);

  const total = BigNumber.sum(
    totalRelayChainFreeValue,
    totalDotValue,
    toPrecision(usdtValue, USDt.decimals),
    toPrecision(usdcValue, USDC.decimals),
  ).toString();

  const isLoading =
    relayChainFree.isLoading || dotLoading || usdtLoading || usdcLoading;

  return (
    <TreasuryDetailItem
      title="Assets"
      titleTooltipContent="Funds on relay chain and Asset Hub"
      iconSrc="/imgs/data-asset-1.svg"
      content={<ValueDisplay value={total} prefix="$" />}
      isLoading={isLoading}
      footer={
        <AssetGroup>
          <AssetItem
            title="Main"
            titleLink="https://polkadot.subscan.io/account/13UVJyLnbVp9RBZYFwFGyDvVd1y27Tt8tkntv6Q7JVPhFsTB"
          >
            <AssetValueDisplay
              symbol="dot"
              value={relayChainFree.balance}
              precision={polkadot.decimals}
              isLoading={relayChainFree.isLoading}
              valueTooltipContent={
                <ValueDisplay value={totalRelayChainFreeValue} prefix="$" />
              }
            />
          </AssetItem>

          <AssetItem
            title="AssetHub"
            titleLink={`https://assethub-polkadot.subscan.io/account/${ASSET_HUB_ACCOUNT}`}
          >
            <AssetValueDisplay
              symbol="dot"
              value={dotValue}
              precision={polkadot.decimals}
              isLoading={dotLoading}
              valueTooltipContent={
                <ValueDisplay value={totalDotValue} prefix="$" />
              }
            />
            <AssetValueDisplay
              symbol="usdt"
              value={usdtValue}
              precision={USDt.decimals}
              isLoading={usdtLoading}
            />
            <AssetValueDisplay
              symbol="usdc"
              value={usdcValue}
              precision={USDC.decimals}
              isLoading={usdcLoading}
            />
          </AssetItem>
        </AssetGroup>
      }
    />
  );
}
