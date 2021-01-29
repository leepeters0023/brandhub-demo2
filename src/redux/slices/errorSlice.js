import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  currentError: null,
};

const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    setError(state, action) {
      const { error } = action.payload;
      state.currentError = error;
    },
    clearError(state) {
      state.currentError = null;
    },
  },
});

export const { setError, clearError } = errorSlice.actions;

export default errorSlice.reducer;
