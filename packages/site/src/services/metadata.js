import { getApi } from "./chainApi";
import { GenericCall } from "@polkadot/types";

export async function getCall(blockHash, callHex) {
  const api = await getApi();
  const registry = await api.getBlockRegistry(blockHash);
  return new GenericCall(registry.registry, callHex);
}
