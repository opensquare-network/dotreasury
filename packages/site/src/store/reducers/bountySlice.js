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
    childBounties: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
    },
    loading: false,
    bountyDetail: {},
    loadingBountyDetail: false,
  },
  reducers: {
    setBounties(state, { payload }) {
      state.bounties = payload;
    },
    setChildBounties(state, { payload }) {
      state.childBounties = payload;
    },
    setLoading(state, { payload }) {
      state.loading = payload;
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
  setChildBounties,
  setLoading,
  setBountyDetail,
  setLoadingBountyDetail,
} = bountySlice.actions;

export const fetchBounties = (chain, page = 0, pageSize = 30) => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    const { result } = await api.fetch(`/${chain}/bounties`, { page, pageSize });
    dispatch(setBounties(result || {}));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchBountyDetail = (chain, bountyIndex) => async (dispatch) => {
  dispatch(setLoadingBountyDetail(true));
  try {
    const { result } = await api.fetch(`/${chain}/bounties/${bountyIndex}`);
    dispatch(setBountyDetail(result || {}));
  } finally {
    dispatch(setLoadingBountyDetail(false));
  }
};

export const fetchChildBounties =
  (chain, page = 0, pageSize = 30) =>
  async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const { result } = await api.fetch(`/${chain}/child-bounties`, {
        page,
        pageSize,
      });
      dispatch(setChildBounties(result || {}));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const bountyListSelector = (state) => state.bounties.bounties;
export const loadingSelector = (state) => state.bounties.loading;
export const bountyDetailSelector = (state) => state.bounties.bountyDetail;
export const loadingBountyDetailSelector = (state) =>
  state.bounties.loadingBountyDetail;

export default bountySlice.reducer;
