import { createSlice } from "@reduxjs/toolkit";
import api from "../../services/scanApi";

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
  },
});

export const fetchTreasurySpendsList = (
  page = 0,
  pageSize = 30,
  filterData = {},
  sort = {},
) => {
  return async (dispatch) => {
    dispatch(setLoadingTreasurySpendsList(true));
    try {
      const { result } = await api.fetch("/v2/treasury/spends", {
        page,
        pageSize,
        ...filterData,
        ...sort,
      });
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

export const {
  setTreasurySpendsList,
  setLoadingTreasurySpendsList,
  setTreasurySpendsListCount,
} = treasurySpendsSlice.actions;

export const treasurySpendsListSelector = (state) =>
  state[name].treasurySpendsList;
export const loadingTreasurySpendsListSelector = (state) =>
  state[name].loadingTreasurySpendsList;
export const treasurySpendsListCountSelector = (state) =>
  state[name].treasurySpendsListCount;

export default treasurySpendsSlice.reducer;
