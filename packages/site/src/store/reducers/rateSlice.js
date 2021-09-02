import { createSlice } from "@reduxjs/toolkit";
import api from "../../services/scanApi";
import { signMessage } from "../../services/chainApi";

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
    }
  },
  reducers: {
    setRateStats(state, { payload }) {
      state.rateStats = payload;
    },
    setRates(state, { payload }) {
      state.rates = payload;
    }
  },
});

export const { setRateStats, setRates } = rateSlice.actions;

export const rateStatsSelector = (state) => state.rate.rateStats;
export const ratesSelector = (state) => state.rate.rates;


export const addRate = (
  chain,
  type,
  index,
  grade,
  comment,
  version,
  timestamp,
  address,
) => async (dispatch) => {
  const data = {
    chain,
    type: type === "proposal" ? "treasury_proposal" : type,
    ...(type === "tip" ? { blockHeight: index.blockHeight, hash: index.tipHash } : { index }),
    grade,
    comment,
    timestamp,
    address,
    version,
  };

  const signature = await signMessage(
    JSON.stringify(data),
    address
  );

  const { error } = await api.fetch(`/${chain}/rates`, {},
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data, signature }),
    }
  );

  if (error) {
    console.log(error);
  }

  // dispatch(fetchLinks(chain, type, index));
};

export default rateSlice.reducer;
