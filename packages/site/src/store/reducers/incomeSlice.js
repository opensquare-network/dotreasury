import { createSlice } from "@reduxjs/toolkit";
import api from "../../services/scanApi";

const incomeSlice = createSlice({
  name: "income",
  initialState: {
    democracySlashList: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
    },
    democracySlashListLoading: false,
    treasurySlashList: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
    },
    treasurySlashListLoading: false,
    identitySlashList: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
    },
    identitySlashListLoading: false,
    electionPhragmenSlashList: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
    },
    electionPhragmenSlashListLoading: false,
    stakingSlashList: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
    },
    stakingSlashListLoading: false,
    inflationList: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
    },
    inflationListLoading: false,
    othersIncomeList: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
    },
    othersIncomeListLoading: false,
    count: {
      treasurySlash: 0,
      democracySlash: 0,
      identitySlash: 0,
      electionPhragmenSlash: 0,
      stakingSlash: 0,
      inflation: 0,
      others: 0,
    },
  },
  reducers: {
    setCount(state, { payload }) {
      state.count = payload;
    },
    setDemocracySlashList(state, { payload }) {
      state.democracySlashList = payload;
    },
    setDemocracySlashListLoading(state, { payload }) {
      state.democracySlashListLoading = payload;
    },
    setTreasurySlashList(state, { payload }) {
      state.treasurySlashList = payload;
    },
    setTreasurySlashListLoading(state, { payload }) {
      state.treasurySlashListLoading = payload;
    },
    setIdentitySlashList(state, { payload }) {
      state.identitySlashList = payload;
    },
    setIdentitySlashListLoading(state, { payload }) {
      state.identitySlashListLoading = payload;
    },
    setElectionPhragmenSlashList(state, { payload }) {
      state.electionPhragmenSlashList = payload;
    },
    setElectionPhragmenSlashListLoading(state, { payload }) {
      state.electionPhragmenSlashListLoading = payload;
    },
    setStakingSlashList(state, { payload }) {
      state.stakingSlashList = payload;
    },
    setStakingSlashListLoading(state, { payload }) {
      state.stakingSlashListLoading = payload;
    },
    setInflationList(state, { payload }) {
      state.inflationList = payload;
    },
    setInflationListLoading(state, { payload }) {
      state.inflationListLoading = payload;
    },
    setOthersIncomeList(state, { payload }) {
      state.othersIncomeList = payload;
    },
    setOthersIncomeListLoading(state, { payload }) {
      state.othersIncomeListLoading = payload;
    },
  },
});

export const {
  setCount,
  setDemocracySlashList,
  setDemocracySlashListLoading,
  setTreasurySlashList,
  setTreasurySlashListLoading,
  setIdentitySlashList,
  setIdentitySlashListLoading,
  setElectionPhragmenSlashList,
  setElectionPhragmenSlashListLoading,
  setStakingSlashList,
  setStakingSlashListLoading,
  setInflationList,
  setInflationListLoading,
  setOthersIncomeList,
  setOthersIncomeListLoading,
} = incomeSlice.actions;

export const fetchIncomeCount = () => async (dispatch) => {
  const { result } = await api.fetch(`/kusama/income/count`);
  dispatch(
    setCount(
      result || {
        treasurySlash: 0,
        democracySlash: 0,
        identitySlash: 0,
        electionPhragmenSlash: 0,
        stakingSlash: 0,
        inflation: 0,
        others: 0,
      }
    )
  );
};

export const fetchTreasurySlashList = (page = 0, pageSize = 30) => async (
  dispatch
) => {
  dispatch(setTreasurySlashListLoading(true));

  try {
    const { result } = await api.fetch(`/kusama/income/slash/treasury`, {
      page,
      pageSize,
    });
    dispatch(
      setTreasurySlashList(
        result || {
          items: [],
          page: 0,
          pageSize: 10,
          total: 0,
        }
      )
    );
  } finally {
    dispatch(setTreasurySlashListLoading(false));
  }
};

