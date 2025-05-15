import {
  PolkadotTreasuryOnHydrationAccount1,
  PolkadotTreasuryOnHydrationAccount2,
  PolkadotTreasuryOnHydrationAccount3,
  PolkadotTreasuryOnHydrationAccount4,
} from "../../../../hooks/hydration/useHydrationTreasuryBalances";
import { polkadot } from "../../../../utils/chains/polkadot";
import AssetValueDisplay from "./common/assetValueDisplay";
import AssetWrapper from "./common/assetWrapper";
import TreasuryDetailItem from "./common/item";
import BigNumber from "bignumber.js";
import { USDt } from "../../../../utils/chains/usdt";
import { USDC } from "../../../../utils/chains/usdc";
import { toPrecision } from "../../../../utils";
import ValueDisplay from "../../../../components/ValueDisplay";
import styled from "styled-components";
import ExplorerLinkOrigin from "../../../../components/ExplorerLink";
import { p_12_medium } from "../../../../styles/text";
import { space_x } from "../../../../styles/tailwindcss";
import { usePolkadotTreasuryData } from "../../../../context/PolkadotTreasury";
import useFiatPrice from "../../../../hooks/useFiatPrice";
import Tooltip from "../../../../components/Tooltip";

export const AddressGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  ${space_x(8)}
`;

export const ExplorerLink = styled(ExplorerLinkOrigin)`
  color: var(--textSecondary);
  ${p_12_medium}

  &:hover {
    color: var(--textSecondary);
    text-decoration: underline;
  }
`;

function AddressLinkTooltip({ address, index }) {
  return (
    <Tooltip
      key={index}
      tooltipContent={`Treasury stablecoin acquisition #${index}`}
    >
      <AddressLink content={`#${index}`} address={address} />
    </Tooltip>
  );
}

const Label = styled.span`
  color: var(--textSecondary);
  ${p_12_medium};
`;

export default function TreasuryDetailHydration() {
  const {
    hydrationDotBalance,
    hydrationUSDtBalance,
    hydrationUSDCBalance,
    isHydrationLoading,
  } = usePolkadotTreasuryData();
  const { price: dotPrice } = useFiatPrice();

  const totalDotValue = BigNumber(
    toPrecision(hydrationDotBalance, polkadot.decimals),
  ).multipliedBy(dotPrice);

  const total = BigNumber.sum(
    totalDotValue,
    toPrecision(hydrationUSDtBalance, USDt.decimals),
    toPrecision(hydrationUSDCBalance, USDC.decimals),
  ).toString();

  return (
    <TreasuryDetailItem
      title="Hydration"
      titleTooltipContent="Treasury stablecoin acquisition"
      iconSrc="/imgs/data-hydration.svg"
      content={<ValueDisplay value={total} prefix="$" />}
      isLoading={isHydrationLoading}
      footer={
        <AssetWrapper>
          <AddressGroup>
            <Label>Address</Label>
            <AddressLinkTooltip
              address={PolkadotTreasuryOnHydrationAccount1}
              index={1}
            />
            <AddressLinkTooltip
              address={PolkadotTreasuryOnHydrationAccount2}
              index={2}
            />
            <AddressLinkTooltip
              address={PolkadotTreasuryOnHydrationAccount3}
              index={3}
            />
            <AddressLinkTooltip
              address={PolkadotTreasuryOnHydrationAccount4}
              index={4}
            />
          </AddressGroup>

          <AssetValueDisplay
            symbol="dot"
            value={hydrationDotBalance}
            precision={polkadot.decimals}
            isLoading={isHydrationLoading}
            valueTooltipContent={
              <ValueDisplay value={totalDotValue} prefix="$" />
            }
          />
          <AssetValueDisplay
            symbol="usdt"
            value={hydrationUSDtBalance}
            precision={USDt.decimals}
            isLoading={isHydrationLoading}
          />
          <AssetValueDisplay
            symbol="usdc"
            value={hydrationUSDCBalance}
            precision={USDC.decimals}
            isLoading={isHydrationLoading}
          />
        </AssetWrapper>
      }
    />
  );
}

function AddressLink({ content, address }) {
  return (
    <ExplorerLink
      base="https://hydration.subscan.io/"
      href={`account/${address}`}
      externalIconColor="textSecondary"
      externalIcon
      externalIconSize={20}
    >
      {content}
    </ExplorerLink>
  );
}
