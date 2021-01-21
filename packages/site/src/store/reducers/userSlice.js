import { createSelector, createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
  },
  reducers: {
    setLoggedInUser(state, { payload }) {
      state.user = payload;
    },
  }
});

export const {
  setLoggedInUser,
} = userSlice.actions

export const loggedInUserSelector = state => state.user.user;
export const isLoggedInSelector = createSelector(userSelector, user => !!user);

export default userSlice.reducer;
