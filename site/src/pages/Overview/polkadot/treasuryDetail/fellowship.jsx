import BigNumber from "bignumber.js";
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
import { currentChainSettings } from "../../../../utils/chains";
import AssetItem from "./common/assetItem";
import { polkadot } from "../../../../utils/chains/polkadot";
import { usePolkadotTreasuryData } from "../../../../context/PolkadotTreasury";
import useFiatPrice from "../../../../hooks/useFiatPrice";

const AssetGroup = styled.div`
  ${space_y(8)}
`;

export default function TreasuryDetailFellowship() {
  const {
    fellowshipSalaryUSDtBalance,
    isFellowshipSalaryUSDtLoading,
    fellowshipTreasuryDotBalance,
    isFellowshipTreasuryDotLoading,
  } = usePolkadotTreasuryData();
  const { price: dotPrice } = useFiatPrice();

  const totalTreasuryValue = BigNumber(
    toPrecision(fellowshipTreasuryDotBalance, polkadot.decimals),
  ).multipliedBy(dotPrice);

  const total = BigNumber.sum(
    totalTreasuryValue,
    toPrecision(fellowshipSalaryUSDtBalance, USDt.decimals),
  ).toString();

  const isLoading =
    isFellowshipSalaryUSDtLoading || isFellowshipTreasuryDotLoading;

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
              value={fellowshipTreasuryDotBalance}
              precision={currentChainSettings.decimals}
              isLoading={isFellowshipTreasuryDotLoading}
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
              value={fellowshipSalaryUSDtBalance}
              precision={USDt.decimals}
              isLoading={isFellowshipSalaryUSDtLoading}
            />
          </AssetItem>
        </AssetGroup>
      }
    />
  );
}
