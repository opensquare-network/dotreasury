// page `/:symbol/users/:address`
// api file `/server/src/features/profile/routes.js`

import { createSlice } from "@reduxjs/toolkit";
import api from "../../services/scanApi";

const usersDetailSlice = createSlice({
  name: "usersDetail",
  initialState: {
    counts: null,
    countsLoading: false,
  },
  reducers: {
    setCounts(state, { payload }) {
      state.counts = payload;
    },
    setCountsLoading(state, { payload }) {
      state.countsLoading = payload;
    },
  },
});

export const { setCounts, setCountsLoading } = usersDetailSlice.actions;

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

export const usersCountsSelector = (state) => state.usersDetail.counts;
export const countsLoadingSelector = (state) => state.usersDetail.countsLoading;

export default usersDetailSlice.reducer;

function makeUsersProposalsApiUrl(chain, address, role, endpoint = "") {
  return `/${chain}/account/${address}/${role}${endpoint}`;
}
