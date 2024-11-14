import AssetValueDisplay from "./common/assetValueDisplay";
import AssetWrapper from "./common/assetWrapper";
import TreasuryDetailItem from "./common/item";
import BigNumber from "bignumber.js";
import { toPrecision } from "../../../../utils";
import ValueDisplay from "../../../../components/ValueDisplay";
import useAssetHubForeignAssets from "../../../../hooks/assetHub/useAssetHubForeignAssets";
import { MYTH } from "../../../../constants/foreignAssets";
import { MYTH_TOKEN_ACCOUNT } from "../../../../constants/foreignAssets";
import useFiatPrice from "../../../../hooks/useFiatPrice";

export default function TreasuryDetailMythToken() {
  const mythTokenAssetsBalance = useAssetHubForeignAssets(MYTH_TOKEN_ACCOUNT);
  const { price: mythTokenPrice, isLoading: isFiatPriceLoading } =
    useFiatPrice("mythos");

  const totalMythToken = mythTokenAssetsBalance.balance;

  const total = BigNumber.sum(
    BigNumber(toPrecision(totalMythToken, MYTH.decimals)).multipliedBy(
      mythTokenPrice,
    ),
  ).toString();

  const isLoading = isFiatPriceLoading || mythTokenAssetsBalance.isLoading;

  return (
    <TreasuryDetailItem
      title="Myth Token"
      titleTooltipContent="Airdrop & distribution of Myth tokens"
      iconSrc="/imgs/data-asset-myth.svg" // TODO
      content={<ValueDisplay value={total} precision={0} />}
      isLoading={isLoading}
      footer={
        <AssetWrapper>
          {/* TODO link */}
          <AssetValueDisplay
            value={totalMythToken}
            isLoading={isLoading}
            precision={MYTH.decimals}
            symbol={MYTH.symbol}
          />
        </AssetWrapper>
      }
    />
  );
}
