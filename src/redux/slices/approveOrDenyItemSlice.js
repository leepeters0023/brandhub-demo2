import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  isLoading: false,
  error: null,
}

const startLoading = (state) => {
  state.isLoading = true;
};

const loadingFailed = (state, action) => {
  const { error } = action.payload;
  state.isLoading = false;
  state.error = error;
};

const approveOrDenyItemSlice = createSlice({
  name: "brands",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    approveOrDenyItemSuccess(state) {
      state.isLoading = false;
      state.error = null;
    },
    setFailure: loadingFailed,
  }
})

export const {
  setIsLoading,
  setFailure,
} = approveOrDenyItemSlice.actions;

export default approveOrDenyItemSlice.reducer;


