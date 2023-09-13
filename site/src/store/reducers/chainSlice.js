import { createSlice } from "@reduxjs/toolkit";
import { getApi, estimateBlocksTime } from "../../services/chainApi";
import { symbolFromNetwork } from "../../utils";

const chain = import.meta.env.VITE_APP_CHAIN;

const chainSlice = createSlice({
  name: "chain",
  initialState: {
    chain,
    currentBlockHeight: 0,
    scanHeight: 0,
    spendPeriod: {
      blockNumber: 0,
      periodTime: 0,
      restTime: 0,
      restBlocks: 0,
      progress: 0,
    },
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
    },
  },
});

export const { setCurrentBlockHeight, setScanHeight, setSpendPeriod } =
  chainSlice.actions;

export const fetchSpendPeriod = () => async (dispatch, getState) => {
  const {
    chain: { chain },
  } = getState();
  const api = await getApi(chain);
  const bestNumber = await api.derive.chain.bestNumber();
  const spendPeriod = api.consts.treasury.spendPeriod;
  const goneBlocks = bestNumber.mod(spendPeriod);
  dispatch(
    setSpendPeriod({
      blockNumber: spendPeriod.toNumber(),
      periodTime: await estimateBlocksTime(chain, spendPeriod),
      restBlocks: spendPeriod.sub(goneBlocks).toNumber(),
      restTime: await estimateBlocksTime(chain, spendPeriod.sub(goneBlocks)),
      progress: goneBlocks.muln(100).div(spendPeriod).toNumber(),
    }),
  );
};

export const currentBlockHeightSelector = (state) =>
  state.chain.currentBlockHeight;
export const scanHeightSelector = (state) => state.chain.scanHeight;
export const spendPeriodSelector = (state) => state.chain.spendPeriod;

export const chainSelector = (state) => state.chain.chain;
export const chainSymbolSelector = (state) =>
  (symbolFromNetwork(state.chain.chain) || "").toUpperCase();

export default chainSlice.reducer;
