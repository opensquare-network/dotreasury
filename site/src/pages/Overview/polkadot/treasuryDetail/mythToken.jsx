import AssetValueDisplay from "./common/assetValueDisplay";
import TreasuryDetailItem from "./common/item";
import BigNumber from "bignumber.js";
import { toPrecision } from "../../../../utils";
import ValueDisplay from "../../../../components/ValueDisplay";
import { MYTH } from "../../../../constants/foreignAssets";
import { MYTH_TOKEN_ACCOUNT } from "../../../../constants/foreignAssets";
import { useFiatPriceBySymbol } from "../../../../hooks/useFiatPrice";
import AssetWrapper from "./common/assetWrapper";
import { ExplorerLink, AddressGroup } from "./hydration";
import { usePolkadotTreasuryData } from "../../../../context/PolkadotTreasury";

function AddressLink({ title, address, base }) {
  return (
    <ExplorerLink
      base={base}
      href={address}
      externalIconColor="textSecondary"
      externalIcon
      externalIconSize={20}
    >
      {title}
    </ExplorerLink>
  );
}

export default function TreasuryDetailMythToken() {
  const { mythTokenBalance, isMythTokenLoading } = usePolkadotTreasuryData();
  const { price: mythTokenPrice, isLoading: isFiatPriceLoading } =
    useFiatPriceBySymbol("MYTH");

  const totalValue = toPrecision(
    BigNumber(mythTokenBalance).multipliedBy(mythTokenPrice),
    MYTH.decimals,
  );

  const isLoading = isFiatPriceLoading || isMythTokenLoading;

  return (
    <TreasuryDetailItem
      title="Myth Token"
      titleTooltipContent="Airdrop & distribution of Myth tokens"
      iconSrc="/imgs/data-myth.svg"
      content={<ValueDisplay value={totalValue} prefix="$" />}
      isLoading={isLoading}
      footer={
        <AssetWrapper>
          <AddressGroup>
            <AddressLink
              title="Referendum"
              base="https://polkadot.subsquare.io/"
              address="referenda/643"
            />

            <AddressLink
              title="Distribution Addr"
              base="https://assethub-polkadot.subscan.io/"
              address={`account/${MYTH_TOKEN_ACCOUNT}`}
            />
          </AddressGroup>
          <AssetValueDisplay
            value={mythTokenBalance}
            isLoading={isLoading}
            precision={MYTH.decimals}
            symbol={MYTH.symbol}
            valueTooltipContent={<ValueDisplay value={totalValue} prefix="$" />}
          />
        </AssetWrapper>
      }
    />
  );
}
