import { useEffect, useState } from "react";
import { useIsMounted } from "usehooks-ts";

const callCache = {};

function useCall(fn, params = [], { cacheKey = "", trigger } = {}) {
  const [value, setValue] = useState();
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const isMounted = useIsMounted();

  useEffect(() => {
    if (!fn) {
      return;
    }

    if (cacheKey) {
      const cache = callCache[cacheKey];
      if (cache) {
        setValue(cache);
        setLoaded(true);
        return;
      }
    }

    setLoading(true);
    fn(...(params || []))
      .then((value) => {
        if (cacheKey) {
          callCache[cacheKey] = value;
        }
        if (isMounted()) {
          setValue(value);
          setLoaded(true);
        }
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fn, cacheKey, trigger, isMounted, ...params]);

  return { value, loading, loaded };
}

export default useCall;
