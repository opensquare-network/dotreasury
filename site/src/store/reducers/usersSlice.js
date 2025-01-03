// state.users
// page `/:symbol/users`

import { createSlice } from "@reduxjs/toolkit";
import api from "../../services/scanApi";

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: {
      items: [],
      total: 0,
    },
    loading: false,
  },
  reducers: {
    setUsers(state, { payload }) {
      state.users = payload;
    },
    setLoading(state, { payload }) {
      state.loading = payload;
    },
  },
});

export const { setLoading, setUsers } = usersSlice.actions;

export const fetchUsers =
  (page, pageSize, params, options = {}) =>
  async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const { result } = await api.fetch(
        "/participants",
        {
          page,
          pageSize,
          ...params,
        },
        options,
      );
      dispatch(setUsers(result || {}));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const usersSelector = (state) => state.users.users;
export const loadingSelector = (state) => state.users.loading;

export default usersSlice.reducer;
