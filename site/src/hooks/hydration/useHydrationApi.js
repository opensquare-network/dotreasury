import { useEffect, useState } from "react";
import { getHydrationApi } from "../../services/hydrationApi";

export default function useHydrationApi() {
  /**
   * @typedef {Awaited<ReturnType<getHydrationApi>>} Api
   * @type {[Api, React.Dispatch<React.SetStateAction<Api>]} api - Represents the state variable and its setter function.
   */
  const [api, setApi] = useState(null);

  useEffect(() => {
    getHydrationApi().then((api) => {
      setApi(api);
    });
  }, []);

  return api;
}
