import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getApi } from "../services/chainApi";
import { nodesSelector, setNodesDelay } from "../store/reducers/nodeSlice";
import { sleep } from "./index";

const TIMEOUT = 10000;

const fetchApiTime = async (api) => {
  const startTime = Date.now();
  try {
    await api.rpc.system.chain();
  } catch (e) {
    return "error";
  }

  const endTime = Date.now();
  return endTime - startTime;
};

const timeout = async (ms) => {
  await sleep(ms);
  return "timeout";
};

const testNet = async (api) => {
  return await Promise.race([fetchApiTime(api), timeout(TIMEOUT)]);
};

const useUpdateNodesDelay = () => {
  const nodesSetting = useSelector(nodesSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    const updateNodeDelay = async (chain, url) => {
      try {
        const api = await getApi(chain, url);
        const delay = await testNet(api);
        return { chain, url, delay };
      } catch {
        return { chain, url, delay: "" };
      }
    };

    const timeoutId = setTimeout(async () => {
      const results = await Promise.all([
        ...(nodesSetting.kusama || []).map((item) =>
          updateNodeDelay("kusama", item.url)
        ),
        ...(nodesSetting.polkadot || []).map((item) =>
          updateNodeDelay("polkadot", item.url)
        ),
      ]);
      dispatch(setNodesDelay(results));
    }, 10000);
    return () => clearTimeout(timeoutId);
  }, [dispatch, nodesSetting]);
};

export default useUpdateNodesDelay;
