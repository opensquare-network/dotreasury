import { useQueryAccountFree } from "./useQueryAssetHubTreasuryFree";
import useApi from "../useApi";
import { currentChain } from "../../utils/chains";
import { encodeChainAddress } from "../../services/chainApi";
import { useEffect, useState } from "react";
import { u8aConcat } from "@polkadot/util";
import { useAssetBalance } from "./useAssetBalance";
import {
  ASSET_HUB_USDC_ASSET_ID,
  ASSET_HUB_USDT_ASSET_ID,
} from "../../constants/assetHub";

const EMPTY_U8A_32 = new Uint8Array(32);

export function useTreasuryAccount(api) {
  const [account, setAccount] = useState();

  useEffect(() => {
    if (!api) {
      return;
    }

    const treasuryAccount = u8aConcat(
      "modl",
      api?.consts?.treasury && api.consts?.treasury?.palletId
        ? api.consts?.treasury?.palletId.toU8a(true)
        : "py/trsry",
      EMPTY_U8A_32,
    ).subarray(0, 32);
    setAccount(encodeChainAddress(treasuryAccount, currentChain));
  }, [api]);

  return account;
}

export default function useQueryRelayChainFree() {
  const api = useApi();
  const account = useTreasuryAccount(api);

  return useQueryAccountFree(api, account);
}

export function useQueryRelayChainTotalBalance() {
  const api = useApi();
  const account = useTreasuryAccount(api);
  const { balance: relayChainFreeBalance, isLoading: isRelayChainFreeLoading } =
    useQueryRelayChainFree();

  const [usdcBalance, isUsdcBalanceLoading] = useAssetBalance(
    api,
    ASSET_HUB_USDC_ASSET_ID,
    account,
  );

  const [usdtBalance, isUsdtBalanceLoading] = useAssetBalance(
    api,
    ASSET_HUB_USDT_ASSET_ID,
    account,
  );

  return {
    relayChainFreeBalance,
    usdcBalance,
    usdtBalance,
    isRelayChainFreeLoading,
    isUsdcBalanceLoading,
    isUsdtBalanceLoading,
    isLoading:
      isRelayChainFreeLoading || isUsdcBalanceLoading || isUsdtBalanceLoading,
  };
}
