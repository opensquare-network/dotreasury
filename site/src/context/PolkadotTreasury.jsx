import { useSelector } from "react-redux";
import { overviewSelector } from "../store/reducers/overviewSlice";
import useQueryRelayChainFree from "../hooks/treasury/useQueryRelayChainFree";
import { useAssetHubDot } from "../hooks/assetHub/useAssetHubDot";
import { useAssetHubAsset } from "../hooks/assetHub/useAssetHubAsset";
import {
  ASSET_HUB_USDC_ASSET_ID,
  ASSET_HUB_USDT_ASSET_ID,
} from "../constants/assetHub";
import { useBountiesData } from "../hooks/bounties/useBountiesData";
import { useBountiesTotalBalance } from "../hooks/bounties/useBountiesBalances";
import { useHydrationTreasuryBalances } from "../hooks/hydration/useHydrationTreasuryBalances";
import useQueryFellowshipSalaryBalance from "../hooks/treasury/useQueryFellowshipSalaryBalance";
import { useQueryAssetHubTreasuryFree } from "../hooks/treasury/useQueryAssetHubTreasuryFree";
import { STATEMINT_FELLOWSHIP_TREASURY_ACCOUNT } from "../constants/statemint";
import {
  useLoansBifrostDotBalance,
  useLoansCentrifugeUsdcBalance,
  useLoansPendulumDotBalance,
} from "../hooks/treasury/useLoansBalances";
import useAssetHubForeignAssets from "../hooks/assetHub/useAssetHubForeignAssets";
import { MYTH, MYTH_TOKEN_ACCOUNT } from "../constants/foreignAssets";
import useFiatPrice from "../hooks/useFiatPrice";
import BigNumber from "bignumber.js";
import { polkadot } from "../utils/chains/polkadot";
import { toPrecision } from "../utils";
import { USDt } from "../utils/chains/usdt";
import { USDC } from "../utils/chains/usdc";
import { createContext } from "react";
import { useContext } from "react";

const Context = createContext({});

export function usePolkadotTreasuryData() {
  return useContext(Context);
}

