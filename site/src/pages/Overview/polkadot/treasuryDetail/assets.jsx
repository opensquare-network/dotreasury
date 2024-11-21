import styled from "styled-components";
import ValueDisplay from "../../../../components/ValueDisplay";
import { space_y } from "../../../../styles/tailwindcss";
import TreasuryDetailItem from "./common/item";
import AssetItem from "./common/assetItem";
import { ASSET_HUB_ACCOUNT } from "../../../../constants/assetHub";
import AssetValueDisplay from "./common/assetValueDisplay";
import { polkadot } from "../../../../utils/chains/polkadot";
import BigNumber from "bignumber.js";
import { useSelector } from "react-redux";
import { overviewSelector } from "../../../../store/reducers/overviewSlice";
import { toPrecision } from "../../../../utils";
import { USDt } from "../../../../utils/chains/usdt";
import { USDC } from "../../../../utils/chains/usdc";
import { usePolkadotTreasuryData } from "../../../../context/PolkadotTreasury";

const AssetGroup = styled.div`
  ${space_y(8)}
`;

export default function TreasuryDetailAssets() {
  const {
    relayChainFreeBalance,
    isRelayChainFreeLoading,
    assetHubDotBalance,
    isAssetHubDotLoading,
    assetHubUSDtBalance,
    isAssetHubUSDtLoading,
    assetHubUSDCBalance,
    isAssetHubUSDCLoading,
  } = usePolkadotTreasuryData();
  const overview = useSelector(overviewSelector);
  const dotPrice = overview?.latestSymbolPrice ?? 0;

  const totalRelayChainFreeValue = BigNumber(
    toPrecision(relayChainFreeBalance, polkadot.decimals),
  ).multipliedBy(dotPrice);
  const totalDotValue = BigNumber(
    toPrecision(assetHubDotBalance, polkadot.decimals),
  ).multipliedBy(dotPrice);

  const total = BigNumber.sum(
    totalRelayChainFreeValue,
    totalDotValue,
    toPrecision(assetHubUSDtBalance, USDt.decimals),
    toPrecision(assetHubUSDCBalance, USDC.decimals),
  ).toString();

  const isLoading =
    isRelayChainFreeLoading ||
    isAssetHubDotLoading ||
    isAssetHubUSDtLoading ||
    isAssetHubUSDCLoading;

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
              value={relayChainFreeBalance}
              precision={polkadot.decimals}
              isLoading={isRelayChainFreeLoading}
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
              value={assetHubDotBalance}
              precision={polkadot.decimals}
              isLoading={isAssetHubDotLoading}
              valueTooltipContent={
                <ValueDisplay value={totalDotValue} prefix="$" />
              }
            />
            <AssetValueDisplay
              symbol="usdt"
              value={assetHubUSDtBalance}
              precision={USDt.decimals}
              isLoading={isAssetHubUSDtLoading}
            />
            <AssetValueDisplay
              symbol="usdc"
              value={assetHubUSDCBalance}
              precision={USDC.decimals}
              isLoading={isAssetHubUSDCLoading}
            />
          </AssetItem>
        </AssetGroup>
      }
    />
  );
}
