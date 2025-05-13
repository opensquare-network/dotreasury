import { createSlice } from "@reduxjs/toolkit";
import api from "../../services/scanApi";
import { RangeTypes } from "../../components/Filter/Range";
import { find } from "lodash-es";
import {
  kusamaTreasurySpendsAssetsFilterOptions,
  polkadotTreasurySpendsAssetsFilterOptions,
} from "../../constants";

const name = "treasurySpends";

const treasurySpendsSlice = createSlice({
  name,
  initialState: {
    treasurySpendsList: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
    },
    loadingTreasurySpendsList: false,
    treasurySpendsListCount: 0,
    totalExpenditure: 0,
    loadingTotalExpenditure: false,
  },
  reducers: {
    setTreasurySpendsList(state, action) {
      state.treasurySpendsList = action.payload;
    },
    setLoadingTreasurySpendsList(state, action) {
      state.loadingTreasurySpendsList = action.payload;
    },
    setTreasurySpendsListCount(state, action) {
      state.treasurySpendsListCount = action.payload;
    },
    setTotalExpenditure(state, action) {
      state.totalExpenditure = action.payload;
    },
    setLoadingTotalExpenditure(state, action) {
      state.loadingTotalExpenditure = action.payload;
    },
  },
});

export const fetchTreasurySpendsList = (
  page = 0,
  pageSize = 30,
  params = {},
  options = {},
) => {
  return async (dispatch, getState) => {
    const {
      chain: { chain },
    } = getState();

    dispatch(setLoadingTreasurySpendsList(true));

    const treasurySpendsAssetsFilterOptions =
      chain === "polkadot"
        ? polkadotTreasurySpendsAssetsFilterOptions
        : kusamaTreasurySpendsAssetsFilterOptions;

    const filterAsset = params?.asset;
    const asset =
      find(treasurySpendsAssetsFilterOptions, { value: filterAsset })?.asset ||
      filterAsset ||
      "";

    try {
      const { result } = await api.fetch(
        "/v2/treasury/spends",
        {
          page,
          pageSize,
          range_type: RangeTypes.Fiat,
          ...params,
          asset,
        },
        options,
      );
      dispatch(
        setTreasurySpendsList(
          result || {
            items: [],
            page: 0,
            pageSize: 10,
            total: 0,
          },
        ),
      );
    } finally {
      dispatch(setLoadingTreasurySpendsList(false));
    }
  };
};

export const fetchTreasurySpendsTotalExpenditure = () => {
  return async (dispatch) => {
    dispatch(setLoadingTotalExpenditure(true));
    try {
      const { result } = await api.fetch(
        "/v2/treasury/spends/total-expenditure",
      );
      dispatch(setTotalExpenditure(result?.totalFiatValue || 0));
    } finally {
      dispatch(setLoadingTotalExpenditure(false));
    }
  };
};

export const {
  setTreasurySpendsList,
  setLoadingTreasurySpendsList,
  setTreasurySpendsListCount,
  setTotalExpenditure,
  setLoadingTotalExpenditure,
} = treasurySpendsSlice.actions;

export const treasurySpendsListSelector = (state) =>
  state[name].treasurySpendsList;
export const loadingTreasurySpendsListSelector = (state) =>
  state[name].loadingTreasurySpendsList;
export const treasurySpendsListCountSelector = (state) =>
  state[name].treasurySpendsListCount;
export const totalExpenditureSelector = (state) => state[name].totalExpenditure;
export const loadingTotalExpenditureSelector = (state) =>
  state[name].loadingTotalExpenditure;

export default treasurySpendsSlice.reducer;
