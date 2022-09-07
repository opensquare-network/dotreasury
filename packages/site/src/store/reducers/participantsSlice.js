import { createSlice } from "@reduxjs/toolkit";

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

// FIXME: participants fetch
export const fetchParticipants = () => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    const { result } = {};
    dispatch(setParticipants(result || {}));
  } finally {
    dispatch(setLoading(false));
  }
};

export const participantsSelector = (state) => state.participants.participants;
export const loadingSelector = (state) => state.participants.loading;

export default participantsSlice.reducer;
