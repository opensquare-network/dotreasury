import { createSlice } from "@reduxjs/toolkit";
import api from "../../services/scanApi";

const transferSlice = createSlice({
  name: "transfers",
  initialState: {
    transferList: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
    },
    loadingTransferList: false,
    transferListCount: 0,
  },
  reducers: {
    setTransferList(state, { payload }) {
      state.transferList = payload;
    },
    setLoadingTransferList(state, { payload }) {
      state.loadingTransferList = payload;
    },
    setTransferListCount(state, { payload }) {
      state.transferListCount = payload;
    },
  },
});

export const {
  setTransferList,
  setLoadingTransferList,
  setTransferListCount,
} = transferSlice.actions;

export const fetchTransferList = (chain, page = 0, pageSize = 30) => async (
  dispatch
) => {
  dispatch(setLoadingTransferList(true));

  try {
    const { result } = await api.fetch(`/${chain}/outputtransfers`, {
      page,
      pageSize,
    });
    dispatch(
      setTransferList(
        result || {
          items: [],
          page: 0,
          pageSize: 10,
          total: 0,
        }
      )
    );
  } finally {
    dispatch(setLoadingTransferList(false));
  }
};

export const fetchTransferListCount = (chain) => async (dispatch) => {
  const { result } = await api.fetch(`/${chain}/outputtransfers/count`);
  dispatch(setTransferListCount(result || 0));
};

export const transferListSelector = (state) => state.transfers.transferList;
export const loadingTransferListSelector = (state) =>
  state.transfers.loadingTransferList;
export const transferListCountSelector = (state) =>
  state.transfers.transferListCount;

export default transferSlice.reducer;
