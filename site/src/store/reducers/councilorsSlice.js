import { createSlice } from "@reduxjs/toolkit";
import api from "../../services/scanApi";

const councilorsSlice = createSlice({
  name: "councilors",
  initialState: {
    councilors: {
      items: [],
      total: 0,
    },
    loading: false,
  },
  reducers: {
    setCouncilors(state, { payload }) {
      state.councilors = payload;
    },
    setTotal(state, { payload }) {
      state.councilors.total = payload;
    },
    setLoading(state, { payload }) {
      state.loading = payload;
    },
  },
});

export const { setLoading, setCouncilors, setTotal } = councilorsSlice.actions;

export const fetchCouncilors =
  (page, pageSize, params, options = {}) =>
  async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const { result } = await api.fetch(
        "/participants",
        {
          page,
          pageSize,
          role: "councilor",
          ...params,
        },
        options,
      );
      dispatch(setCouncilors(result || {}));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const fetchCouncilorsCount = () => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    const { result } = await api.fetch("/participants", {
      page: 0,
      pageSize: 1,
      role: "councilor",
    });

    dispatch(setTotal(result?.total || 0));
  } finally {
    dispatch(setLoading(false));
  }
};

export const councilorsSelector = (state) => state.councilors.councilors;
export const loadingSelector = (state) => state.councilors.loading;

export default councilorsSlice.reducer;