export default function PolkadotTreasuryProvider({ children }) {
  const overview = useSelector(overviewSelector);
  const dotPrice = overview?.latestSymbolPrice ?? 0;

  const { balance: relayChainFreeBalance, isLoading: isRelayChainFreeLoading } =
    useQueryRelayChainFree();
  const [assetHubDotBalance, isAssetHubDotLoading] = useAssetHubDot();
  const [assetHubUSDtBalance, isAssetHubUSDtLoading] = useAssetHubAsset(
    ASSET_HUB_USDT_ASSET_ID,
  );
  const [assetHubUSDCBalance, isAssetHubUSDCLoading] = useAssetHubAsset(
    ASSET_HUB_USDC_ASSET_ID,
  );

  const { bounties, bountiesCount } = useBountiesData();
  const {
    balance: bountiesTotalBalance,
    isLoading: isBountiesTotalBalanceLoading,
  } = useBountiesTotalBalance(bounties);

  const {
    dot: hydrationDotBalance,
    usdt: hydrationUSDtBalance,
    usdc: hydrationUSDCBalance,
    isLoading: isHydrationLoading,
  } = useHydrationTreasuryBalances();

  const {
    balance: fellowshipSalaryUSDtBalance,
    isLoading: isFellowshipSalaryUSDtLoading,
  } = useQueryFellowshipSalaryBalance("USDt");
  const {
    balance: fellowshipTreasuryDotBalance,
    isLoading: isFellowshipTreasuryDotLoading,
  } = useQueryAssetHubTreasuryFree(STATEMINT_FELLOWSHIP_TREASURY_ACCOUNT);

  const {
    balance: loansCentrifugeUSDCBalance,
    isLoading: isLoansCentrifugeUSDCLoading,
  } = useLoansCentrifugeUsdcBalance();
  const {
    balance: loansBifrostDotBalance,
    isLoading: isLoansBifrostDotLoading,
  } = useLoansBifrostDotBalance();
  const {
    balance: loansPendulumDotBalance,
    isLoading: isLoansPendulumDotLoading,
  } = useLoansPendulumDotBalance();

  const { balance: mythTokenBalance, isLoading: isMythTokenLoading } =
    useAssetHubForeignAssets(MYTH_TOKEN_ACCOUNT);
  const { price: mythTokenPrice } = useFiatPrice("MYTH");

  const totalDotValue = BigNumber.sum(
    relayChainFreeBalance || 0,
    assetHubDotBalance || 0,
    hydrationDotBalance || 0,
    bountiesTotalBalance || 0,
    fellowshipTreasuryDotBalance || 0,
    loansBifrostDotBalance || 0,
    loansPendulumDotBalance || 0,
  ).toString();
  const totalDotFiatValue = BigNumber(
    toPrecision(totalDotValue, polkadot.decimals),
  )
    .multipliedBy(dotPrice)
    .toString();

  const totalUSDtValue = toPrecision(
    BigNumber.sum(
      assetHubUSDtBalance || 0,
      hydrationUSDtBalance || 0,
      fellowshipSalaryUSDtBalance || 0,
    ).toString(),
    USDt.decimals,
  );

  const totalUSDCValue = toPrecision(
    BigNumber.sum(
      assetHubUSDCBalance || 0,
      hydrationUSDCBalance || 0,
      loansCentrifugeUSDCBalance || 0,
    ).toString(),
    USDC.decimals,
  );

  const totalMythTokenFiatValue = BigNumber(
    toPrecision(mythTokenBalance, MYTH.decimals),
  )
    .multipliedBy(mythTokenPrice)
    .toString();

  const totalFiatValue = BigNumber.sum(
    totalDotFiatValue,
    totalUSDtValue,
    totalUSDCValue,
    totalMythTokenFiatValue,
  ).toString();

  const isTotalDotLoading =
    isRelayChainFreeLoading ||
    isAssetHubDotLoading ||
    isHydrationLoading ||
    isBountiesTotalBalanceLoading ||
    isFellowshipTreasuryDotLoading ||
    isLoansBifrostDotLoading ||
    isLoansPendulumDotLoading;

  const isTotalUSDtLoading =
    isAssetHubUSDtLoading ||
    isHydrationLoading ||
    isFellowshipSalaryUSDtLoading;

  const isTotalUSDCLoading =
    isAssetHubUSDCLoading || isHydrationLoading || isLoansCentrifugeUSDCLoading;

  const isTotalLoading =
    isTotalDotLoading || isTotalUSDtLoading || isTotalUSDCLoading;

  return (
    <Context.Provider
      value={{
        relayChainFreeBalance,
        isRelayChainFreeLoading,
        assetHubDotBalance,
        isAssetHubDotLoading,
        assetHubUSDtBalance,
        isAssetHubUSDtLoading,
        assetHubUSDCBalance,
        isAssetHubUSDCLoading,
        bountiesTotalBalance,
        bountiesCount,
        isBountiesTotalBalanceLoading,
        hydrationDotBalance,
        hydrationUSDtBalance,
        hydrationUSDCBalance,
        isHydrationLoading,
        fellowshipSalaryUSDtBalance,
        isFellowshipSalaryUSDtLoading,
        fellowshipTreasuryDotBalance,
        isFellowshipTreasuryDotLoading,
        loansCentrifugeUSDCBalance,
        isLoansCentrifugeUSDCLoading,
        loansBifrostDotBalance,
        isLoansBifrostDotLoading,
        loansPendulumDotBalance,
        isLoansPendulumDotLoading,
        mythTokenBalance,
        isMythTokenLoading,

        totalDotValue,
        isTotalDotLoading,
        totalDotFiatValue,
        totalUSDtValue,
        isTotalUSDtLoading,
        totalUSDCValue,
        isTotalUSDCLoading,
        totalMythTokenFiatValue,
        totalFiatValue,
        isTotalLoading,
      }}
    >
      {children}
    </Context.Provider>
  );
}
