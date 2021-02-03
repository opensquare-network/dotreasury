import { createSlice } from "@reduxjs/toolkit";

let count = 0;

const toastSlice = createSlice({
  name: "toast",
  initialState: {
    toasts: []
  },
  reducers: {
    addToast(state, { payload }) {
      const toastId = count++;
      state.toasts.unshift({id: toastId, ...payload});
    },
    removeToast(state, { payload }) {
      state.toasts = state.toasts.filter(item => item.id !== payload);
    }
  }
});

export const toastsSelector = (state) => state.toast.toasts;

export const { addToast, removeToast } = toastSlice.actions;

export default toastSlice.reducer;
