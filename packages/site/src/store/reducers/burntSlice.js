import {createSlice} from "@reduxjs/toolkit";
import api from "../../services/scanApi";
import {getApi} from "../../services/chainApi";
import {TreasuryAccount} from "../../constants";
import {getPrecision, symbolFromNetwork, toPrecision} from "../../utils";

const burntSlice = createSlice({
  name: "burnt",
  initialState: {
    burntList: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
    },
    loadingBurntList: false,
    burntListCount: 0,
    treasury: {
      free: 0,
      burnPercent: 0,
    }
  },
  reducers: {
    setBurntChart(state, {payload}) {
      state.burntChart = payload;
    },
    setBurntList(state, {payload}) {
      state.burntList = payload;
    },
    setLoadingBurntList(state, {payload}) {
      state.loadingBurntList = payload;
    },
    setBurntListCount(state, {payload}) {
      state.burntListCount = payload;
    },
    setTreasury(state, {payload}) {
      state.treasury = payload;
    },
  },
});

export const {
  setBurntChart,
  setBurntList,
  setLoadingBurntList,
  setBurntListCount,
  setTreasury,
} = burntSlice.actions;

export const fetchBurntChart = (chain) => async (dispatch) => {
  const {result} = await api.fetch(`/${chain}/burnt/chart`);
  dispatch(setBurntChart(result || []));
};

export const fetchBurntList = (chain, page = 0, pageSize = 30) => async (dispatch) => {
  dispatch(setLoadingBurntList(true));

  try {
    const {result} = await api.fetch(`/${chain}/burnt`, {page, pageSize});
    dispatch(setBurntList(result || {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
    }));
  } finally {
    dispatch(setLoadingBurntList(false));
  }
};

export const fetchBurntListCount = (chain) => async (dispatch) => {
  const {result} = await api.fetch(`/${chain}/burnt/count`);
  dispatch(setBurntListCount(result || 0));
};

export const fetchTreasury = (chain) => async (dispatch) => {
  const api = await getApi(chain);
  const account = (
    await api.query.system.account(TreasuryAccount)
  ).toJSON();
  const result = {
    free: account ? toPrecision(account.data.free, getPrecision(symbolFromNetwork(chain)), false) : 0,
    burnPercent: toPrecision(api.consts.treasury.burn, 6, false),
  }
  dispatch(setTreasury(result));
}

export const burntListSelector = (state) => state.burnt.burntList;
export const burntChartSelector = (state) => state.burnt.burntChart;
export const loadingBurntListSelector = (state) => state.burnt.loadingBurntList;
export const burntListCountSelector = (state) => state.burnt.burntListCount;
export const treasurySelector = (state) => state.burnt.treasury;

export default burntSlice.reducer;
