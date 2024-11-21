import BigNumber from "bignumber.js";
import useQueryFellowshipSalaryBalance from "../../../../hooks/treasury/useQueryFellowshipSalaryBalance";
import TreasuryDetailItem from "./common/item";
import { toPrecision } from "../../../../utils";
import { USDt } from "../../../../utils/chains/usdt";
import ValueDisplay from "../../../../components/ValueDisplay";
import styled from "styled-components";
import { space_y } from "../../../../styles/tailwindcss";
import {
  STATEMINT_FELLOWSHIP_SALARY_ACCOUNT,
  STATEMINT_FELLOWSHIP_TREASURY_ACCOUNT,
} from "../../../../constants/statemint";
import AssetValueDisplay from "./common/assetValueDisplay";
import { useQueryAssetHubTreasuryFree } from "../../../../hooks/treasury/useQueryAssetHubTreasuryFree";
import { overviewSelector } from "../../../../store/reducers/overviewSlice";
import { useSelector } from "react-redux";
import { currentChainSettings } from "../../../../utils/chains";
import AssetItem from "./common/assetItem";
import { polkadot } from "../../../../utils/chains/polkadot";

const AssetGroup = styled.div`
  ${space_y(8)}
`;

export default function TreasuryDetailFellowship() {
  const overview = useSelector(overviewSelector);
  const dotPrice = overview?.latestSymbolPrice ?? 0;

  const usdt = useQueryFellowshipSalaryBalance("USDt");
  const treasury = useQueryAssetHubTreasuryFree(
    STATEMINT_FELLOWSHIP_TREASURY_ACCOUNT,
  );
  const totalTreasuryValue = BigNumber(
    toPrecision(treasury.balance, polkadot.decimals),
  ).multipliedBy(dotPrice);

  const total = BigNumber.sum(
    totalTreasuryValue,
    toPrecision(usdt.balance, USDt.decimals),
  ).toString();

  const isLoading = treasury.isLoading || usdt.isLoading;

  return (
    <TreasuryDetailItem
      title="Fellowship"
      iconSrc="/imgs/data-collectives.svg"
      content={<ValueDisplay value={total} prefix="$" />}
      isLoading={isLoading}
      footer={
        <AssetGroup>
          <AssetItem
            title="Treasury"
            titleLink={`https://assethub-polkadot.subscan.io/account/${STATEMINT_FELLOWSHIP_TREASURY_ACCOUNT}?tab=transfer`}
          >
            <AssetValueDisplay
              symbol="dot"
              value={treasury.balance}
              precision={currentChainSettings.decimals}
              isLoading={treasury.isLoading}
              valueTooltipContent={
                <ValueDisplay value={totalTreasuryValue} prefix="$" />
              }
            />
          </AssetItem>

          <AssetItem
            title="Salary"
            titleLink={`https://assethub-polkadot.subscan.io/account/${STATEMINT_FELLOWSHIP_SALARY_ACCOUNT}?tab=transfer`}
          >
            <AssetValueDisplay
              symbol="usdt"
              value={usdt.balance}
              precision={USDt.decimals}
              isLoading={usdt.isLoading}
            />
          </AssetItem>
        </AssetGroup>
      }
    />
  );
}
