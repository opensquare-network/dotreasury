import { useSelector } from "react-redux";
import {
  PolkadotTreasuryOnHydrationAccount1,
  PolkadotTreasuryOnHydrationAccount2,
  useHydrationTreasuryBalances,
} from "../../../../hooks/hydration/useHydrationTreasuryBalances";
import { polkadot } from "../../../../utils/chains/polkadot";
import AssetValueDisplay from "./common/assetValueDisplay";
import AssetWrapper from "./common/assetWrapper";
import TreasuryDetailItem from "./common/item";
import { overviewSelector } from "../../../../store/reducers/overviewSlice";
import BigNumber from "bignumber.js";
import { USDt } from "../../../../utils/chains/usdt";
import { USDC } from "../../../../utils/chains/usdc";
import { toPrecision } from "../../../../utils";
import ValueDisplay from "../../../../components/ValueDisplay";
import styled from "styled-components";
import ExplorerLinkOrigin from "../../../../components/ExplorerLink";
import { p_12_medium } from "../../../../styles/text";
import { space_x } from "../../../../styles/tailwindcss";

const AddressGroup = styled.div`
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

const EXPLORER_LINK_BASE = "https://hydration.subscan.io/";

export default function TreasuryDetailHydration() {
  const { usdc, usdt, dot } = useHydrationTreasuryBalances();
  const overview = useSelector(overviewSelector);
  const dotPrice = overview?.latestSymbolPrice ?? 0;

  const total = BigNumber.sum(
    toPrecision(BigNumber(dot).multipliedBy(dotPrice), polkadot.decimals),
    toPrecision(usdt, USDt.decimals),
    toPrecision(usdc, USDC.decimals),
  ).toString();

  return (
    <TreasuryDetailItem
      title="Hydration"
      titleTooltipContent="Treasury stablecoin acquisition"
      iconSrc="/imgs/data-hydration.svg"
      content={<ValueDisplay value={total} precision={0} />}
      footer={
        <AssetWrapper>
          <AddressGroup>
            <ExplorerLink
              base={EXPLORER_LINK_BASE}
              href={`account/${PolkadotTreasuryOnHydrationAccount1}`}
              externalIcon
              externalIconColor="textSecondary"
              externalIconSize={20}
            >
              Acquistion Addr #1
            </ExplorerLink>

            <ExplorerLink
              base={EXPLORER_LINK_BASE}
              href={`account/${PolkadotTreasuryOnHydrationAccount2}`}
              externalIconColor="textSecondary"
              externalIcon
              externalIconSize={20}
            >
              Acquistion Addr #2
            </ExplorerLink>
          </AddressGroup>

          <AssetValueDisplay
            symbol="dot"
            value={dot}
            precision={polkadot.decimals}
          />
          <AssetValueDisplay
            symbol="usdt"
            value={usdt}
            precision={USDt.decimals}
          />
          <AssetValueDisplay
            symbol="usdc"
            value={usdc}
            precision={USDC.decimals}
          />
        </AssetWrapper>
      }
    />
  );
}
