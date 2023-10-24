import { createSlice } from "@reduxjs/toolkit";
import api from "../../services/scanApi";

const name = "centrifugeGasFee";

const centrifugeGasFeeSlice = createSlice({
  name,
  initialState: {
    gasFeeList: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
    },
    loadingGasFeeList: false,
    gasFeeListCount: 0,
  },
  reducers: {
    setGasFeeList(state, { payload }) {
      state.gasFeeList = payload;
    },
    setLoadingGasFeeList(state, { payload }) {
      state.loadingGasFeeList = payload;
    },
    setGasFeeListCount(state, { payload }) {
      state.gasFeeListCount = payload;
    },
  },
});

export const { setGasFeeList, setLoadingGasFeeList, setGasFeeListCount } =
  centrifugeGasFeeSlice.actions;

export const fetchGasFeeList =
  (page = 0, pageSize = 30) =>
  async (dispatch) => {
    dispatch(setLoadingGasFeeList(true));

    try {
      const { result } = await api.fetch("/centrifuge/tx-fees", {
        page,
        pageSize,
      });
      dispatch(
        setGasFeeList(
          result || {
            items: [],
            page: 0,
            pageSize: 10,
            total: 0,
          },
        ),
      );
    } finally {
      dispatch(setLoadingGasFeeList(false));
    }
  };

export const gasFeeListSelector = (state) => state[name].gasFeeList;
export const loadingGasFeeListSelector = (state) => state[name].loadingGasFeeList;
export const gasFeeListCountSelector = (state) => state[name].gasFeeListCount;

export default centrifugeGasFeeSlice.reducer;
