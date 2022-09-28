// page `/:symbol/users/:address`
// api file `/server/src/features/profile/routes.js`

import { createSlice } from "@reduxjs/toolkit";
import api from "../../services/scanApi";

const usersDetailSlice = createSlice({
  name: "usersDetail",
  initialState: {
    counts: null,
    countsLoading: false,
    // councilor
    councilorShip: null,
    councilorShipLoading: false,
    motionAttendance: null,
    motionAttendanceLoading: false,
    tipAttendance: null,
    tipAttendanceLoading: false,
  },
  reducers: {
    setCounts(state, { payload }) {
      state.counts = payload;
    },
    setCountsLoading(state, { payload }) {
      state.countsLoading = payload;
    },
    setCouncilorShip(state, { payload }) {
      state.councilorShip = payload;
    },
    setCouncilorShipLoading(state, { payload }) {
      state.councilorShipLoading = payload;
    },
    setMotionAttendance(state, { payload }) {
      state.motionAttendance = payload;
    },
    setMotionAttendanceLoading(state, { payload }) {
      state.motionAttendanceLoading = payload;
    },
    setTipAttendance(state, { payload }) {
      state.tipAttendance = payload;
    },
    setTipAttendanceLoading(state, { payload }) {
      state.tipAttendanceLoading = payload;
    },
  },
});

export const {
  setCounts,
  setCountsLoading,
  setCouncilorShip,
  setCouncilorShipLoading,
  setMotionAttendance,
  setMotionAttendanceLoading,
  setTipAttendance,
  setTipAttendanceLoading,
} = usersDetailSlice.actions;

/**
 * @description fetch user counts
 */
export const fetchUsersCounts = (chain, address, role) => async (dispatch) => {
  dispatch(setCountsLoading(true));
  try {
    const { result } = await api.fetch(
      makeApiUrl(chain, address, role, "/counts")
    );
    dispatch(setCounts(result));
  } finally {
    dispatch(setCountsLoading(false));
  }
};
export const resetUsersCounts = () => (dispatch) => {
  dispatch(setCounts(null));
};

export const fetchCouncilorShipTerms = (chain, address) => async (dispatch) => {
  dispatch(setCouncilorShipLoading(true));
  try {
    const { result } = await api.fetch(
      makeApiUrl(chain, address, "councilor", "/terms")
    );
    dispatch(setCouncilorShip(result));
  } finally {
    dispatch(setCouncilorShipLoading(false));
  }
};
export const resetCouncilorShipTerms = makeReset(setCouncilorShip, null);

export const fetchMotionAttendance = (chain, address) => async (dispatch) => {
  dispatch(setMotionAttendanceLoading(true));
  try {
    const { result } = await api.fetch(
      makeApiUrl(chain, address, "councilor", "/motions")
    );
    dispatch(setMotionAttendance(result));
  } finally {
    dispatch(setMotionAttendanceLoading(false));
  }
};
export const resetMotionAttendance = makeReset(setMotionAttendance, null);

export const fetchTipAttendance = (chain, address) => async (dispatch) => {
  dispatch(setTipAttendanceLoading(true));
  try {
    const { result } = await api.fetch(
      makeApiUrl(chain, address, "councilor", "/tippers")
    );
    dispatch(setTipAttendance(result));
  } finally {
    dispatch(setTipAttendanceLoading(false));
  }
};
export const resetTipAttendance = makeReset(setTipAttendance, null);

export const usersCountsSelector = (state) => state.usersDetail.counts;
export const countsLoadingSelector = (state) => state.usersDetail.countsLoading;
export const councilorShipSelector = (state) => state.usersDetail.councilorShip;
export const councilorShipLoadingSelector = (state) =>
  state.usersDetail.councilorShipLoading;
export const motionAttendanceSelector = (state) =>
  state.usersDetail.motionAttendance;
export const motionAttendanceLoadingSelector = (state) =>
  state.usersDetail.motionAttendanceLoading;
export const tipAttendanceSelector = (state) => state.usersDetail.tipAttendance;
export const tipAttendanceLoadingSelector = (state) =>
  state.usersDetail.tipAttendanceLoading;

export default usersDetailSlice.reducer;

function makeApiUrl(chain, address, role, endpoint = "") {
  return `/${chain}/account/${address}/${role}${endpoint}`;
}
function makeReset(setter, data) {
  return () => (dispatch) => dispatch(setter(data));
}
