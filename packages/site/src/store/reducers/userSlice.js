import { createSelector, createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'users',
  initialState: {
    loggedInUser: null
  },
  reducers: {
    setLoggedInUser(state, { payload }) {
      state.loggedInUser = payload;
      if (payload === null) {
        localStorage.removeItem('token');
      } else {
        localStorage.setItem('token', payload.accessToken);
      }
    },
  }
});

export const {
  setLoggedInUser,
} = userSlice.actions

export const loggedInUserSelector = state => state.users.loggedInUser;
export const isLoggedInSelector = createSelector(loggedInUserSelector, loggedInUser => !!loggedInUser);

export default userSlice.reducer;
