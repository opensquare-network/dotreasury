import useAssetHubApi from "./useAssetHubApi";
import { ASSET_HUB_ACCOUNT } from "../../constants/assetHub";
import { useAssetBalance } from "../treasury/useAssetBalance";

export function useAssetHubAsset(assetId, account = ASSET_HUB_ACCOUNT) {
  const assetHubApi = useAssetHubApi();
  return useAssetBalance(assetHubApi, assetId, account);
}
