import { createSlice } from "@reduxjs/toolkit";
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
    proposalsCount: 0,
    loading: false,
    proposalDetail: {},
    loadingProposalDetail: false,
  },
  reducers: {
    setProposals(state, { payload }) {
      state.proposals = payload;
    },
    setLoading(state, { payload }) {
      state.loading = payload;
    },
    setProposalsCount(state, { payload }) {
      state.proposalsCount = payload;
    },
    setProposalDetail(state, { payload }) {
      state.proposalDetail = payload;
    },
    setLoadingProposalDetail(state, { payload }) {
      state.loadingproposalDetail = payload;
    },
  },
});

export const {
  setProposals,
  setLoading,
  setProposalsCount,
  setProposalDetail,
  setLoadingProposalDetail,
} = proposalSlice.actions;

export const fetchProposals = (page = 0, pageSize = 30) => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    const { result } = await api.fetch('/proposals', { page, pageSize });
    dispatch(setProposals(result || {}));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchProposalsCount = () => async (dispatch) => {
  const { result } = await api.fetch("/proposals/count");
  dispatch(setProposalsCount(result || 0));
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

export const proposalListSelector = (state) => state.proposals.proposals;
export const loadingSelector = (state) => state.proposals.loading;
export const proposalsCountSelector = (state) => state.proposals.proposalsCount;
export const proposalDetailSelector = (state) => state.proposals.proposalDetail;
export const loadingProposalDetailSelector = (state) => state.proposals.loadingProposalDetail;

export default proposalSlice.reducer;
