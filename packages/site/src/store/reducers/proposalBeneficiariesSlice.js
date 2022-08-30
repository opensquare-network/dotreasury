import { createSlice } from "@reduxjs/toolkit";
import api from "../../services/scanApi";

const proposalBeneficiaries = createSlice({
  name: "proposalBeneficiaries",
  initialState: {
    proposalBeneficiaries: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
    },
    loading: false,
  },
  reducers: {
    setProposalBeneficiaries(state, { payload }) {
      state.tipFinders = payload;
    },
    setLoading(state, { payload }) {
      state.loading = payload;
    },
  },
});

export const { setProposalBeneficiaries, setLoading } =
  proposalBeneficiaries.actions;

export const fetchProposalBeneficiaries =
  (chain, page = 0, pageSize = 30) =>
  async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const { result } = await api.fetch(`/${chain}/proposals/beneficiaries`, {
        page,
        pageSize,
      });
      dispatch(setProposalBeneficiaries(result));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const proposalBeneficiariesSelector = (state) =>
  state.proposalBeneficiaries.proposalBeneficiaries;
export const loadingSelector = (state) => state.proposalBeneficiaries.loading;

export default proposalBeneficiaries.reducer;
