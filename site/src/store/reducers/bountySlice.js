import { createSlice } from "@reduxjs/toolkit";
import { EMPTY_TABLE_DATA } from "../../constants";
import api from "../../services/scanApi";
import { isKusama, isPolkadot } from "../../utils/chains";
import subsquareApi from "../../services/subsquareApi";

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
    childBountiesByParentIndex: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
    },
    loading: false,
    bountyDetail: {},
    childBountyDetail: {},
    loadingBountyDetail: false,
  },
  reducers: {
    setBounties(state, { payload }) {
      state.bounties = payload;
    },
    setBountiesTotal(state, { payload }) {
      state.bounties.total = payload;
    },
    setChildBounties(state, { payload }) {
      state.childBounties = payload;
    },
    setChildBountiesByParentIndex(state, { payload }) {
      state.childBountiesByParentIndex = payload;
    },
    setLoading(state, { payload }) {
      state.loading = payload;
    },
    setBountyDetail(state, { payload }) {
      state.bountyDetail = payload;
    },
    setChildBountyDetail(state, { payload }) {
      state.childBountyDetail = payload;
    },
    setLoadingBountyDetail(state, { payload }) {
      state.loadingBountyDetail = payload;
    },
  },
});

export const {
  setBounties,
  setChildBounties,
  setChildBountiesByParentIndex,
  setLoading,
  setBountyDetail,
  setChildBountyDetail,
  setLoadingBountyDetail,
  setBountiesTotal,
} = bountySlice.actions;

export const fetchBounties =
  (page = 0, pageSize = 30, params, options = {}) =>
  async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const { result } = await api.fetch(
        "/bounties",
        {
          page,
          pageSize,
          ...params,
        },
        options,
      );
      dispatch(setBounties(result || {}));
    } finally {
      dispatch(setLoading(false));
    }
  };
export const resetBounties = () => (dispatch) => {
  dispatch(setBounties(EMPTY_TABLE_DATA));
};

export const fetchChildBountiesByParentIndex =
  (bountyIndex, page = 1, pageSize = 30) =>
  async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const { result } = await api.fetch(
        `/bounties/${bountyIndex}/child-bounties`,
        {
          page,
          pageSize,
        },
      );
      dispatch(setChildBountiesByParentIndex(result || {}));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const fetchBountyDetail = (bountyIndex) => async (dispatch) => {
  dispatch(setLoadingBountyDetail(true));
  try {
    const { result } = await api.fetch(`/bounties/${bountyIndex}`);
    dispatch(setBountyDetail(result || {}));
  } finally {
    dispatch(setLoadingBountyDetail(false));
  }
};

export const fetchChildBountyDetail = (bountyIndex) => async (dispatch) => {
  dispatch(setLoadingBountyDetail(true));
  try {
    const { result } = await api.fetch(`/child-bounties/${bountyIndex}`);
    dispatch(setChildBountyDetail(result || {}));
  } finally {
    dispatch(setLoadingBountyDetail(false));
  }
};
export const fetchChildBounties =
  (page = 0, pageSize = 30, params, options = {}) =>
  async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const { result } = await api.fetch(
        "/child-bounties",
        {
          page,
          pageSize,
          ...params,
        },
        options,
      );
      dispatch(setChildBounties(result || {}));
    } finally {
      dispatch(setLoading(false));
    }
  };
export const resetChildBounties = () => (dispatch) => {
  dispatch(setChildBounties(EMPTY_TABLE_DATA));
};

export const fetchBountiesTotal = () => async (dispatch) => {
  if (!isKusama && !isPolkadot) {
    return;
  }

  dispatch(setLoading(true));

  try {
    const { result } = await subsquareApi.fetch("/overview/summary");
    dispatch(setBountiesTotal(result?.bounties?.all) || 0);
  } finally {
    dispatch(setLoading(false));
  }
};

export const totalBountyCountSelector = (state) =>
  state.bounties.bounties.total;
export const bountyListSelector = (state) => state.bounties.bounties;
export const childBountyListSelector = (state) => state.bounties.childBounties;
export const childBountyByParentIndexListSelector = (state) =>
  state.bounties.childBountiesByParentIndex;
export const loadingSelector = (state) => state.bounties.loading;
export const bountyDetailSelector = (state) => state.bounties.bountyDetail;
export const childBountyDetailSelector = (state) =>
  state.bounties.childBountyDetail;
export const loadingBountyDetailSelector = (state) =>
  state.bounties.loadingBountyDetail;

export default bountySlice.reducer;
