import { useQueryAccountFree } from "./useQueryAssetHubTreasuryFree";
import useApi from "../useApi";
import { currentChain } from "../../utils/chains";
import { encodeChainAddress } from "../../services/chainApi";
import { useEffect, useState } from "react";
import { u8aConcat } from "@polkadot/util";

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
