import { useEffect } from "react";
import useAssetHubApi from "./useAssetHubApi";
import { useState } from "react";
import { ASSET_HUB_ACCOUNT } from "../../constants/assetHub";

export function useAssetHubDot() {
  const assetHubApi = useAssetHubApi();
  const [value, setValue] = useState("0");

  useEffect(() => {
    if (!assetHubApi) {
      return;
    }

    assetHubApi.query.system.account(ASSET_HUB_ACCOUNT).then((storage) => {
      const { free, reserved } = storage.data;
      setValue((free.toBigInt() + reserved.toBigInt()).toString());
    });
  }, [assetHubApi]);

  return value;
}
