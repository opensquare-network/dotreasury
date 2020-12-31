import { createSelector, createSlice } from '@reduxjs/toolkit'

const accountSlice = createSlice({
  name: 'account',
  initialState: {
    account: null,
  },
  reducers: {
    setAccount(state, { payload }) {
      state.account = payload;
    },
    removeAccount(state) {
      state.account = null;
    }
  }
});

export const {
  setAccount,
  removeAccount,
} = accountSlice.actions

export const accountSelector = state => state.account.account;
export const isLoginSelector = createSelector(accountSelector, account => !!account);
export const nowAddressSelector = state => state.account.account?.address;

export default accountSlice.reducer;
