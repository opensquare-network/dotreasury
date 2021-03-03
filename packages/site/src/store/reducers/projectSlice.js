import { createSlice } from "@reduxjs/toolkit";
import api from "../../services/scanApi";

const projectSlice = createSlice({
  name: "projects",
  initialState: {
    projects: {
      items: []
    },
    loading: false,
    projectDetail: {},
    loadingProjectDetail: false,
  },
  reducers: {
    setProjects(state, { payload }) {
      state.projects = payload;
    },
    setLoading(state, { payload }) {
      state.loading = payload;
    },
    setProjectDetail(state, { payload }) {
      state.projectDetail = payload;
    },
    setLoadingProjectDetail(state, { payload }) {
      state.loadingProjectDetail = payload;
    }
  },
});

export const {
  setProjects,
  setLoading,
  setProjectDetail,
  setLoadingProjectDetail
} = projectSlice.actions;

export const fetchProjects = () => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    const { result } = await api.fetch('/projects');
    dispatch(setProjects(result || {}));
  } finally {
    dispatch(setLoading(false));
  }
};

// export const fetchProposalsCount = () => async (dispatch) => {
//   const { result } = await api.fetch("/proposals/count");
//   dispatch(setProposalsCount(result || 0));
// };

// export const fetchProposalDetail = (proposalIndex) => async (dispatch) => {
//   dispatch(setLoadingProposalDetail(true));
//   try {
//     const { result } = await api.fetch(`/proposals/${proposalIndex}`);
//     dispatch(setProposalDetail(result || {}));
//   } finally {
//     dispatch(setLoadingProposalDetail(false));
//   }
// };

// export const fetchProposalsSummary = () => async (dispatch) => {
//   const { result } = await api.fetch("/proposals/summary");
//   const summary = {
//     total: 0,
//     numOfOngoing: 0,
//     numOfApproved: 0,
//     numOfAwarded: 0,
//   };
//   if (result) {
//     summary.total = result.total;
//     summary.numOfOngoing = (result.Proposed || 0) + (result.ApproveVoting || 0) + (result.RejectVoting || 0);
//     summary.numOfApproved = result.Approved || 0;
//     summary.numOfAwarded = result.Awarded || 0;
//   }
//   dispatch(setProposalSummary(summary));
// };

export const projectsSelector = (state) => state.projects.projects;
export const loadingSelector = (state) => state.projects.loading;
// export const proposalsCountSelector = (state) => state.proposals.proposalsCount;
// export const proposalDetailSelector = (state) => state.proposals.proposalDetail;
// export const loadingProposalDetailSelector = (state) => state.proposals.loadingProposalDetail;
// export const proposalSummarySelector = (state) => state.proposals.proposalSummary;

export default projectSlice.reducer;
