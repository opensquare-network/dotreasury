// page `/:symbol/users/:address`
// api file `/server/src/features/profile/routes.js`

import { createSlice } from "@reduxjs/toolkit";
import api from "../../services/scanApi";

const usersDetailSlice = createSlice({
  name: "usersDetail",
  initialState: {
    detail: null,
    loading: false,
    counts: null,
    countsLoading: false,
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
  },
});

export const { setLoading, setUsersDetail, setCounts, setCountsLoading } =
  usersDetailSlice.actions;

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

export const usersDetailSelector = (state) => state.usersDetail.detail;
export const loadingSelector = (state) => state.usersDetail.loading;
export const countsSelector = (state) => state.usersDetail.counts;
export const countsLoadingSelector = (state) => state.usersDetail.countsLoading;

export default usersDetailSlice.reducer;

function makeUsersProposalsApiUrl(chain, address, role, extra = "") {
  return `/${chain}/account/${address}/${role}${extra}`;
}
