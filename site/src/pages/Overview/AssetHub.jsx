import styled, { css } from "styled-components";
import Card from "../../components/Card";
import { h3_18_semibold, h4_16_semibold, p_12_normal } from "../../styles/text";
import {
  gap_x,
  gap_y,
  grid,
  grid_cols,
  p,
  rounded_none,
} from "../../styles/tailwindcss";
import { breakpoint, smcss, mdcss, lgcss } from "../../styles/responsive";
import SummaryItem from "../../components/Summary/Item";
import ImageWithDark from "../../components/ImageWithDark";
import { mrgap } from "../../styles";
import Text from "../../components/Text";
import TextMinor from "../../components/TextMinor";
import { abbreviateBigNumber, toPrecision } from "../../utils";
import { overviewSelector } from "../../store/reducers/overviewSlice";
import { useSelector } from "react-redux";
import { useAssetHubAsset } from "../../hooks/assetHub/useAssetHubAsset";
import {
  ASSET_HUB_USDC_ASSET_ID,
  ASSET_HUB_USDT_ASSET_ID,
} from "../../constants/assetHub";
import { useAssetHubDot } from "../../hooks/assetHub/useAssetHubDot";
import { currentChainSettings } from "../../utils/chains";
import ExternalLink from "../../components/ExternalLink";
import { USDC } from "../../utils/chains/usdc";
import IconMask from "../../components/Icon/Mask";
import { USDt } from "../../utils/chains/usdt";
import { Fragment } from "react";

const Wrapper = styled(Card)`
  margin-bottom: 16px;

  ${p(24)};
`;

const Title = styled.h4`
  ${h4_16_semibold};
  display: flex;
  column-gap: 8px;
  margin-bottom: 24px;
`;

const SummaryWrapper = styled.div`
  ${grid};
  ${gap_x(128)};
  ${gap_y(8)};
  ${grid_cols(4)};

  ${mdcss(grid_cols(3))};
  ${smcss(grid_cols(2))};
  ${lgcss(gap_x(16))};
  ${breakpoint(600, rounded_none)};
`;

const ValueWrapper = styled.div`
  display: flex;
  align-items: center;
  ${css`
    ${mrgap("4px")}
  `}
`;

const TextBold = styled(Text)`
  ${h3_18_semibold};
`;
const ValueInfo = styled(Text)`
  ${p_12_normal};
  color: var(--textTertiary);
`;
const TextAccessoryBold = styled(TextMinor)`
  ${h3_18_semibold};
  color: var(--textTertiary);
`;

const TitleLinkWrapper = styled(ExternalLink)`
  display: inline-flex;
  align-items: center;
  color: inherit;
  &:hover {
    color: inherit;
  }
`;

function TitleLink({ children, href }) {
  return (
    <TitleLinkWrapper href={href}>
      {children}
      <IconMask src="/imgs/caret-up-right.svg" color="textTertiary" size={16} />
    </TitleLinkWrapper>
  );
}

export default function AssetHub() {
  const overview = useSelector(overviewSelector);
  const dotValue = useAssetHubDot();
  const usdtValue = useAssetHubAsset(ASSET_HUB_USDT_ASSET_ID);
  const usdcValue = useAssetHubAsset(ASSET_HUB_USDC_ASSET_ID);
  const { decimals, symbol } = currentChainSettings;

  const symbolPrice = overview?.latestSymbolPrice ?? 0;

  const availableItem = (
    <SummaryItem
      icon={<ImageWithDark src="/imgs/data-fiat-money.svg" />}
      title="Available"
      content={
        <div>
          <ValueWrapper>
            <TextBold>{abbreviateBigNumber(1)}</TextBold>
            <TextAccessoryBold>{symbol}</TextAccessoryBold>
          </ValueWrapper>
          <ValueInfo>
            {!!1 && "≈ "}${abbreviateBigNumber(1 * symbolPrice)}
          </ValueInfo>
        </div>
      }
    />
  );

  const dotItem = (
    <SummaryItem
      icon={<ImageWithDark src="/imgs/data-asset-dot.svg" />}
      title="DOT"
      content={
        <div>
          <ValueWrapper>
            <TextBold>
              {abbreviateBigNumber(toPrecision(dotValue, decimals))}
            </TextBold>
            <TextAccessoryBold>{symbol}</TextAccessoryBold>
          </ValueWrapper>
          <ValueInfo>
            {!!dotValue && "≈ "}$
            {abbreviateBigNumber(toPrecision(dotValue, decimals) * symbolPrice)}
          </ValueInfo>
        </div>
      }
    />
  );

  const usdcItem = (
    <SummaryItem
      icon={<ImageWithDark src="/imgs/data-asset-usdc.svg" />}
      title={
        <TitleLink href={"https://statemint.statescan.io/#/assets/1337"}>
          {USDC.symbol}
        </TitleLink>
      }
      content={
        <div>
          <ValueWrapper>
            <TextBold>
              {abbreviateBigNumber(toPrecision(usdcValue, USDC.decimals))}
            </TextBold>
            <TextAccessoryBold>{USDC.symbol}</TextAccessoryBold>
          </ValueWrapper>
          <ValueInfo>
            {!!usdcValue && "≈ "}$
            {abbreviateBigNumber(toPrecision(usdcValue, USDC.decimals))}
          </ValueInfo>
        </div>
      }
    />
  );

  const usdtItem = (
    <SummaryItem
      icon={<ImageWithDark src="/imgs/data-asset-usdt.svg" />}
      title={
        <TitleLink href={"https://statemint.statescan.io/#/assets/1984"}>
          {USDt.symbol}
        </TitleLink>
      }
      content={
        <div>
          <ValueWrapper>
            <TextBold>
              {abbreviateBigNumber(toPrecision(usdtValue, USDt.decimals))}
            </TextBold>
            <TextAccessoryBold>{USDt.symbol}</TextAccessoryBold>
          </ValueWrapper>
          <ValueInfo>
            {!!usdtValue && "≈ "}$
            {abbreviateBigNumber(toPrecision(usdtValue, USDt.decimals))}
          </ValueInfo>
        </div>
      }
    />
  );

  const sortedItems = [availableItem, dotItem, usdcItem, usdtItem].map(
    (item, idx) => <Fragment key={idx}>{item}</Fragment>,
  );

  return (
    <Wrapper>
      <Title>
        <img src="/imgs/chains-assethub.svg" alt="" />
        AssetHub
      </Title>

      <SummaryWrapper>{sortedItems}</SummaryWrapper>
    </Wrapper>
  );
}
