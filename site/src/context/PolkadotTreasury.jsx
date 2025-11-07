import { useQueryRelayChainTotalBalance } from "../hooks/treasury/useQueryRelayChainFree";
import { useAssetHubDot } from "../hooks/assetHub/useAssetHubDot";
import { useAssetHubAsset } from "../hooks/assetHub/useAssetHubAsset";
import {
  ASSET_HUB_USDC_ASSET_ID,
  ASSET_HUB_USDT_ASSET_ID,
} from "../constants/assetHub";
import { useBountiesData } from "../hooks/bounties/useBountiesData";
import { useBountiesTotalBalance } from "../hooks/bounties/useBountiesBalances";
import { useHydrationTreasuryBalances } from "../hooks/hydration/useHydrationTreasuryBalances";
import { useQueryAssetHubTreasuryFree } from "../hooks/treasury/useQueryAssetHubTreasuryFree";
import {
  STATEMINT_FELLOWSHIP_TREASURY_ACCOUNT,
  STATEMINT_FELLOWSHIP_SALARY_ACCOUNT,
  STATEMINT_AMBASSADOR_TREASURY_ACCOUNT,
} from "../constants/statemint";
import {
  useLoansBifrostDotBalance,
  useLoansPendulumDotBalance,
  useLoansHydrationDotBalance,
} from "../hooks/treasury/useLoansBalances";
import useAssetHubForeignAssets from "../hooks/assetHub/useAssetHubForeignAssets";
import { MYTH, MYTH_TOKEN_ACCOUNT } from "../constants/foreignAssets";
import useFiatPrice, { useFiatPriceBySymbol } from "../hooks/useFiatPrice";
import BigNumber from "bignumber.js";
import { polkadot } from "../utils/chains/polkadot";
import { toPrecision } from "../utils";
import { USDt } from "../utils/chains/usdt";
import { USDC } from "../utils/chains/usdc";
import { createContext } from "react";
import { useContext } from "react";
import useQueryAccountBalanceBySymbol from "../hooks/treasury/useQueryAccountBalanceBySymbol";

const Context = createContext({});

export function usePolkadotTreasuryData() {
  return useContext(Context);
}

export default function PolkadotTreasuryProvider({ children }) {
  const { price: dotPrice } = useFiatPrice();

  const {
    relayChainFreeBalance,
    isRelayChainFreeLoading,
    usdcBalance: usdcBalanceOnRelayChain,
    usdtBalance: usdtBalanceOnRelayChain,
    isUsdcBalanceLoading: isUsdcBalanceLoadingOnRelayChain,
    isUsdtBalanceLoading: isUsdtBalanceLoadingOnRelayChain,
  } = useQueryRelayChainTotalBalance();
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
  } = useQueryAccountBalanceBySymbol(
    "USDt",
    STATEMINT_FELLOWSHIP_SALARY_ACCOUNT,
  );
  const {
    balance: fellowshipTreasuryDotBalance,
    isLoading: isFellowshipTreasuryDotLoading,
  } = useQueryAssetHubTreasuryFree(STATEMINT_FELLOWSHIP_TREASURY_ACCOUNT);

  const { balance: ambassadorUSDtBalance, isLoading: isAmbassadorUSDtLoading } =
    useQueryAccountBalanceBySymbol(
      "USDt",
      STATEMINT_AMBASSADOR_TREASURY_ACCOUNT,
    );

  const {
    balance: loansBifrostDotBalance,
    isLoading: isLoansBifrostDotLoading,
  } = useLoansBifrostDotBalance();
  const {
    balance: loansPendulumDotBalance,
    isLoading: isLoansPendulumDotLoading,
  } = useLoansPendulumDotBalance();
  const {
    balance: loansHydrationDotBalance,
    isLoading: isLoansHydrationDotLoading,
  } = useLoansHydrationDotBalance();

  const { balance: mythTokenBalance, isLoading: isMythTokenLoading } =
    useAssetHubForeignAssets(MYTH_TOKEN_ACCOUNT);
  const { price: mythTokenPrice } = useFiatPriceBySymbol("MYTH");

  const totalDotValue = BigNumber.sum(
    relayChainFreeBalance || 0,
    assetHubDotBalance || 0,
    hydrationDotBalance || 0,
    bountiesTotalBalance || 0,
    fellowshipTreasuryDotBalance || 0,
    loansBifrostDotBalance || 0,
    loansPendulumDotBalance || 0,
    loansHydrationDotBalance || 0,
  ).toString();
  const totalDotFiatValue = BigNumber(
    toPrecision(totalDotValue, polkadot.decimals),
  )
    .multipliedBy(dotPrice)
    .toString();

  const totalUSDtValue = toPrecision(
    BigNumber.sum(
      usdtBalanceOnRelayChain || 0,
      assetHubUSDtBalance || 0,
      hydrationUSDtBalance || 0,
      fellowshipSalaryUSDtBalance || 0,
      ambassadorUSDtBalance || 0,
    ).toString(),
    USDt.decimals,
  );

  const totalUSDCValue = toPrecision(
    BigNumber.sum(
      usdcBalanceOnRelayChain || 0,
      assetHubUSDCBalance || 0,
      hydrationUSDCBalance || 0,
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
    isLoansPendulumDotLoading ||
    isLoansHydrationDotLoading;

  const isTotalUSDtLoading =
    isUsdtBalanceLoadingOnRelayChain ||
    isAssetHubUSDtLoading ||
    isHydrationLoading ||
    isFellowshipSalaryUSDtLoading ||
    isAmbassadorUSDtLoading;

  const isTotalUSDCLoading =
    isUsdcBalanceLoadingOnRelayChain ||
    isAssetHubUSDCLoading ||
    isHydrationLoading;

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
        ambassadorUSDtBalance,
        isAmbassadorUSDtLoading,
        fellowshipTreasuryDotBalance,
        isFellowshipTreasuryDotLoading,
        loansBifrostDotBalance,
        isLoansBifrostDotLoading,
        loansPendulumDotBalance,
        isLoansPendulumDotLoading,
        loansHydrationDotBalance,
        isLoansHydrationDotLoading,
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
