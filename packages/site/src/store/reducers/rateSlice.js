import { createSlice } from "@reduxjs/toolkit";
import pluralize from "pluralize";
import api from "../../services/scanApi";
import { signMessage } from "../../services/chainApi";
import { addToast } from "./toastSlice";
import { REACTION_THUMBUP } from "../../constants";

const rateSlice = createSlice({
  name: "rate",
  initialState: {
    rateStats: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    },
    rates: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
    },
    loading: false,
  },
  reducers: {
    setRateStats(state, { payload }) {
      state.rateStats = payload;
    },
    setRates(state, { payload }) {
      state.rates = payload;
    },
    setLoading(state, { payload }) {
      state.loading = payload;
    },
  },
});

export const { setRateStats, setRates, setLoading } = rateSlice.actions;

export const addRate = (
  chain,
  type,
  index,
  grade,
  comment,
  version,
  timestamp,
  address
) => async (dispatch) => {
  const data = {
    chain,
    type: type === "proposal" ? "treasury_proposal" : type,
    index,
    grade,
    comment,
    timestamp,
    version,
  };

  try {
    dispatch(setLoading(true));
    const signature = await signMessage(JSON.stringify(data), address);

    const { error } = await api.fetch(
      `/rates`,
      {},
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data, address, signature }),
      }
    );

    if (error) {
      dispatch(
        addToast({
          type: "error",
          message: error.message,
        })
      );
    }
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setLoading(false));
  }

  dispatch(fetchRateStats(chain, type, index));
};

export const fetchRateStats = (chain, type, index) => async (dispatch) => {
  const { result } = await api.fetch(
    `/${chain}/${pluralize(type)}/${index}/ratestats`
  );
  dispatch(
    setRateStats(
      result || {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      }
    )
  );
};

export const fetchRates = (chain, type, index, page, pageSize) => async (
  dispatch
) => {
  const { result } = await api.maybeAuthFetch(
    `/${chain}/${pluralize(type)}/${index}/rates`,
    { page, pageSize }
  );
  dispatch(
    setRates(
      result || {
        items: [],
        page: 0,
        pageSize: 10,
        total: 0,
      }
    )
  );
};

export const setRateThumbUp = (rateId) => async (dispatch) => {
  return await api.authFetch(
    `/rates/${rateId}/reaction`,
    {},
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reaction: REACTION_THUMBUP }),
    }
  );
};

export const unsetRateReaction = (rateId) => async (dispatch) => {
  return await api.authFetch(
    `/rates/${rateId}/reaction`,
    {},
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const rateStatsSelector = (state) => state.rate.rateStats;
export const ratesSelector = (state) => state.rate.rates;
export const loadingSelector = (state) => state.rate.loading;

export default rateSlice.reducer;
