import { createSlice } from "@reduxjs/toolkit";
import { getNodeUrl, getNodes } from "../../services/chainApi";
import { symbolFromNetwork } from "../../utils";

const nodeSlice = createSlice({
  name: "node",
  initialState: {
    currentNode: getNodeUrl(),
    nodes: getNodes(),
  },
  reducers: {
    setCurrentNode(state, { payload }) {
      const { chain, url, refresh } = payload;
      const beforeUrl = state.currentNode?.[chain];

      let nodeUrl = null;
      try {
        nodeUrl = JSON.parse(localStorage.getItem("nodeUrl"));
      } catch (e) {
        // ignore parse error
      }
      nodeUrl = { ...nodeUrl, [chain]: url };
      localStorage.setItem("nodeUrl", JSON.stringify(nodeUrl));

      state.nodes[chain] = (state.nodes?.[chain] || []).map((item) => {
        if (item.url === beforeUrl) {
          return { ...item, update: true };
        } else {
          return item;
        }
      });
      state.currentNode = nodeUrl;

      if (refresh) {
        window.location.href = `/${symbolFromNetwork(chain).toLowerCase()}`;
      }
    },
    setNodesDelay(state, { payload }) {
      (payload || []).forEach((item) => {
        const node = state.nodes[item.chain]?.find(
          (node) => item.url === node.url
        );
        if (node) node.delay = item.delay;
      });
    },
  },
});

export const currentNodeSelector = (state) => state.node.currentNode;
export const nodesSelector = (state) => state.node.nodes;

export const { setCurrentNode, setNodesDelay } = nodeSlice.actions;

export default nodeSlice.reducer;
