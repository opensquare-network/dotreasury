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
} = bountySlice.actions;

export const fetchBounties =
  (chain, page = 0, pageSize = 30, filterData) =>
  async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const { result } = await api.fetch(`/${chain}/bounties`, {
        page,
        pageSize,
        ...filterData,
      });
      dispatch(setBounties(result || {}));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const fetchChildBountiesByParentIndex =
  (chain, bountyIndex, page = 1, pageSize = 30) =>
  async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const { result } = await api.fetch(
        `/${chain}/bounties/${bountyIndex}/child-bounties`,
        {
          page,
          pageSize,
        }
      );
      dispatch(setChildBountiesByParentIndex(result || {}));
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

export const fetchChildBountyDetail = (chain, bountyIndex) => async (dispatch) => {
  dispatch(setLoadingBountyDetail(true));
  try {
    const { result } = await api.fetch(`/${chain}/child-bounties/${bountyIndex}`);
    dispatch(setChildBountyDetail(result || {}));
  } finally {
    dispatch(setLoadingBountyDetail(false));
  }
};
export const fetchChildBounties =
  (chain, page = 0, pageSize = 30, filterData) =>
  async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const { result } = await api.fetch(`/${chain}/child-bounties`, {
        page,
        pageSize,
        ...filterData,
      });
      dispatch(setChildBounties(result || {}));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const bountyListSelector = (state) => state.bounties.bounties;
export const childBountyListSelector = (state) => state.bounties.childBounties;
export const childBountyByParentIndexListSelector = (state) =>
  state.bounties.childBountiesByParentIndex;
export const loadingSelector = (state) => state.bounties.loading;
export const bountyDetailSelector = (state) => state.bounties.bountyDetail;
export const childBountyDetailSelector = (state) => state.bounties.childBountyDetail;
export const loadingBountyDetailSelector = (state) =>
  state.bounties.loadingBountyDetail;

export default bountySlice.reducer;
