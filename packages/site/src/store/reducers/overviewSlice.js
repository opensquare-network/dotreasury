import { createSlice } from "@reduxjs/toolkit";
import api from "../../services/scanApi";

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
        burnt: {
          all: 0,
        },
        transfer: {
          all: 0,
        },
      },
      output: {
        bounty: 0,
        proposal: 0,
        tip: 0,
        burnt: 0,
        transfer: 0,
      },
      income: {
        inflation: 0,
        others: 0,
        slash: 0,
        slashSeats: {
          democracy: 0,
          electionsPhragmen: 0,
          identity: 0,
          staking: 0,
          treasury: 0,
        },
      },
    },
    statsHistory: [],
  },
  reducers: {
    setOverview(state, { payload }) {
      state.overview = payload;
    },
    setStatsHistory(state, { payload }) {
      state.statsHistory = payload;
    },
  },
});

export const { setOverview, setStatsHistory } = overviewSlice.actions;

export const fetchStatsHistory = (chain) => async (dispatch) => {
  const { result } = await api.fetch(`/${chain}/stats/weekly`);
  dispatch(setStatsHistory(result || []));
};

export const totalProposalCountSelector = (state) =>
  state.overview.overview.count.proposal.all;
export const totalTipCountSelector = (state) =>
  state.overview.overview.count.tip.all;
export const totalBountyCountSelector = (state) =>
  state.overview.overview.count.bounty.all;
export const totalBurntCountSelector = (state) =>
  state.overview.overview.count.burnt.all;
export const totalTransferCountSelector = (state) =>
  state.overview.overview.count.transfer.all;
export const overviewSelector = (state) => state.overview.overview;
export const statsHistorySelector = (state) => state.overview.statsHistory;

export default overviewSlice.reducer;
