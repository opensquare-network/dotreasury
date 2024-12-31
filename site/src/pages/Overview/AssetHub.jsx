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
import { useAssetHubAsset } from "../../hooks/assetHub/useAssetHubAsset";
import {
  ASSET_HUB_ACCOUNT_LINK,
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
import BigNumber from "bignumber.js";
import SkeletonBar from "../../components/skeleton/bar";
import { useMemo } from "react";
import useFiatPrice from "../../hooks/useFiatPrice";

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
    text-decoration: underline;
  }
`;

function TitleLink({ children, href, iconSize = 16 }) {
  return (
    <TitleLinkWrapper href={href}>
      {children}
      <IconMask
        src="/imgs/caret-up-right.svg"
        color="textTertiary"
        size={iconSize}
      />
    </TitleLinkWrapper>
  );
}

function SummarySkeletonTitle({ loading, children }) {
  if (loading) {
    return <SkeletonBar width={40} height={16} />;
  }

  return children;
}

function SummarySkeletonContent({ loading, children }) {
  if (loading) {
    return (
      <div style={{ padding: "6px 12px 6px 0px" }}>
        <SkeletonBar width={"100%"} height={16} />
      </div>
    );
  }

  return children;
}

export default function AssetHub() {
  const [dotValue, dotLoading] = useAssetHubDot();
  const [usdtValue, usdtLoading] = useAssetHubAsset(ASSET_HUB_USDT_ASSET_ID);
  const [usdcValue, usdcLoading] = useAssetHubAsset(ASSET_HUB_USDC_ASSET_ID);
  const { decimals, symbol } = currentChainSettings;
  const { price: symbolPrice } = useFiatPrice();

  const dotPriceValue = toPrecision(dotValue, decimals) * symbolPrice;
  const usdtPriceValue = toPrecision(usdtValue, USDt.decimals);
  const usdcPriceValue = toPrecision(usdcValue, USDC.decimals);

  const totalPriceValue = useMemo(
    () => BigNumber.sum(dotPriceValue, usdtPriceValue, usdcPriceValue),
    [dotPriceValue, usdtPriceValue, usdcPriceValue],
  );
  const totalLoading = dotLoading || usdtLoading || usdcLoading;

  const totalItem = (
    <SummaryItem
      icon={<ImageWithDark src="/imgs/data-fiat-money.svg" />}
      title={
        <SummarySkeletonTitle loading={totalLoading}>
          Total
        </SummarySkeletonTitle>
      }
      content={
        <SummarySkeletonContent loading={totalLoading}>
          <ValueWrapper>
            <TextBold>≈ ${abbreviateBigNumber(totalPriceValue)}</TextBold>
          </ValueWrapper>
        </SummarySkeletonContent>
      }
    />
  );

  const dotItem = (
    <SummaryItem
      icon={<ImageWithDark src="/imgs/data-asset-dot.svg" />}
      title={
        <SummarySkeletonTitle loading={dotLoading}>DOT</SummarySkeletonTitle>
      }
      content={
        <SummarySkeletonContent loading={dotLoading}>
          <div>
            <ValueWrapper>
              <TextBold>
                {abbreviateBigNumber(toPrecision(dotValue, decimals))}
              </TextBold>
              <TextAccessoryBold>{symbol}</TextAccessoryBold>
            </ValueWrapper>
            <ValueInfo>
              {!!dotValue && "≈ "}${abbreviateBigNumber(dotPriceValue)}
            </ValueInfo>
          </div>
        </SummarySkeletonContent>
      }
    />
  );

  const usdtItem = (
    <SummaryItem
      icon={<ImageWithDark src="/imgs/data-asset-usdt.svg" />}
      title={
        <SummarySkeletonTitle loading={usdtLoading}>
          <TitleLink href={"https://statemint.statescan.io/#/assets/1984"}>
            {USDt.symbol}
          </TitleLink>
        </SummarySkeletonTitle>
      }
      content={
        <SummarySkeletonContent loading={usdtLoading}>
          <div>
            <ValueWrapper>
              <TextBold>
                {abbreviateBigNumber(toPrecision(usdtValue, USDt.decimals))}
              </TextBold>
              <TextAccessoryBold>{USDt.symbol}</TextAccessoryBold>
            </ValueWrapper>
            <ValueInfo>
              {!!usdtValue && "≈ "}${abbreviateBigNumber(usdtPriceValue)}
            </ValueInfo>
          </div>
        </SummarySkeletonContent>
      }
    />
  );

  const usdcItem = (
    <SummaryItem
      icon={<ImageWithDark src="/imgs/data-asset-usdc.svg" />}
      title={
        <SummarySkeletonTitle loading={usdcLoading}>
          <TitleLink href={"https://statemint.statescan.io/#/assets/1337"}>
            {USDC.symbol}
          </TitleLink>
        </SummarySkeletonTitle>
      }
      content={
        <SummarySkeletonContent loading={usdcLoading}>
          <div>
            <ValueWrapper>
              <TextBold>
                {abbreviateBigNumber(toPrecision(usdcValue, USDC.decimals))}
              </TextBold>
              <TextAccessoryBold>{USDC.symbol}</TextAccessoryBold>
            </ValueWrapper>
            <ValueInfo>
              {!!usdcValue && "≈ "}${abbreviateBigNumber(usdcPriceValue)}
            </ValueInfo>
          </div>
        </SummarySkeletonContent>
      }
    />
  );

  const sortedItems = [totalItem, dotItem, usdtItem, usdcItem].map(
    (item, idx) => <Fragment key={idx}>{item}</Fragment>,
  );

  return (
    <Wrapper>
      <Title>
        <img src="/imgs/chains-assethub.svg" alt="" />
        <TitleLink href={ASSET_HUB_ACCOUNT_LINK} iconSize={24}>
          AssetHub
        </TitleLink>
      </Title>

      <SummaryWrapper>{sortedItems}</SummaryWrapper>
    </Wrapper>
  );
}
