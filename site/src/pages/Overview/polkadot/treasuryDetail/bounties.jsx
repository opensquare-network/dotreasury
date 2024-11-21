import { Link as LinkOrigin } from "react-router-dom";
import TreasuryDetailItem from "./common/item";
import ValueDisplay from "../../../../components/ValueDisplay";
import styled from "styled-components";
import AssetWrapper from "./common/assetWrapper";
import AssetValueDisplay from "./common/assetValueDisplay";
import { overviewSelector } from "../../../../store/reducers/overviewSlice";
import { useSelector } from "react-redux";
import { toPrecision } from "../../../../utils";
import BigNumber from "bignumber.js";
import { polkadot } from "../../../../utils/chains/polkadot";
import { usePolkadotTreasuryData } from "../../../../context/PolkadotTreasury";

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
  const overview = useSelector(overviewSelector);
  const dotPrice = overview?.latestSymbolPrice ?? 0;

  const totalValue = toPrecision(
    BigNumber(bountiesTotalBalance).multipliedBy(dotPrice),
    polkadot.decimals,
  );

  return (
    <TreasuryDetailItem
      title={
        <>
          <Link to="/bounties">Bounties</Link> · {bountiesCount}
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
            valueTooltipContent={<ValueDisplay value={totalValue} prefix="$" />}
          />
        </AssetWrapper>
      }
    />
  );
}
