import { createSelector, createSlice } from '@reduxjs/toolkit'

const storeAccount = localStorage.getItem("account");
const account = storeAccount && JSON.parse(storeAccount);

const accountSlice = createSlice({
  name: 'account',
  initialState: {
    account,
  },
  reducers: {
    setAccount(state, { payload }) {
      state.account = payload;
      localStorage.setItem(
        "account",
        JSON.stringify(payload)
      );
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

export const logout = () => (dispatch) => {
  dispatch(setAccount(null));
  localStorage.removeItem("account");
};

export default accountSlice.reducer;
