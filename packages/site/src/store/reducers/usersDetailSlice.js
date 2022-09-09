// page `/:symbol/users/:address`
// api file `/server/src/features/profile/routes.js`

import { createSlice } from "@reduxjs/toolkit";
import api from "../../services/scanApi";

const usersDetailSlice = createSlice({
  name: "usersDetail",
  initialState: {
    detail: null,
    loading: false,
  },
  reducers: {
    setUsersDetail(state, { payload }) {
      state.detail = payload;
    },
    setLoading(state, { payload }) {
      state.loading = payload;
    },
  },
});

export const { setLoading, setUsersDetail } = usersDetailSlice.actions;

export const fetchUsersDetail = (chain, address) => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    const { result } = await api.fetch(`/${chain}/participants/${address}`);
    dispatch(setUsersDetail(result || {}));
  } finally {
    dispatch(setLoading(false));
  }
};

export const usersDetailSelector = (state) => state.usersDetail.detail;
export const loadingSelector = (state) => state.usersDetail.loading;

export default usersDetailSlice.reducer;
