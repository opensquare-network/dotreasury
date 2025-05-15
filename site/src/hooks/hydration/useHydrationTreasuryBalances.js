import BigNumber from "bignumber.js";
import useHydrationApi from "./useHydrationApi";
import useCall from "../useCall";

const DotTokenId = 5;
const UsdtTokenIdFromAssetHub = 10;
const UsdcTokenIdFromAssetHub = 22;

export const PolkadotTreasuryOnHydrationAccount1 =
  "7LcF8b5GSvajXkSChhoMFcGDxF9Yn9unRDceZj1Q6NYox8HY";

export const PolkadotTreasuryOnHydrationAccount2 =
  "7KCp4eenFS4CowF9SpQE5BBCj5MtoBA3K811tNyRmhLfH1aV";

export const PolkadotTreasuryOnHydrationAccount3 =
  "7KATdGaecnKi4zDAMWQxpB2s59N2RE1JgLuugCjTsRZHgP24";

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

  const isLoading = !isUsdtLoaded || !isUsdcLoaded || !isDotLoaded;

  return {
    dot: getTotal(accountDot),
    usdt: getTotal(accountUsdt),
    usdc: getTotal(accountUsdc),
    isLoading,
  };
}

export function useHydrationTreasuryBalances() {
  const {
    dot: dot1,
    usdt: usdt1,
    usdc: usdc1,
    isLoading: isLoading1,
  } = useHydrationTreasuryBalanceForAccount(
    PolkadotTreasuryOnHydrationAccount1,
  );

  const {
    dot: dot2,
    usdt: usdt2,
    usdc: usdc2,
    isLoading: isLoading2,
  } = useHydrationTreasuryBalanceForAccount(
    PolkadotTreasuryOnHydrationAccount2,
  );

  const {
    dot: dot3,
    usdt: usdt3,
    usdc: usdc3,
    isLoading: isLoading3,
  } = useHydrationTreasuryBalanceForAccount(
    PolkadotTreasuryOnHydrationAccount3,
  );

  const isLoading = isLoading1 || isLoading2 || isLoading3;

  const dot = BigNumber.sum(dot1, dot2, dot3).toString();
  const usdt = BigNumber.sum(usdt1, usdt2, usdt3).toString();
  const usdc = BigNumber.sum(usdc1, usdc2, usdc3).toString();

  return {
    dot,
    usdt,
    usdc,
    isLoading,
  };
}
