import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getApi } from "../services/chainApi";
import { chainSelector } from "../store/reducers/chainSlice";

export default function useApi() {
  const [api, setApi] = useState(null);
  const chain = useSelector(chainSelector);

  useEffect(() => {
    getApi(chain).then((api) => {
      setApi(api);
    });
  }, [chain]);

  return api;
}
