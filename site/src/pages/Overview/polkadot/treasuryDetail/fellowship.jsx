import BigNumber from "bignumber.js";
import useQueryFellowshipSalaryBalance from "../../../../hooks/treasury/useQueryFellowshipSalaryBalance";
import TreasuryDetailItem from "./common/item";
import { toPrecision } from "../../../../utils";
import { USDt } from "../../../../utils/chains/usdt";
import ValueDisplay from "../../../../components/ValueDisplay";
import styled from "styled-components";
import { space_y } from "../../../../styles/tailwindcss";
import AssetWrapper from "./common/assetWrapper";
import ExternalLinkOrigin from "../../../../components/ExternalLink";
import {
  STATEMINT_FELLOWSHIP_SALARY_ACCOUNT,
  STATEMINT_FELLOWSHIP_TREASURY_ACCOUNT,
} from "../../../../constants/statemint";
import AssetValueDisplay from "./common/assetValueDisplay";
import { p_12_medium } from "../../../../styles/text";
import { useQueryAssetHubTreasuryFree } from "../../../../hooks/treasury/useQueryAssetHubTreasuryFree";
import { overviewSelector } from "../../../../store/reducers/overviewSlice";
import { useSelector } from "react-redux";
import { currentChainSettings } from "../../../../utils/chains";

const ExternalLink = styled(ExternalLinkOrigin)`
  ${p_12_medium}
  color: var(--textSecondary);
  &:hover {
    color: var(--textSecondary);
    text-decoration: underline;
  }
`;

const AssetGroup = styled.div`
  ${space_y(8)}
`;

export default function TreasuryDetailFellowship() {
  const usdt = useQueryFellowshipSalaryBalance("USDt");
  const treasury = useQueryAssetHubTreasuryFree(
    STATEMINT_FELLOWSHIP_TREASURY_ACCOUNT,
  );
  const overview = useSelector(overviewSelector);
  const dotPrice = overview?.latestSymbolPrice ?? 0;

  const total = BigNumber.sum(
    toPrecision(
      BigNumber(treasury.balance).multipliedBy(dotPrice),
      currentChainSettings.decimals,
    ),
    toPrecision(usdt.balance, USDt.decimals),
  ).toString();

  const isLoading = treasury.isLoading || usdt.isLoading;

  return (
    <TreasuryDetailItem
      title="Fellowship"
      titleTooltipContent="Fellowship spending account & salary treasury"
      iconSrc="/imgs/data-collectives.svg"
      content={<ValueDisplay value={total} precision={0} />}
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

function AssetItem({ title, titleLink, children }) {
  return (
    <AssetWrapper>
      <ExternalLink style={{ marginBottom: 8 }} href={titleLink} externalIcon>
        {title}
      </ExternalLink>

      {children}
    </AssetWrapper>
  );
}
