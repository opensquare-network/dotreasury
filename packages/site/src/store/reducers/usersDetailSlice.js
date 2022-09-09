// page `/:symbol/users/:address`
// api file `/server/src/features/profile/routes.js`

import { createSlice } from "@reduxjs/toolkit";
import api from "../../services/scanApi";

const usersDetailSlice = createSlice({
  name: "usersDetail",
  initialState: {
    detail: null,
    loading: false,
    counts: {},
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
  },
});

export const { setLoading, setUsersDetail, setCounts } =
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
  try {
    const { result } = await api.fetch(
      `/${chain}/account/${address}/${role}/counts`
    );
    dispatch(setCounts(result));
  } finally {
  }
};
export const resetUsersCounts = () => (dispatch) => {
  dispatch(setCounts({}));
};

export const usersDetailSelector = (state) => state.usersDetail.detail;
export const loadingSelector = (state) => state.usersDetail.loading;
export const countsSelector = (state) => state.usersDetail.counts;

export default usersDetailSlice.reducer;
