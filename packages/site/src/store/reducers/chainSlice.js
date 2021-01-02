import { createSlice } from "@reduxjs/toolkit";
import { getCurrentBlockHeight } from "../../services/chainApi";

const chainSlice = createSlice({
  name: "chain",
  initialState: {
    currentBlockHeight: 0,
    scanHeight: 0,
  },
  reducers: {
    setCurrentBlockHeight(state, { payload }) {
      state.currentBlockHeight = payload;
    },
    setScanHeight(state, { payload }) {
      state.scanHeight = payload;
    },
  },
});

export const { setCurrentBlockHeight, setScanHeight } = chainSlice.actions;

export const fetchCurrentBlockHeight = () => async (dispatch) => {
  const result = await getCurrentBlockHeight();
  dispatch(setCurrentBlockHeight(result || 0));
};

export const currentBlockHeightSelector = (state) =>
  state.chain.currentBlockHeight;
export const scanHeightSelector = (state) => state.chain.scanHeight;

export default chainSlice.reducer;
