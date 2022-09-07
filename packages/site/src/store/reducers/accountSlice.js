import { web3Enable } from '@polkadot/extension-dapp';
import { createSelector, createSlice } from '@reduxjs/toolkit'
import { encodeChainAddress, encodeSubstrateAddress } from '../../services/chainApi';
import { sleep } from '../../utils';
import { substrateWeb3Accounts } from '../../utils/extension';

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

  await sleep(2000);

  if (account.extension === "other") {
    await web3Enable("doTreasury");
    const accounts = await substrateWeb3Accounts();
    if (!accounts.some(item => item.address === encodeSubstrateAddress(account.address))) {
      dispatch(setAccount(null));
    }
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
