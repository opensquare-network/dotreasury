import { useEffect } from "react";
import { useState } from "react";

export function useAssetBalance(api, assetId, address) {
  const [value, setValue] = useState("0");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!api || !assetId) {
      return;
    }

    api.query?.assets
      ?.account?.(assetId, address, (optionalStorage) => {
        if (optionalStorage.isNone) {
          setValue("0");
          return;
        }

        const unwrapped = optionalStorage.unwrap();

        setValue(unwrapped.balance?.toString() || "0");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [api, assetId, address]);

  return [value, loading];
}
