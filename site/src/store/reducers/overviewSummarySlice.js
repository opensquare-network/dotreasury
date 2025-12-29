import { createSlice } from "@reduxjs/toolkit";
import { isKusama, isPolkadot } from "../../utils/chains";
import subsquareApi from "../../services/subsquareApi";

// New Overview summary slice.
// Only for Kusama and Polkadot.
const overviewSummarySlice = createSlice({
  name: "overviewSummary",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    setOverviewSummary(state, { payload }) {
      state.data = payload;
      state.loading = false;
      state.error = null;
    },
    setLoading(state, { payload }) {
      state.loading = payload;
    },
    setError(state, { payload }) {
      state.error = payload;
      state.loading = false;
    },
  },
});

export const { setOverviewSummary, setLoading, setError } =
  overviewSummarySlice.actions;

export const fetchOverviewSummary = () => async (dispatch) => {
  if (!isKusama && !isPolkadot) {
    return;
  }

  try {
    dispatch(setLoading(true));

    const [overviewResult, tipsResult] = await Promise.all([
      subsquareApi.fetch("/overview/summary"),
      subsquareApi.fetch("/treasury/tips/summary"),
    ]);

    dispatch(
      setOverviewSummary({
        ...overviewResult.result,
        tips: tipsResult.result,
      }),
    );
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const overviewSummarySelector = (state) => state.overviewSummary.data;
export const totalBountyCountSelector = (state) =>
  state.overviewSummary?.data?.bounties?.all || 0;
export const totalProposalsCountSelector = (state) =>
  state.overviewSummary?.data?.treasuryProposals?.all || 0;
export const totalTipsCountSelector = (state) =>
  state.overviewSummary?.data?.tips?.all || 0;
export const overviewSummaryLoadingSelector = (state) =>
  state.overviewSummary.loading;
export const overviewSummaryErrorSelector = (state) =>
  state.overviewSummary.error;

export default overviewSummarySlice.reducer;
