// page `/:symbol/users/:address`
// api file `/server/src/features/profile/routes.js`

import { createSlice } from "@reduxjs/toolkit";
import { noop } from "lodash";
import api from "../../services/scanApi";

const usersDetailSlice = createSlice({
  name: "usersDetail",
  initialState: {
    detail: null,
    loading: false,
    counts: null,
    countsLoading: false,

    // proposals table data
    proposalsTips: {},
    proposalsBounties: {},
    proposalsChildBounties: {},
    proposalsProposals: {},
    proposalsLoading: false,
  },
  reducers: {
    setUsersDetail(state, { payload }) {
      state.detail = payload;
    },
    setLoading(state, { payload }) {
      state.loading = payload;
    },
    setCounts(state, { payload }) {
      state.counts = payload;
    },
    setCountsLoading(state, { payload }) {
      state.countsLoading = payload;
    },
    setProposalsTips(state, { payload }) {
      state.proposalsTips = payload;
    },
    setProposalsBounties(state, { payload }) {
      state.proposalsBounties = payload;
    },
    setProposalsProposals(state, { payload }) {
      state.proposalsProposals = payload;
    },
    setProposalsChildBounties(state, { payload }) {
      state.proposalsChildBounties = payload;
    },
    setProposalsLoading(state, { payload }) {
      state.proposalsLoading = payload;
    },
  },
});

export const {
  setLoading,
  setUsersDetail,
  setCounts,
  setCountsLoading,
  setProposalsTips,
  setProposalsBounties,
  setProposalsChildBounties,
  setProposalsProposals,
  setProposalsLoading,
} = usersDetailSlice.actions;

export const fetchUsersDetail = (chain, address) => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    const { result } = await api.fetch(`/${chain}/participants/${address}`);
    dispatch(setUsersDetail(result || {}));
  } finally {
    dispatch(setLoading(false));
  }
};

/**
 * @description fetch user counts
 */
export const fetchUsersCounts = (chain, address, role) => async (dispatch) => {
  dispatch(setCountsLoading(true));
  try {
    const { result } = await api.fetch(
      makeUsersProposalsApiUrl(chain, address, role, "/counts")
    );
    dispatch(setCounts(result));
  } finally {
    dispatch(setCountsLoading(false));
  }
};
export const resetUsersCounts = () => (dispatch) => {
  dispatch(setCounts(null));
};

export const fetchUsersProposalsTips = makeFetchUsersProposalsTableList(
  "/tips",
  setProposalsTips
);
export const fetchUsersProposalsBounties = makeFetchUsersProposalsTableList(
  "/bounties",
  setProposalsBounties
);
export const fetchUsersProposalsChildBounties =
  makeFetchUsersProposalsTableList(
    "/child-bounties",
    setProposalsChildBounties
  );
export const fetchUsersProposalsProposals = makeFetchUsersProposalsTableList(
  "/proposals",
  setProposalsProposals
);

export const resetUsersProposals = () => (dispatch) => {
  dispatch(setProposalsTips({}));
  dispatch(setProposalsBounties({}));
  dispatch(setProposalsChildBounties({}));
  dispatch(setProposalsProposals({}));
};

export const usersDetailSelector = (state) => state.usersDetail.detail;
export const loadingSelector = (state) => state.usersDetail.loading;
export const usersCountsSelector = (state) => state.usersDetail.counts;
export const countsLoadingSelector = (state) => state.usersDetail.countsLoading;

export const proposalsTipsSelector = (state) => state.usersDetail.proposalsTips;
export const proposalsBountiesSelector = (state) =>
  state.usersDetail.proposalsBounties;
export const proposalsChildBountiesSelector = (state) =>
  state.usersDetail.proposalsChildBounties;
export const proposalsLoadingSelector = (state) =>
  state.usersDetail.proposalsLoading;

export default usersDetailSlice.reducer;

function makeUsersProposalsApiUrl(chain, address, role, endpoint = "") {
  return `/${chain}/account/${address}/${role}${endpoint}`;
}

function makeFetchUsersProposalsTableList(
  endpoint = "",
  resultDataSetter = noop
) {
  return (chain, address, role, page, pageSize) => {
    return async (dispatch) => {
      dispatch(setProposalsLoading(true));

      try {
        const { result } = await api.fetch(
          makeUsersProposalsApiUrl(chain, address, role, endpoint),
          { page, pageSize }
        );
        dispatch(resultDataSetter(result));
      } finally {
        dispatch(setProposalsLoading(false));
      }
    };
  };
}
