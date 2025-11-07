import { useEffect } from "react";
import { useState } from "react";

export function useAssetBalance(api, assetId, address) {
  const [value, setValue] = useState("0");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!api || !assetId) {
      return;
    }

    let unSub;

    api.query?.assets
      ?.account?.(assetId, address, (optionalStorage) => {
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
  }, [api, assetId, address]);

  return [value, loading];
}
