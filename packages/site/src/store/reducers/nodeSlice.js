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
    setNodeDelay(state, { payload: {url, delay } }) {
      const node = state.nodes.find(item => item.url === url);
      if (node) node.delay = delay;
    }
  }
});

export const currentNodeSelector = (state) => state.node.currentNode;
export const nodesSelector = (state) => state.node.nodes;

export const { setCurrentNode, setNodeDelay } = nodeSlice.actions;

export default nodeSlice.reducer;
