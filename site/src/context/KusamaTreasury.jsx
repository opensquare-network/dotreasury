import useQueryRelayChainFree from "../hooks/treasury/useQueryRelayChainFree";
import { useQueryAssetHubTreasuryFree } from "../hooks/treasury/useQueryAssetHubTreasuryFree";
import { KUSAMA_ASSETHUB_ACCOUNT } from "../constants/kusama";
import { useLoansHydrationKsmBalance } from "../hooks/treasury/useLoansBalances";
import useFiatPrice from "../hooks/useFiatPrice";
import BigNumber from "bignumber.js";
import { kusama } from "../utils/chains/kusama";
import { toPrecision } from "../utils";
import { createContext } from "react";
import { useContext } from "react";

const Context = createContext({});

export function useKusamaTreasuryData() {
  return useContext(Context);
}

export default function KusamaTreasuryProvider({ children }) {
  const { price: ksmPrice } = useFiatPrice();

  const { balance: relayChainFreeBalance, isLoading: isRelayChainFreeLoading } =
    useQueryRelayChainFree();

  const {
    balance: ksmTreasuryBalanceOnAssetHub,
    isLoading: isKsmTreasuryBalanceOnAssetHubLoading,
  } = useQueryAssetHubTreasuryFree(KUSAMA_ASSETHUB_ACCOUNT);

  const {
    balance: loansHydrationKsmBalance,
    isLoading: isLoansHydrationKsmLoading,
  } = useLoansHydrationKsmBalance();

  const totalKsmValue = BigNumber.sum(
    relayChainFreeBalance || 0,
    ksmTreasuryBalanceOnAssetHub || 0,
    loansHydrationKsmBalance || 0,
  ).toString();

  const totalKsmFiatValue = BigNumber(
    toPrecision(totalKsmValue, kusama.decimals),
  )
    .multipliedBy(ksmPrice)
    .toString();

  const isTotalKsmLoading =
    isRelayChainFreeLoading ||
    isKsmTreasuryBalanceOnAssetHubLoading ||
    isLoansHydrationKsmLoading;

  return (
    <Context.Provider
      value={{
        relayChainFreeBalance,
        ksmTreasuryBalanceOnAssetHub,
        loansHydrationKsmBalance,

        isRelayChainFreeLoading,
        isKsmTreasuryBalanceOnAssetHubLoading,
        isLoansHydrationKsmLoading,

        totalKsmValue,
        totalKsmFiatValue,
        isTotalKsmLoading,
      }}
    >
      {children}
    </Context.Provider>
  );
}
