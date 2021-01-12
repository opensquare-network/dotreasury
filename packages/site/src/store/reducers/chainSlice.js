import { createSlice } from "@reduxjs/toolkit";
import { getApi, getCurrentBlockHeight } from "../../services/chainApi";

const chainSlice = createSlice({
  name: "chain",
  initialState: {
    currentBlockHeight: 0,
    scanHeight: 0,
    spendPeriod: {
      blockNumber: 0,
      periodTime: 0,
      restTime: 0,
      progress: 0,
    }
  },
  reducers: {
    setCurrentBlockHeight(state, { payload }) {
      state.currentBlockHeight = payload;
    },
    setScanHeight(state, { payload }) {
      state.scanHeight = payload;
    },
    setSpendPeriod(state, { payload }) {
      state.spendPeriod = payload;
    }
  },
});

export const { setCurrentBlockHeight, setScanHeight, setSpendPeriod } = chainSlice.actions;

export const fetchCurrentBlockHeight = () => async (dispatch) => {
  const result = await getCurrentBlockHeight();
  dispatch(setCurrentBlockHeight(result || 0));
};

export const fetchSpendPeriod = () => async (dispatch) => {
  const api = await getApi();
  const bestNumber = await api.derive.chain.bestNumber();
  const spendPeriod = api.consts.treasury.spendPeriod;
  const goneBlocks = bestNumber.mod(spendPeriod);
  const msPerBlock = api.consts.babe.expectedBlockTime;
  dispatch(setSpendPeriod({
    blockNumber: spendPeriod.toNumber(),
    periodTime: spendPeriod.mul(msPerBlock).toNumber(),
    restTime: spendPeriod.sub(goneBlocks).mul(msPerBlock).toNumber(),
    progress: goneBlocks.muln(100).div(spendPeriod).toNumber(),
  }));
};

export const currentBlockHeightSelector = (state) =>
  state.chain.currentBlockHeight;
export const scanHeightSelector = (state) => state.chain.scanHeight;
export const spendPeriodSelector = (state) => state.chain.spendPeriod;

export default chainSlice.reducer;
