import styled from "styled-components";
import ValueDisplay from "../../../../components/ValueDisplay";
import { space_x } from "../../../../styles/tailwindcss";
import TreasuryDetailItem from "./common/item";
import { ASSET_HUB_ACCOUNT } from "../../../../constants/assetHub";
import AssetValueDisplay from "./common/assetValueDisplay";
import AssetWrapper from "./common/assetWrapper";
import { polkadot } from "../../../../utils/chains/polkadot";
import BigNumber from "bignumber.js";
import { toPrecision } from "../../../../utils";
import { USDt } from "../../../../utils/chains/usdt";
import { USDC } from "../../../../utils/chains/usdc";
import { usePolkadotTreasuryData } from "../../../../context/PolkadotTreasury";
import useFiatPrice from "../../../../hooks/useFiatPrice";
import ExplorerLinkOrigin from "../../../../components/ExplorerLink";
import { p_12_medium } from "../../../../styles/text";

const AddressGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  ${space_x(8)}
`;

const ExplorerLink = styled(ExplorerLinkOrigin)`
  color: var(--textSecondary);
  ${p_12_medium}

  &:hover {
    color: var(--textSecondary);
    text-decoration: underline;
  }
`;

const Label = styled.span`
  color: var(--textSecondary);
  ${p_12_medium};
`;

function AddressLink({ content, address }) {
  return (
    <ExplorerLink
      base="https://assethub-polkadot.subscan.io/"
      href={`account/${address}`}
      externalIconColor="textSecondary"
      externalIcon
      externalIconSize={20}
    >
      {content}
    </ExplorerLink>
  );
}

export default function TreasuryDetailAssets() {
  const {
    relayChainFreeBalance,
    isRelayChainFreeLoading,
    usdcBalanceOnRelayChain,
    usdtBalanceOnRelayChain,
    isUsdcBalanceLoadingOnRelayChain,
    isUsdtBalanceLoadingOnRelayChain,
    assetHubDotBalance,
    isAssetHubDotLoading,
    assetHubUSDtBalance,
    isAssetHubUSDtLoading,
    assetHubUSDCBalance,
    isAssetHubUSDCLoading,
  } = usePolkadotTreasuryData();
  const { price: dotPrice } = useFiatPrice();

  const totalDotBalance = BigNumber.sum(
    relayChainFreeBalance || 0,
    assetHubDotBalance || 0,
  ).toString();
  const totalDotValue = BigNumber(
    toPrecision(totalDotBalance, polkadot.decimals),
  ).multipliedBy(dotPrice);

  const totalUSDtBalance = BigNumber.sum(
    usdtBalanceOnRelayChain || 0,
    assetHubUSDtBalance || 0,
  ).toString();

  const totalUSDCBalance = BigNumber.sum(
    usdcBalanceOnRelayChain || 0,
    assetHubUSDCBalance || 0,
  ).toString();

  const total = BigNumber.sum(
    totalDotValue,
    toPrecision(totalUSDtBalance, USDt.decimals),
    toPrecision(totalUSDCBalance, USDC.decimals),
  ).toString();

  const isLoading =
    isRelayChainFreeLoading ||
    isAssetHubDotLoading ||
    isUsdtBalanceLoadingOnRelayChain ||
    isAssetHubUSDtLoading ||
    isUsdcBalanceLoadingOnRelayChain ||
    isAssetHubUSDCLoading;

  return (
    <TreasuryDetailItem
      title="Assets"
      titleTooltipContent="Funds on relay chain and Asset Hub"
      iconSrc="/imgs/data-asset-1.svg"
      content={<ValueDisplay value={total} prefix="$" />}
      isLoading={isLoading}
      footer={
        <AssetWrapper>
          <AddressGroup>
            <Label>Address</Label>
            <AddressLink
              content="#1"
              address="13UVJyLnbVp9RBZYFwFGyDvVd1y27Tt8tkntv6Q7JVPhFsTB"
            />
            <AddressLink content="#2" address={ASSET_HUB_ACCOUNT} />
          </AddressGroup>

          <AssetValueDisplay
            symbol="dot"
            value={totalDotBalance}
            precision={polkadot.decimals}
            isLoading={isRelayChainFreeLoading || isAssetHubDotLoading}
            valueTooltipContent={
              <ValueDisplay
                abbreviate={false}
                value={totalDotValue}
                prefix="$"
              />
            }
          />
          <AssetValueDisplay
            symbol="usdt"
            value={totalUSDtBalance}
            precision={USDt.decimals}
            isLoading={
              isUsdtBalanceLoadingOnRelayChain || isAssetHubUSDtLoading
            }
          />
          <AssetValueDisplay
            symbol="usdc"
            value={totalUSDCBalance}
            precision={USDC.decimals}
            isLoading={
              isUsdcBalanceLoadingOnRelayChain || isAssetHubUSDCLoading
            }
          />
        </AssetWrapper>
      }
    />
  );
}
