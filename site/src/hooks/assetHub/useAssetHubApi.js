import { useEffect, useState } from "react";
import { getAssetHubApi } from "../../services/assethubApi";

export default function useAssetHubApi() {
  /**
   * @typedef {Awaited<ReturnType<getAssetHubApi>>} Api
   * @type {[Api, React.Dispatch<React.SetStateAction<Api>]} api - Represents the state variable and its setter function.
   */
  const [api, setApi] = useState(null);

  useEffect(() => {
    getAssetHubApi().then((api) => {
      setApi(api);
    });
  }, []);

  return api;
}
