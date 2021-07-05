import { createSelector, createSlice } from "@reduxjs/toolkit";
import api from "../../services/scanApi";
import { encodeSubstrateAddress } from "../../services/chainApi";

const userSlice = createSlice({
  name: "users",
  initialState: {
    loggedInUser: JSON.parse(localStorage.getItem("loggedInUser")),
    userProfile: null,
    verifyEmailSendTime: 0,
  },
  reducers: {
    setLoggedInUser(state, { payload }) {
      state.loggedInUser = payload;
      if (payload === null) {
        localStorage.removeItem("loggedInUser");
      } else {
        localStorage.setItem("loggedInUser", JSON.stringify(payload));
      }
    },
    setUserProfile(state, { payload }) {
      state.userProfile = payload;
    },
    setVerifyEmailSendTime(state, { payload }) {
      state.verifyEmailSendTime = payload;
    },
  },
});

export const {
  setLoggedInUser,
  setUserProfile,
  setVerifyEmailSendTime,
} = userSlice.actions;

export const fetchUserProfile = () => async (dispatch) => {
  const { result } = await api.authFetch("/user/profile");
  if (result?.addresses?.length > 0) {
    result.addresses = result.addresses.map((addr) => ({
      ...addr,
      wildcardAddress: encodeSubstrateAddress(addr.address),
    }));
  }
  dispatch(setUserProfile(result || null));
};

export const loggedInUserSelector = (state) => state.users.loggedInUser;
export const isLoggedInSelector = createSelector(
  loggedInUserSelector,
  (user) => !!user
);
export const userProfileSelector = (state) => state.users.userProfile;
export const verifyEmailSendTimeSelector = (state) =>
  state.users.verifyEmailSendTime;

export default userSlice.reducer;
