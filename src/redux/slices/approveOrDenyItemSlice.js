import { createSlice } from "@reduxjs/toolkit";
//import { fetchBrandsByName } from "../../api/brandApi";

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
    approveOrDenyItemSuccess(state, action) {
    //   const { brands } = action.payload;
    //   state.brandList = brands;
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


