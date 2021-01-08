import { createSlice } from "@reduxjs/toolkit";
import api from "../../services/scanApi";

const burntSlice = createSlice({
  name: "burnt",
  initialState: {
    burntList: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
    },
    loadingBurntList: false,
    burntListCount: 0,
  },
  reducers: {
    setBurntList(state, { payload }) {
      state.burntList = payload;
    },
    setLoadingBurntList(state, { payload }) {
      state.loadingBurntList = payload;
    },
    setBurntListCount(state, { payload }) {
      state.burntListCount = payload;
    },
  },
});

export const {
  setBurntList,
  setLoadingBurntList,
  setBurntListCount,
} = burntSlice.actions;

export const fetchBurntList = () => async (dispatch) => {
  dispatch(setLoadingBurntList(true));

  try {
    const { result } = await api.fetch(`/burnt`);
    dispatch(setBurntList(result || {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
    }));
  } finally {
    dispatch(setLoadingBurntList(false));
  }
};

export const fetchBurntListCount = () => async (dispatch) => {
  const { result } = await api.fetch(`/burnt/count`);
  dispatch(setBurntListCount(result || 0));
};

export const burntListSelector = (state) => state.burnt.burntList;
export const loadingBurntListSelector = (state) => state.burnt.loadingBurntList;
export const burntListCountSelector = (state) => state.burnt.burntListCount;

export default burntSlice.reducer;
