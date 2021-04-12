import { createSlice } from "@reduxjs/toolkit";
import api from "../../services/scanApi";

const bountySlice = createSlice({
  name: "bounties",
  initialState: {
    bounties: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
    },
    bountiesCount: 0,
    loading: false,
    bountyDetail: {},
    loadingBountyDetail: false,
  },
  reducers: {
    setBounties(state, { payload }) {
      state.bounties = payload;
    },
    setLoading(state, { payload }) {
      state.loading = payload;
    },
    setBountiesCount(state, { payload }) {
      state.bountiesCount = payload;
    },
    setBountyDetail(state, { payload }) {
      state.bountyDetail = payload;
    },
    setLoadingBountyDetail(state, { payload }) {
      state.loadingBountyDetail = payload;
    },
  },
});

export const {
  setBounties,
  setLoading,
  setBountiesCount,
  setBountyDetail,
  setLoadingBountyDetail,
} = bountySlice.actions;

export const fetchBounties = (page = 0, pageSize = 30) => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    const { result } = await api.fetch('/kusama/bounties', { page, pageSize });
    dispatch(setBounties(result || {}));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchBountiesCount = () => async (dispatch) => {
  const { result } = await api.fetch("/kusama/bounties/count");
  dispatch(setBountiesCount(result || 0));
};

export const fetchBountyDetail = (bountyIndex) => async (dispatch) => {
  dispatch(setLoadingBountyDetail(true));
  try {
    const { result } = await api.fetch(`/kusama/bounties/${bountyIndex}`);
    dispatch(setBountyDetail(result || {}));
  } finally {
    dispatch(setLoadingBountyDetail(false));
  }
};

export const bountyListSelector = (state) => state.bounties.bounties;
export const loadingSelector = (state) => state.bounties.loading;
export const bountiesCountSelector = (state) => state.bounties.bountiesCount;
export const bountyDetailSelector = (state) => state.bounties.bountyDetail;
export const loadingBountyDetailSelector = (state) => state.bounties.loadingBountyDetail;

export default bountySlice.reducer;
