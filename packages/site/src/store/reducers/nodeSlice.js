import { createSlice } from "@reduxjs/toolkit";
import { getNodeUrl, getNodes } from "../../services/chainApi";

const nodeSlice = createSlice({
  name: "node",
  initialState: {
    currentNode: getNodeUrl(),
    nodes: getNodes(),
  },
  reducers: {
    setCurrentNode(_, { payload }) {
      const { chain, url } = payload;
      let nodeUrl = null;
      try {
        nodeUrl = JSON.parse(localStorage.getItem("nodeUrl"));
      } catch (e) {
        // ignore parse error
      }
      nodeUrl = { ...nodeUrl, [chain]: url };
      localStorage.setItem("nodeUrl", JSON.stringify(nodeUrl));
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
