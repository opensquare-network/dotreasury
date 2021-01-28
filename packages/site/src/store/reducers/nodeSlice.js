import { createSlice } from "@reduxjs/toolkit";
import { DEFAULT_NODES } from "../../constants";
import { getNodeUrl } from "../../services/chainApi";

const nodeSlice = createSlice({
  name: "node",
  initialState: {
    currentNode: getNodeUrl(),
    nodes: DEFAULT_NODES
  },
  reducers: {
    setCurrentNode(_, { payload }) {
      localStorage.setItem("nodeUrl", payload);
      window.location.reload();
    },
    setNodesDelay(state, { payload }) {
      (payload || []).map(item => {
        const node = state.nodes.find(node => item.url === node.url);
        if (node) node.delay = item.delay;
        return null;
      })
    }
  }
});

export const currentNodeSelector = (state) => state.node.currentNode;
export const nodesSelector = (state) => state.node.nodes;

export const { setCurrentNode, setNodesDelay } = nodeSlice.actions;

export default nodeSlice.reducer;
