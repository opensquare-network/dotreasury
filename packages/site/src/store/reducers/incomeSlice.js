import { createSlice } from "@reduxjs/toolkit";
import api from "../../services/scanApi";

const incomeSlice = createSlice({
  name: "income",
  initialState: {
    democracySlashList: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
    },
    treasurySlashList: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
    },
    identitySlashList: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
    },
    electionPhragmenSlashList: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
    },
    stakingSlashList: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
    },
    inflationList: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
    },
    count: {
      treasurySlash: 0,
      democracySlash: 0,
      identitySlash: 0,
      electionPhragmenSlash: 0,
      stakingSlash: 0,
      inflation: 0,
    },
  },
  reducers: {
    setCount(state, { payload }) {
      state.count = payload;
    },
  },
});

export const { setCount } = incomeSlice.actions;

export const fetchIncomeCount = () => async (dispatch) => {
  const { result } = await api.fetch(`/income/count`);
  dispatch(
    setCount(
      result || {
        treasurySlash: 0,
        democracySlash: 0,
        identitySlash: 0,
        electionPhragmenSlash: 0,
        stakingSlash: 0,
        inflation: 0,
      }
    )
  );
};

export const incomeCountSelector = (state) => state.income.count;

export default incomeSlice.reducer;