export const fetchDemocracySlashList = (page = 0, pageSize = 30) => async (
  dispatch
) => {
  dispatch(setDemocracySlashListLoading(true));

  try {
    const { result } = await api.fetch(`/kusama/income/slash/democracy`, {
      page,
      pageSize,
    });
    dispatch(
      setDemocracySlashList(
        result || {
          items: [],
          page: 0,
          pageSize: 10,
          total: 0,
        }
      )
    );
  } finally {
    dispatch(setDemocracySlashListLoading(false));
  }
};

export const fetchIdentitySlashList = (page = 0, pageSize = 30) => async (
  dispatch
) => {
  dispatch(setIdentitySlashListLoading(true));

  try {
    const { result } = await api.fetch(`/kusama/income/slash/identity`, {
      page,
      pageSize,
    });
    dispatch(
      setIdentitySlashList(
        result || {
          items: [],
          page: 0,
          pageSize: 10,
          total: 0,
        }
      )
    );
  } finally {
    dispatch(setIdentitySlashListLoading(false));
  }
};

export const fetchStakingSlashList = (page = 0, pageSize = 30) => async (
  dispatch
) => {
  dispatch(setStakingSlashListLoading(true));

  try {
    const { result } = await api.fetch(`/kusama/income/slash/staking`, {
      page,
      pageSize,
    });
    dispatch(
      setStakingSlashList(
        result || {
          items: [],
          page: 0,
          pageSize: 10,
          total: 0,
        }
      )
    );
  } finally {
    dispatch(setStakingSlashListLoading(false));
  }
};

export const fetchElectionPhragmenSlashList = (
  page = 0,
  pageSize = 30
) => async (dispatch) => {
  dispatch(setElectionPhragmenSlashListLoading(true));

  try {
    const { result } = await api.fetch(`/kusama/income/slash/electionphragmen`, {
      page,
      pageSize,
    });
    dispatch(
      setElectionPhragmenSlashList(
        result || {
          items: [],
          page: 0,
          pageSize: 10,
          total: 0,
        }
      )
    );
  } finally {
    dispatch(setElectionPhragmenSlashListLoading(false));
  }
};

export const fetchInflationList = (page = 0, pageSize = 30) => async (
  dispatch
) => {
  dispatch(setInflationListLoading(true));

  try {
    const { result } = await api.fetch(`/kusama/income/inflation`, { page, pageSize });
    dispatch(
      setInflationList(
        result || {
          items: [],
          page: 0,
          pageSize: 10,
          total: 0,
        }
      )
    );
  } finally {
    dispatch(setInflationListLoading(false));
  }
};

export const fetchOthersIncomeList = (page = 0, pageSize = 30) => async (
  dispatch
) => {
  dispatch(setOthersIncomeListLoading(true));

  try {
    const { result } = await api.fetch(`/kusama/income/others`, { page, pageSize });
    dispatch(
      setOthersIncomeList(
        result || {
          items: [],
          page: 0,
          pageSize: 10,
          total: 0,
        }
      )
    );
  } finally {
    dispatch(setOthersIncomeListLoading(false));
  }
};

export const incomeCountSelector = (state) => state.income.count;
export const democracySlashListSelector = (state) =>
  state.income.democracySlashList;
export const democracySlashListLoadingSelector = (state) =>
  state.income.democracySlashListLoading;
export const treasurySlashListSelector = (state) =>
  state.income.treasurySlashList;
export const treasurySlashListLoadingSelector = (state) =>
  state.income.treasurySlashListLoading;
export const electionPhragmenSlashListSelector = (state) =>
  state.income.electionPhragmenSlashList;
export const electionPhragmenSlashListLoadingSelector = (state) =>
  state.income.electionPhragmenSlashListLoading;
export const identitySlashListSelector = (state) =>
  state.income.identitySlashList;
export const identitySlashListLoadingSelector = (state) =>
  state.income.identitySlashListLoading;
export const stakingSlashListSelector = (state) =>
  state.income.stakingSlashList;
export const stakingSlashListLoadingSelector = (state) =>
  state.income.stakingSlashListLoading;
export const inflationListSelector = (state) => state.income.inflationList;
export const inflationListLoadingSelector = (state) =>
  state.income.inflationListLoading;
export const othersIncomeListSelector = (state) =>
  state.income.othersIncomeList;
export const othersIncomeListLoadingSelector = (state) =>
  state.income.othersIncomeListLoading;

export default incomeSlice.reducer;
