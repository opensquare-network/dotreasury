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
    tipDetail: {},
    loadingTipDetail: false,
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
    setTipDetail(state, { payload }) {
      state.tipDetail = payload;
    },
    setLoadingTipDetail(state, { payload }) {
      state.loadingTipDetail = payload;
    },
  },
});

export const {
  setTips,
  setLoading,
  setTipsCount,
  setTipDetail,
  setLoadingTipDetail,
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

export const fetchTipDetail = (tipId) => async (dispatch) => {
  dispatch(setLoadingTipDetail(true));
  try {
    const { result } = await api.fetch(`/tips/${tipId}`);
    dispatch(setTipDetail(result || {}));
  } finally {
    dispatch(setLoadingTipDetail(false));
  }
};

const tipFinalStates = ["TipRetracted", "TipClosed"];
const showStatusMap = {
  NewTip: "Tipping",
  tip: "Tipping",
  TipRetracted: "Retracted",
  TipClosed: "Closed",
};

function normalizeTip(tip) {
  const showTime = tipFinalStates.includes(tip.latestState?.state);
  const showStatus = showStatusMap[tip.latestState?.state];

  return {
    showTime,
    showStatus,
    ...tip,
  };
}

export const tipListSelector = (state) => state.tips.tips;
export const normalizedTipListSelector = createSelector(
  tipListSelector,
  (tips) => {
    const items = tips.items.map(normalizeTip);
    return {
      ...tips,
      items,
    };
  }
);
export const loadingSelector = (state) => state.tips.loading;
export const tipsCountSelector = (state) => state.tips.tipsCount;
export const tipDetailSelector = (state) => state.tips.tipDetail;
export const normalizedTipDetailSelector = createSelector(
  tipDetailSelector,
  (tip) => ({
    ...tip,
    ...normalizeTip(tip),
  })
);
export const loadingTipDetailSelector = (state) => state.tips.loadingTipDetail;

export default tipSlice.reducer;
