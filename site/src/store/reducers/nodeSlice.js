import { createSlice } from "@reduxjs/toolkit";
import { nodesDefinition } from "../../services/chainApi";
import { currentChain } from "../../utils/chains";

const chainNodes = nodesDefinition[currentChain];

function getInitNodeUrl() {
  const localNodeUrl = localStorage.getItem("nodeUrlV2");
  const node = (chainNodes || []).find(({ url }) => url === localNodeUrl);
  if (node) {
    return node.url;
  } else if (chainNodes) {
    return chainNodes[0].url;
  }

  throw new Error(`Can not find nodes for ${currentChain}`);
}

const nodeSlice = createSlice({
  name: "node",
  initialState: {
    currentNode: getInitNodeUrl(),
    nodes: chainNodes,
  },
  reducers: {
    setCurrentNode(state, { payload }) {
      const { url, refresh } = payload;
      const beforeUrl = state.currentNode;
      state.currentNode = url;

      localStorage.setItem("nodeUrlV2", url);

      state.nodes = (state.nodes || []).map((item) => {
        if (item.url === beforeUrl) {
          return { ...item, update: true };
        } else {
          return item;
        }
      });

      if (refresh) {
        window.location.href =
          import.meta.env.VITE_APP_ROUTER_TYPE === "HashRouter" ? "/#/" : "/";
      }
    },
    setNodesDelay(state, { payload }) {
      const node = state.nodes?.find((node) => payload.url === node.url);
      if (node) {
        node.delay = payload.delay;
      }
    },
  },
});

export const currentNodeSelector = (state) => state.node.currentNode;
export const nodesSelector = (state) => state.node.nodes;

export const { setCurrentNode, setNodesDelay } = nodeSlice.actions;

export default nodeSlice.reducer;
