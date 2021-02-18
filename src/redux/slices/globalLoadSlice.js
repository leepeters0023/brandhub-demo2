import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  isLoading: false,
};

const globalLoadSlice = createSlice({
  name: "globalLoad",
  initialState,
  reducers: {
    startGlobalLoad(state) {
      state.isLoading = true;
    },
    stopGlobalLoad(state) {
      state.isLoading = false;
    },
  },
});

export const { startGlobalLoad, stopGlobalLoad } = globalLoadSlice.actions;

export default globalLoadSlice.reducer;
