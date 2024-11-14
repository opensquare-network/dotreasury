import { useQueryAccountFree } from "./useQueryAssetHubTreasuryFree";
import useApi from "../useApi";

// TODO: treasury account
export default function useQueryRelayChainFree(address) {
  const api = useApi();

  return useQueryAccountFree(api, address);
}
