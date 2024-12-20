import { createSlice } from "@reduxjs/toolkit";
import { EMPTY_TABLE_DATA } from "../../constants";
import api from "../../services/scanApi";

const proposalSlice = createSlice({
  name: "proposals",
  initialState: {
    proposals: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
    },
    loading: false,
    failedProposals: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
    },
    failedProposalsLoading: false,
    proposalDetail: {},
    loadingProposalDetail: false,
    proposalSummary: {
      total: 0,
      numOfOngoing: 0,
      numOfApproved: 0,
      numOfAwarded: 0,
    },
  },
  reducers: {
    setProposals(state, { payload }) {
      state.proposals = payload;
    },
    setLoading(state, { payload }) {
      state.loading = payload;
    },
    setFailedProposals(state, { payload }) {
      state.failedProposals = payload;
    },
    setFailedProposalsLoading(state, { payload }) {
      state.failedProposalsLoading = payload;
    },
    setProposalDetail(state, { payload }) {
      state.proposalDetail = payload;
    },
    setLoadingProposalDetail(state, { payload }) {
      state.loadingProposalDetail = payload;
    },
    setProposalSummary(state, { payload }) {
      state.proposalSummary = payload;
    },
  },
});

export const {
  setProposals,
  setLoading,
  setFailedProposals,
  setFailedProposalsLoading,
  setProposalDetail,
  setLoadingProposalDetail,
  setProposalSummary,
} = proposalSlice.actions;

export const fetchProposals =
  (page = 0, pageSize = 30, params, options = {}) =>
  async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const { result } = await api.fetch(
        "/proposals",
        {
          page,
          pageSize,
          ...params,
        },
        options,
      );
      dispatch(setProposals(result || {}));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const fetchFailedProposals =
  (page = 0, pageSize = 30, params, options = {}) =>
  async (dispatch) => {
    dispatch(setFailedProposalsLoading(true));

    try {
      const { result } = await api.fetch(
        "/proposals/failed",
        {
          page,
          pageSize,
          ...params,
        },
        options,
      );
      dispatch(setFailedProposals(result || {}));
    } finally {
      dispatch(setFailedProposalsLoading(false));
    }
  };

export const resetProposals = () => (dispatch) => {
  dispatch(setProposals(EMPTY_TABLE_DATA));
  dispatch(setFailedProposals(EMPTY_TABLE_DATA));
};

export const fetchProposalDetail = (proposalIndex) => async (dispatch) => {
  dispatch(setLoadingProposalDetail(true));
  try {
    const { result } = await api.fetch(`/proposals/${proposalIndex}`);
    dispatch(setProposalDetail(result || {}));
  } finally {
    dispatch(setLoadingProposalDetail(false));
  }
};

export const fetchProposalsSummary = () => async (dispatch) => {
  const { result } = await api.fetch("/proposals/summary");
  const summary = {
    total: 0,
    numOfOngoing: 0,
    numOfApproved: 0,
    numOfAwarded: 0,
  };
  if (result) {
    summary.total = result.total;
    summary.numOfOngoing =
      (result.Proposed || 0) +
      (result.ApproveVoting || 0) +
      (result.RejectVoting || 0);
    summary.numOfApproved = result.Approved || 0;
    summary.numOfAwarded = result.Awarded || 0;
  }
  dispatch(setProposalSummary(summary));
};

export const proposalListSelector = (state) => state.proposals.proposals;
export const loadingSelector = (state) => state.proposals.loading;
export const failedProposalListSelector = (state) =>
  state.proposals.failedProposals;
export const failedProposalsLoadingSelector = (state) =>
  state.proposals.failedProposalsLoading;
export const proposalDetailSelector = (state) => state.proposals.proposalDetail;
export const loadingProposalDetailSelector = (state) =>
  state.proposals.loadingProposalDetail;
export const proposalSummarySelector = (state) =>
  state.proposals.proposalSummary;

export default proposalSlice.reducer;
