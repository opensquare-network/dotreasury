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
import AssetItem from "./common/assetItem";

export default function TreasuryDetailMythToken() {
  const mythTokenAssetsBalance = useAssetHubForeignAssets(MYTH_TOKEN_ACCOUNT);
  const { price: mythTokenPrice, isLoading: isFiatPriceLoading } =
    useFiatPrice("mythos");

  const mythTokenBalance = mythTokenAssetsBalance.balance;

  const totalValue = toPrecision(
    BigNumber(mythTokenBalance).multipliedBy(mythTokenPrice),
    MYTH.decimals,
  );

  const isLoading = isFiatPriceLoading || mythTokenAssetsBalance.isLoading;

  return (
    <TreasuryDetailItem
      title="Myth Token"
      titleTooltipContent="Airdrop & distribution of Myth tokens"
      iconSrc="/imgs/data-myth.svg"
      content={<ValueDisplay value={totalValue} prefix="$" />}
      isLoading={isLoading}
      footer={
        <AssetWrapper>
          <AssetItem
            title="Distribution Addr"
            titleLink={`https://assethub-polkadot.subscan.io/account/${MYTH_TOKEN_ACCOUNT}`}
          >
            <AssetValueDisplay
              value={mythTokenBalance}
              isLoading={isLoading}
              precision={MYTH.decimals}
              symbol={MYTH.symbol}
            />
          </AssetItem>
        </AssetWrapper>
      }
    />
  );
}
