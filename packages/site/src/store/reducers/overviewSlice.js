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

export const totalProposalCountSelector = (state) =>
  state.overview.overview.count.proposal.all;
export const totalTipCountSelector = (state) =>
  state.overview.overview.count.tip.all;
export const totalBountyCountSelector = (state) =>
  state.overview.overview.count.bounty.all;

export default overviewSlice.reducer;
