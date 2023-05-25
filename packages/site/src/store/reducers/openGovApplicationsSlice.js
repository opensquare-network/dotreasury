import { createSlice } from "@reduxjs/toolkit";
import api from "../../services/scanApi";

const openGovApplicationsSlice = createSlice({
  name: "openGovApplications",
  initialState: {
    applicationList: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
    },
    loadingApplicationList: false,
    applicationListCount: 0,
    summary: {},
  },
  reducers: {
    setApplicationList(state, { payload }) {
      state.applicationList = payload;
    },
    setLoadingApplicationList(state, { payload }) {
      state.loadingApplicationList = payload;
    },
    setApplicationListCount(state, { payload }) {
      state.applicationListCount = payload;
    },
    setSummary(state, { payload }) {
      state.summary = payload;
    },
  },
});

export const {
  setApplicationList,
  setLoadingApplicationList,
  setApplicationListCount,
  setSummary,
} = openGovApplicationsSlice.actions;

export const fetchApplicationList = (chain, page = 0, pageSize = 30, status = "", track = "", minMax = {}, sort = {}) => async (
  dispatch
) => {
  dispatch(setLoadingApplicationList(true));

  try {
    const { result } = await api.fetch(`/${chain}/referenda`, {
      page,
      pageSize,
      status,
      track,
      ...minMax,
      ...sort,
    });
    dispatch(
      setApplicationList(
        result || {
          items: [],
          page: 0,
          pageSize: 10,
          total: 0,
        }
      )
    );
  } finally {
    dispatch(setLoadingApplicationList(false));
  }
};

export const fetchApplicationListCount = (chain) => async (dispatch) => {
  const { result } = await api.fetch(`/${chain}/referenda/count`);
  dispatch(setApplicationListCount(result || 0));
};

export const fetchApplicationSummary = (chain) => async (dispatch) => {
  const { result } = await api.fetch(`/${chain}/referenda/summary`);
  dispatch(setSummary(result || {}));
};

export const applicationListSelector = (state) => state.openGovApplications.applicationList;
export const loadingApplicationListSelector = (state) =>
  state.openGovApplications.loadingApplicationList;
export const applicationListCountSelector = (state) =>
  state.openGovApplications.applicationListCount;
export const applicationSummarySelector = (state) => state.openGovApplications.summary;

export default openGovApplicationsSlice.reducer;
