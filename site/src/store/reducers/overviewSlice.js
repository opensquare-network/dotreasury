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
        childBounty: {
          unFinished: 0,
          all: 0,
        },
        proposal: {
          unFinished: 0,
          all: 0,
          openGov: 0,
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
        referenda: {
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
    spendPeriods: [],
    topBeneficiaries: [], // beneficiaries by all kinds of spends
  },
  reducers: {
    setOverview(state, { payload }) {
      state.overview = payload;
    },
    setStatsHistory(state, { payload }) {
      state.statsHistory = payload;
    },
    setSendPeriods(state, { payload }) {
      state.spendPeriods = payload;
    },
    setTopBeneficiaries(state, { payload }) {
      state.topBeneficiaries = payload;
    }
  },
});

export const {
  setOverview,
  setStatsHistory,
  setSendPeriods,
  setTopBeneficiaries,
} = overviewSlice.actions;

export const fetchStatsHistory = () => async (dispatch) => {
  const { result } = await api.fetch("/stats/weekly");
  dispatch(setStatsHistory(result || []));
};

export const fetchSpendPeriods = () => async (dispatch) => {
  const { result } = await api.fetch("/periods");
  dispatch(setSendPeriods(result || []));
};

export const fetchTopBeneficiaries = () => async (dispatch) => {
  const { result } = await api.fetch("/participants", { role: "beneficiary" });
  dispatch(setTopBeneficiaries(result?.items));
}

export const totalProposalCountSelector = (state) =>
  state.overview.overview.count.proposal.all;
export const openGovProposalCountSelector = (state) =>
  state.overview.overview.count.proposal.openGov;
export const gov1ProposalCountSelector = (state) =>
  state.overview.overview.count.proposal.all -
  state.overview.overview.count.proposal.openGov;
export const totalTipCountSelector = (state) =>
  state.overview.overview.count.tip.all;
export const totalBountyCountSelector = (state) =>
  state.overview.overview.count.bounty.all;
export const totalChildBountyCountSelector = (state) =>
  state.overview.overview.count.childBounty.all;
export const totalBurntCountSelector = (state) =>
  state.overview.overview.count.burnt.all;
export const totalTransferCountSelector = (state) =>
  state.overview.overview.count.transfer.all;
export const totalOpenGovApplicationCountSelector = (state) =>
  state.overview.overview.count.referenda.all || 0;
export const overviewSelector = (state) => state.overview.overview;
export const statsHistorySelector = (state) => state.overview.statsHistory;
export const spendPeriodsSelector = (state) => state.overview.spendPeriods;
export const topBeneficiariesSelector = (state) => state.overview.topBeneficiaries;

export default overviewSlice.reducer;
