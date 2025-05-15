import BigNumber from "bignumber.js";
import useHydrationApi from "./useHydrationApi";
import useCall from "../useCall";

const DotTokenId = 5;
const UsdtTokenIdFromAssetHub = 10;
const UsdcTokenIdFromAssetHub = 22;
const ADotTokenId = 1001;

export const PolkadotTreasuryOnHydrationAccount1 =
  "7LcF8b5GSvajXkSChhoMFcGDxF9Yn9unRDceZj1Q6NYox8HY";

export const PolkadotTreasuryOnHydrationAccount2 =
  "7KCp4eenFS4CowF9SpQE5BBCj5MtoBA3K811tNyRmhLfH1aV";

export const PolkadotTreasuryOnHydrationAccount3 =
  "7KATdGaecnKi4zDAMWQxpB2s59N2RE1JgLuugCjTsRZHgP24";

export const PolkadotTreasuryOnHydrationAccount4 =
  "7N4oFqXKgeTXo6CMSY9BVZdHP5J3RhQXY77Fe7qmQwjcxa1w";

function getTotal(account) {
  return (
    (account?.free?.toBigInt() || 0n) + (account?.reserved?.toBigInt() || 0n)
  ).toString();
}

function useHydrationTreasuryBalanceForAccount(address) {
  const api = useHydrationApi();

  const { loaded: isUsdtLoaded, value: accountUsdt } = useCall(
    api?.query.tokens?.accounts,
    [address, UsdtTokenIdFromAssetHub],
  );
  const { loaded: isUsdcLoaded, value: accountUsdc } = useCall(
    api?.query.tokens?.accounts,
    [address, UsdcTokenIdFromAssetHub],
  );
  const { loaded: isDotLoaded, value: accountDot } = useCall(
    api?.query.tokens?.accounts,
    [address, DotTokenId],
  );
  const { loaded: isADotLoaded, value: accountADot } = useCall(
    api?.query.tokens?.accounts,
    [address, ADotTokenId],
  );

  const isLoading =
    !isUsdtLoaded || !isUsdcLoaded || !isDotLoaded || !isADotLoaded;

  return {
    dot: getTotal(accountDot),
    aDot: getTotal(accountADot),
    usdt: getTotal(accountUsdt),
    usdc: getTotal(accountUsdc),
    isLoading,
  };
}

export function useHydrationTreasuryBalances() {
  const {
    dot: dot1,
    aDot: aDot1,
    usdt: usdt1,
    usdc: usdc1,
    isLoading: isLoading1,
  } = useHydrationTreasuryBalanceForAccount(
    PolkadotTreasuryOnHydrationAccount1,
  );

  const {
    dot: dot2,
    aDot: aDot2,
    usdt: usdt2,
    usdc: usdc2,
    isLoading: isLoading2,
  } = useHydrationTreasuryBalanceForAccount(
    PolkadotTreasuryOnHydrationAccount2,
  );

  const {
    dot: dot3,
    aDot: aDot3,
    usdt: usdt3,
    usdc: usdc3,
    isLoading: isLoading3,
  } = useHydrationTreasuryBalanceForAccount(
    PolkadotTreasuryOnHydrationAccount3,
  );

  const {
    dot: dot4,
    aDot: aDot4,
    usdt: usdt4,
    usdc: usdc4,
    isLoading: isLoading4,
  } = useHydrationTreasuryBalanceForAccount(
    PolkadotTreasuryOnHydrationAccount4,
  );

  const isLoading = isLoading1 || isLoading2 || isLoading3 || isLoading4;

  const dot = BigNumber.sum(
    dot1,
    dot2,
    dot3,
    dot4,
    aDot1,
    aDot2,
    aDot3,
    aDot4,
  ).toString();
  const usdt = BigNumber.sum(usdt1, usdt2, usdt3, usdt4).toString();
  const usdc = BigNumber.sum(usdc1, usdc2, usdc3, usdc4).toString();

  return {
    dot,
    usdt,
    usdc,
    isLoading,
  };
}
