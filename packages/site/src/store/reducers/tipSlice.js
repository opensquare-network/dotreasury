import { createSlice } from "@reduxjs/toolkit";
import tipsFakeData from "./tipsFakeData";

const tipSlice = createSlice({
  name: "tips",
  initialState: {
    tips: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
    },
    loading: false,
  },
  reducers: {
    setTips(state, { payload }) {
      state.tips = payload;
    },
    setLoading(state, { payload }) {
      state.loading = payload;
    },
  },
});

export const { setTips, setLoading } = tipSlice.actions;

export const fetchTips = (page = 0, pageSize = 20) => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    dispatch(
      setTips(
        tipsFakeData || {
          items: [],
          page: 0,
          pageSize: 10,
          total: 0,
        }
      )
    );
  } finally {
    dispatch(setLoading(false));
  }
};

export const tipListSelector = (state) => state.tips.tips;
export const loadingSelector = (state) => state.tips.loading;
export default tipSlice.reducer;
