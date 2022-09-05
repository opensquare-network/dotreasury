import { createSelector, createSlice } from '@reduxjs/toolkit'
import { encodeChainAddress } from '../../services/chainApi';

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

export const checkAccount = () => async (dispatch) => {
  const store = (await import("..")).default;
  const account = store.getState().account.account;
  if (!account) {
    return;
  }

  const extension = window?.injectedWeb3?.[account.extension];
  if (!extension) {
    dispatch(setAccount(null));
    return;
  }

  let wallet;
  try {
    wallet = await extension.enable("doTreasury");
  } catch (e) {
    console.error(e);
    dispatch(setAccount(null));
    return;
  }

  const extensionAccounts = await wallet.accounts?.get();

  if (
    !extensionAccounts.some(item => {
      return item.address === encodeChainAddress(account.address)
    })
  ) {
    dispatch(setAccount(null));
    return;
  }
}

export default accountSlice.reducer;
