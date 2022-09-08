import { createSlice } from "@reduxjs/toolkit";
import api from "../../services/scanApi";

const participantsSlice = createSlice({
  name: "participants",
  initialState: {
    participants: {
      items: [],
      total: 0,
    },
    loading: false,
  },
  reducers: {
    setParticipants(state, { payload }) {
      state.participants = payload;
    },
    setLoading(state, { payload }) {
      state.loading = payload;
    },
  },
});

export const { setLoading, setParticipants } = participantsSlice.actions;

export const fetchParticipants =
  (chain, page, pageSize) => async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const { result } = api.fetch(`/${chain}/participants`, {
        page,
        pageSize,
      });
      dispatch(setParticipants(result || {}));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const participantsSelector = (state) => state.participants.participants;
export const loadingSelector = (state) => state.participants.loading;

export default participantsSlice.reducer;
