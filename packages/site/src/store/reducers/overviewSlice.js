import { createSlice } from "@reduxjs/toolkit";

const overviewSlice = createSlice({
  name: "overview",
  initialState: {
    overview: {
      bestProposalBeneficiaries: [],
      bestTipFinders: [],
      count: {
        bounty: {
          unFinished: 0,
          all: 0,
        },
        proposal: {
          unFinished: 0,
          all: 0,
        },
        tip: {
          unFinished: 0,
          all: 0,
        },
      },
      spent: {
        bounty: 0,
        proposal: 0,
        tip: 0,
      },
    },
  },
  reducers: {
    setOverview(state, { payload }) {
      state.overview = payload;
    },
  },
});

export const { setOverview } = overviewSlice.actions;
export default overviewSlice.reducer;
