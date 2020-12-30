import { createSlice } from "@reduxjs/toolkit";
import { getCurrentBlockHeight } from "../../services/chainApi";

const chainSlice = createSlice({
  name: "chain",
  initialState: {
    currentBlockHeight: 0,
  },
  reducers: {
    setCurrentBlockHeight(state, { payload }) {
      state.currentBlockHeight = payload;
    },
  },
});

export const {
  setCurrentBlockHeight,
} = chainSlice.actions;

export const fetchCurrentBlockHeight = () => async (dispatch) => {
  const result = await getCurrentBlockHeight();
  dispatch(setCurrentBlockHeight(result || 0));
};

export const currentBlockHeightSelector = (state) => state.chain.currentBlockHeight;

export default chainSlice.reducer;
