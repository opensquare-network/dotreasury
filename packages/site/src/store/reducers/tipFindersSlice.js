import { createSlice } from "@reduxjs/toolkit";
import api from "../../services/scanApi";
const tipFinders = createSlice({
  name: "tipFinders",
  initialState: {
    tipFinders: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
    },
    loading: false,
  },
  reducers: {
    setTipFinders(state, { payload }) {
      state.tipFinders = payload;
    },
    setLoading(state, { payload }) {
      state.loading = payload;
    },
  },
});

export const { setTipFinders, setLoading } = tipFinders.actions;

export const fetchTipFinders =
  (chain, page = 0, pageSize = 30) =>
  async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const { result } = await api.fetch(`/${chain}/tips/finders`, {
        page,
        pageSize,
      });
      dispatch(setTipFinders(result || {}));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const tipFindersSelector = (state) => state.tipFinders.tipFinders;
export const loadingSelector = (state) => state.tipFinders.loading;

export default tipFinders.reducer;
