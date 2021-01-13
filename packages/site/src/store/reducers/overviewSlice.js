import { createSlice } from "@reduxjs/toolkit";

const overviewSlice = createSlice({
  name: "overview",
  initialState: {
    overview: null,
  },
  reducers: {
    setOverview(state, { payload }) {
      state.overview = payload;
    },
  },
});

export const { setOverview } = overviewSlice.actions;
export default overviewSlice.reducer;
