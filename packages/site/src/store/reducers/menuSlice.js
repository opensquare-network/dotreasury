import { createSlice } from "@reduxjs/toolkit";

const menuSlice = createSlice({
  name: "menu",
  initialState: {
    showMenuTabs: "Home",
  },
  reducers: {
    setShowMenuTabs(state, { payload }) {
      state.showMenuTabs = payload;
    }
  },
});

export const { setShowMenuTabs } = menuSlice.actions;

export const showMenuTabsSelector = (state) => state.menu.showMenuTabs;

export default menuSlice.reducer;
