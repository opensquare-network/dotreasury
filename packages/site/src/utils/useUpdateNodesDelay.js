import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getApi } from "../services/chainApi";
import { nodesSelector, setNodesDelay } from "../store/reducers/nodeSlice";
import { sleep } from "./index";

let isFirstTime = true;
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
  const nodes = useSelector(nodesSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    const updateNodeDelay = async (url) => {
      const api = await getApi(url);
      const delay = await testNet(api);
      return { url, delay };
    };

    const timeoutId = setTimeout(
      async () => {
        isFirstTime = false;
        const results = await Promise.all(
          (nodes || []).map((item) => updateNodeDelay(item.url))
        );
        dispatch(setNodesDelay(results));
      },
      isFirstTime ? 3000 : 10000
    );
    return () => clearTimeout(timeoutId);
  }, [nodes, dispatch]);
};

export default useUpdateNodesDelay;
