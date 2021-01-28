import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getApi } from "../services/chainApi";
import {
  nodesSelector,
  setNodesDelay,
} from "../store/reducers/nodeSlice";
import { sleep } from "./index";

const TIMEOUT = 1000;

const fetchApiTime = async api => {
  const startTime = Date.now();
  await api.rpc.system.chain();
  const endTime = Date.now();
  return endTime - startTime;
}

const testNet = async api => {
  const result = await Promise.race([
    fetchApiTime(api),
    sleep(TIMEOUT)
  ])
  return typeof result === 'number' ? result : 'timeout';
}

const useUpdateNodesDelay = () => {
  const nodes = useSelector(nodesSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    const updateNodeDelay = async (url) => {
      const api = await getApi(url);
      const delay = await testNet(api);
      return {url, delay}

    }

    const tiemoutId = setTimeout(async () => {
      const results = await Promise.all((nodes || []).map(item => updateNodeDelay(item.url)));
      dispatch(setNodesDelay(results));
    }, 10000);
    return () => clearTimeout(tiemoutId);
  }, [nodes, dispatch]);
}

export default useUpdateNodesDelay;
