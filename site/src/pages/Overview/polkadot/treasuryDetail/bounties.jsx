import { Link as LinkOrigin } from "react-router-dom";
import { useBountiesData } from "../../../../hooks/bounties/useBountiesData";
import TreasuryDetailItem from "./common/item";
import { useBountiesTotalBalance } from "../../../../hooks/bounties/useBountiesBalances";
import ValueDisplay from "../../../../components/ValueDisplay";
import styled from "styled-components";
import AssetWrapper from "./common/assetWrapper";
import AssetValueDisplay from "./common/assetValueDisplay";
import { overviewSelector } from "../../../../store/reducers/overviewSlice";
import { useSelector } from "react-redux";
import { toPrecision } from "../../../../utils";
import BigNumber from "bignumber.js";
import { polkadot } from "../../../../utils/chains/polkadot";

const Link = styled(LinkOrigin)`
  color: var(--textSecondary);
  &:hover {
    color: var(--textSecondary);
    text-decoration: underline;
  }
`;

export default function TreasuryDetailBounties() {
  const { bounties, bountiesCount } = useBountiesData();
  const { balance, isLoading } = useBountiesTotalBalance(bounties);
  const overview = useSelector(overviewSelector);
  const dotPrice = overview?.latestSymbolPrice ?? 0;

  const totalValue = toPrecision(
    BigNumber(balance).multipliedBy(dotPrice),
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
      isLoading={isLoading}
      footer={
        <AssetWrapper>
          <AssetValueDisplay
            symbol="dot"
            value={balance}
            precision={polkadot.decimals}
            isLoading={isLoading}
            valueTooltipContent={<ValueDisplay value={totalValue} prefix="$" />}
          />
        </AssetWrapper>
      }
    />
  );
}
