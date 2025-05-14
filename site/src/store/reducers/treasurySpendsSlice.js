import { createSlice } from "@reduxjs/toolkit";
import api from "../../services/subsquareApi";

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
    treasurySpendsCount: 0,
    totalExpenditure: 0,
    loadingTotalExpenditure: false,
  },
  reducers: {
    setTreasurySpendsCount(state, action) {
      state.treasurySpendsCount = action.payload;
    },
    setTreasurySpendsList(state, action) {
      state.treasurySpendsList = action.payload;
    },
    setLoadingTreasurySpendsList(state, action) {
      state.loadingTreasurySpendsList = action.payload;
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
  return async (dispatch) => {
    dispatch(setLoadingTreasurySpendsList(true));

    try {
      const { result } = await api.fetch(
        "/treasury/spends",
        {
          page,
          pageSize,
          ...params,
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

export const fetchTreasurySpendsCount = () => {
  return async (dispatch) => {
    try {
      const { result } = await api.fetch("/treasury/spends");
      dispatch(setTreasurySpendsCount(result?.total || 0));
    } finally {
    }
  };
};

export const {
  setTreasurySpendsList,
  setLoadingTreasurySpendsList,
  setTotalExpenditure,
  setLoadingTotalExpenditure,
  setTreasurySpendsCount,
} = treasurySpendsSlice.actions;

export const treasurySpendsListSelector = (state) =>
  state[name].treasurySpendsList;
export const loadingTreasurySpendsListSelector = (state) =>
  state[name].loadingTreasurySpendsList;
export const treasurySpendsCountSelector = (state) =>
  state[name].treasurySpendsCount;
export const totalExpenditureSelector = (state) => state[name].totalExpenditure;
export const loadingTotalExpenditureSelector = (state) =>
  state[name].loadingTotalExpenditure;

export default treasurySpendsSlice.reducer;
