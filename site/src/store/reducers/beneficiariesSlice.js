import { createSlice } from "@reduxjs/toolkit";
import api from "../../services/scanApi";

const beneficiariesSlice = createSlice({
  name: "beneficiaries",
  initialState: {
    beneficiaries: {
      items: [],
      total: 0,
    },
    loading: false,
  },
  reducers: {
    setBeneficiaries(state, { payload }) {
      state.beneficiaries = payload;
    },
    setTotal(state, { payload }) {
      state.beneficiaries.total = payload;
    },
    setLoading(state, { payload }) {
      state.loading = payload;
    },
  },
});

export const { setLoading, setBeneficiaries, setTotal } =
  beneficiariesSlice.actions;

export const fetchBeneficiaries =
  (page, pageSize, params, options = {}) =>
  async (dispatch, getState) => {
    dispatch(setLoading(true));

    const {
      chain: { chain },
    } = getState();

    try {
      const { result } = await api.fetch(
        `https://${chain}-api.subsquare.io/treasury/beneficiaries`,
        {
          page,
          pageSize,
          ...params,
        },
        options,
      );
      dispatch(setBeneficiaries(result || {}));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const fetchBeneficiariesCount = () => async (dispatch, getState) => {
  dispatch(setLoading(true));

  const {
    chain: { chain },
  } = getState();

  try {
    const { result } = await api.fetch(
      `https://${chain}-api.subsquare.io/treasury/beneficiaries`,
      {
        page: 0,
        pageSize: 1,
      },
    );

    dispatch(setTotal(result?.total || 0));
  } finally {
    dispatch(setLoading(false));
  }
};

export const beneficiariesSelector = (state) =>
  state.beneficiaries.beneficiaries;
export const loadingSelector = (state) => state.beneficiaries.loading;

export default beneficiariesSlice.reducer;
