import { createSlice } from "@reduxjs/toolkit";
import api from "../../services/scanApi";

const name = "centrifugeBlockReward";

const centrifugeBlockRewardSlice = createSlice({
  name,
  initialState: {
    blockRewardList: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
    },
    loadingBlockRewardList: false,
    blockRewardListCount: 0,
  },
  reducers: {
    setBlockRewardList(state, { payload }) {
      state.blockRewardList = payload;
    },
    setLoadingBlockRewardList(state, { payload }) {
      state.loadingBlockRewardList = payload;
    },
    setBlockRewardListCount(state, { payload }) {
      state.blockRewardListCount = payload;
    },
  },
});

export const {
  setBlockRewardList,
  setLoadingBlockRewardList,
  setBlockRewardListCount,
} = centrifugeBlockRewardSlice.actions;

export const fetchBlockRewardList =
  (page = 0, pageSize = 30) =>
  async (dispatch) => {
    dispatch(setLoadingBlockRewardList(true));

    try {
      const { result } = await api.fetch("/centrifuge/block-rewards", {
        page,
        pageSize,
      });
      dispatch(
        setBlockRewardList(
          result || {
            items: [],
            page: 0,
            pageSize: 10,
            total: 0,
          },
        ),
      );
    } finally {
      dispatch(setLoadingBlockRewardList(false));
    }
  };

export const blockRewardListSelector = (state) => state[name].blockRewardList;
export const loadingBlockRewardListSelector = (state) =>
  state[name].loadingBlockRewardList;
export const blockRewardListCountSelector = (state) =>
  state[name].blockRewardListCount;

export default centrifugeBlockRewardSlice.reducer;
