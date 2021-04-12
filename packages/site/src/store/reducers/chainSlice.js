import { createSlice } from "@reduxjs/toolkit";
import {
  getApi,
  getCurrentBlockHeight,
  estimateBlocksTime,
} from "../../services/chainApi";
import { CHAINS } from "../../constants";

const chainStorageKey = "dotreasury-current-chain";
const chain = localStorage.getItem(chainStorageKey) || CHAINS.POLKADOT;

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
    setChain(state, { payload }) {
      if (![CHAINS.KUSAMA, CHAINS.POLKADOT].includes(payload)) {
        return;
      }

      state.chain = payload;
      localStorage.setItem(chainStorageKey, payload);
    },
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

export const {
  setCurrentBlockHeight,
  setScanHeight,
  setSpendPeriod,
} = chainSlice.actions;

export const fetchCurrentBlockHeight = () => async (dispatch) => {
  const result = await getCurrentBlockHeight();
  dispatch(setCurrentBlockHeight(result || 0));
};

export const fetchSpendPeriod = () => async (dispatch) => {
  const api = await getApi();
  const bestNumber = await api.derive.chain.bestNumber();
  const spendPeriod = api.consts.treasury.spendPeriod;
  const goneBlocks = bestNumber.mod(spendPeriod);
  dispatch(
    setSpendPeriod({
      blockNumber: spendPeriod.toNumber(),
      periodTime: await estimateBlocksTime(spendPeriod),
      restBlocks: spendPeriod.sub(goneBlocks).toNumber(),
      restTime: await estimateBlocksTime(spendPeriod.sub(goneBlocks)),
      progress: goneBlocks.muln(100).div(spendPeriod).toNumber(),
    })
  );
};

export const currentBlockHeightSelector = (state) =>
  state.chain.currentBlockHeight;
export const scanHeightSelector = (state) => state.chain.scanHeight;
export const spendPeriodSelector = (state) => state.chain.spendPeriod;

export const chainSelector = (state) => state.chain.chain;

export default chainSlice.reducer;
