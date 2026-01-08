import { Link as LinkOrigin } from "react-router-dom";
import TreasuryDetailItem from "./common/item";
import ValueDisplay from "../../../../components/ValueDisplay";
import styled from "styled-components";
import AssetWrapper from "./common/assetWrapper";
import AssetValueDisplay from "./common/assetValueDisplay";
import { toPrecision } from "../../../../utils";
import BigNumber from "bignumber.js";
import { polkadot } from "../../../../utils/chains/polkadot";
import { usePolkadotTreasuryData } from "../../../../context/PolkadotTreasury";
import useFiatPrice from "../../../../hooks/useFiatPrice";
import { ExternalLink } from "./common/assetItem";

const Link = styled(LinkOrigin)`
  color: var(--textSecondary);
  &:hover {
    color: var(--textSecondary);
    text-decoration: underline;
  }
`;

export default function TreasuryDetailBounties() {
  const { bountiesTotalBalance, bountiesCount, isBountiesTotalBalanceLoading } =
    usePolkadotTreasuryData();
  const { price: dotPrice } = useFiatPrice();

  const totalValue = toPrecision(
    BigNumber(bountiesTotalBalance).multipliedBy(dotPrice),
    polkadot.decimals,
  );

  return (
    <TreasuryDetailItem
      title={
        <>
          <ExternalLink
            href="https://polkadot.subsquare.io/treasury/bounties"
            externalIcon
            externalIconColor="textSecondary"
          >
            Bounties
          </ExternalLink>
          · {bountiesCount}
        </>
      }
      iconSrc="/imgs/data-bounties.svg"
      content={<ValueDisplay value={totalValue} prefix="$" />}
      isLoading={isBountiesTotalBalanceLoading}
      footer={
        <AssetWrapper>
          <AssetValueDisplay
            symbol="dot"
            value={bountiesTotalBalance}
            precision={polkadot.decimals}
            isLoading={isBountiesTotalBalanceLoading}
            valueTooltipContent={
              <ValueDisplay abbreviate={false} value={totalValue} prefix="$" />
            }
          />
        </AssetWrapper>
      }
    />
  );
}
