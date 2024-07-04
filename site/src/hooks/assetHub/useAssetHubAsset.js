import { useEffect } from "react";
import useAssetHubApi from "./useAssetHubApi";
import { useState } from "react";
import { ASSET_HUB_ACCOUNT } from "../../constants/assetHub";

export function useAssetHubAsset(assetId) {
  const assetHubApi = useAssetHubApi();
  const [value, setValue] = useState("0");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!assetHubApi || !assetId) {
      return;
    }

    let unSub;

    assetHubApi.query.assets
      .account(assetId, ASSET_HUB_ACCOUNT, (optionalStorage) => {
        if (optionalStorage.isNone) {
          setValue("0");
          return;
        }

        setValue(optionalStorage.unwrap().balance.toString());
      })
      .then((un) => {
        unSub = un;
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      unSub?.();
    };
  }, [assetHubApi, assetId]);

  return [value, loading];
}
