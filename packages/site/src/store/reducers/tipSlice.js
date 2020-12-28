import { createSlice, createSelector } from "@reduxjs/toolkit";
import api from "../../services/scanApi";

const tipSlice = createSlice({
  name: "tips",
  initialState: {
    tips: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
    },
    tipsCount: 0,
    loading: false,
  },
  reducers: {
    setTips(state, { payload }) {
      state.tips = payload;
    },
    setLoading(state, { payload }) {
      state.loading = payload;
    },
    setTipsCount(state, { payload }) {
      state.tipsCount = payload;
    },
  },
});

export const {
  setTips,
  setLoading,
  setTipsCount,
} = tipSlice.actions;

export const fetchTips = (page = 0, pageSize = 30) => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    const { result } = await api.fetch('/tips', { page, pageSize });
    dispatch(setTips(result));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchTipsCount = () => async (dispatch) => {
  const { result } = await api.fetch('/tips/count');
  dispatch(setTipsCount(result || 0));
};

const tipFinalStates = ["TipRetracted", "TipClosed"];
const showStatusMap = {
  NewTip: "Tipping",
  tip: "Tipping",
  TipRetracted: "Retracted",
  TipClosed: "Closed",
};

export const tipListSelector = (state) => state.tips.tips;
export const normalizedTipListSelector = createSelector(
  tipListSelector,
  (tips) => {
    const items = tips.items.map((tip) => {
      const showTime = tipFinalStates.includes(tip.latestState?.state);
      const showStatus = showStatusMap[tip.latestState?.state];

      return {
        showTime,
        showStatus,
        ...tip,
      };
    });

    return {
      ...tips,
      items,
    };
  }
);
export const loadingSelector = (state) => state.tips.loading;
export const tipsCountSelector = (state) => state.tips.tipsCount;
export default tipSlice.reducer;
