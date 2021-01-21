import { createSelector, createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'users',
  initialState: {
    loggedInUser: JSON.parse(localStorage.getItem('loggedInUser'))
  },
  reducers: {
    setLoggedInUser(state, { payload }) {
      state.loggedInUser = payload;
      if (payload === null) {
        localStorage.removeItem('loggedInUser');
      } else {
        localStorage.setItem('loggedInUser', JSON.stringify(payload));
      }
    },
  }
});

export const {
  setLoggedInUser,
} = userSlice.actions

export const loggedInUserSelector = state => state.users.loggedInUser;
export const accessTokenSelector = createSelector(loggedInUserSelector, user => user?.accessToken);
export const isLoggedInSelector = createSelector(loggedInUserSelector, user => !!user);

export default userSlice.reducer;
