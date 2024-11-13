import { Link as LinkOrigin } from "react-router-dom";
import { useBountiesData } from "../../../../hooks/bounties/useBountiesData";
import TreasuryDetailItem from "./common/item";
import { useBountiesTotalBalance } from "../../../../hooks/bounties/useBountiesBalances";
import ValueDisplay from "../../../../components/ValueDisplay";
import { currentChainSettings } from "../../../../utils/chains";
import styled from "styled-components";
import AssetWrapper from "./common/assetWrapper";
import AssetValueDisplay from "./common/assetValueDisplay";
import { overviewSelector } from "../../../../store/reducers/overviewSlice";
import { useSelector } from "react-redux";
import { toPrecision } from "../../../../utils";
import BigNumber from "bignumber.js";
import SkeletonBar from "../../../../components/skeleton/bar";

const Link = styled(LinkOrigin)`
  color: var(--textSecondary);
  &:hover {
    color: var(--textSecondary);
    text-decoration: underline;
  }
`;

// TODO: overview, loading effects
export default function TreasuryDetailBounties() {
  const { bounties, bountiesCount } = useBountiesData();
  const { balance, isLoading } = useBountiesTotalBalance(bounties);
  const overview = useSelector(overviewSelector);
  const dotPrice = overview?.latestSymbolPrice ?? 0;

  const total = toPrecision(
    BigNumber(balance).multipliedBy(dotPrice),
    currentChainSettings.decimals,
  );

  return (
    <TreasuryDetailItem
      title={
        <>
          <Link to="/bounties">Bounties</Link> · {bountiesCount}
        </>
      }
      titleTooltipContent="Funds for bounty programs"
      iconSrc="/imgs/data-bounties.svg"
      content={
        isLoading ? (
          <SkeletonBar width={64} height={28} />
        ) : (
          <ValueDisplay value={total} precision={0} />
        )
      }
      footer={
        <AssetWrapper>
          <AssetValueDisplay
            symbol="dot"
            value={balance}
            precision={currentChainSettings.decimals}
          />
        </AssetWrapper>
      }
    />
  );
}
