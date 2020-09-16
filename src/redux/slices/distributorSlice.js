import { createSlice } from "@reduxjs/toolkit";
import { fetchDistributors } from "../../api/distributorApi";

/*
* Data Format:
distributors: {
  isLoading: bool,
  distributorList: array,
  error: null || string
}
*/

let initialState = {
  isLoading: false,
  distributorList: [],
  error: null,
};

const startLoading = (state) => {
  state.isLoading = true;
};

const loadingFailed = (state, action) => {
  const { error } = action.payload;
  state.isLoading = false;
  state.error = error;
};

const distributorSlice = createSlice({
  name: "distributors",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    getDistributorsSuccess(state, action) {
      const { distributors } = action.payload;
      state.distributorList = distributors
      state.isLoading = false;
      state.error = null;
    },
    clearDistributors(state) {
      state.isLoading = false;
      state.distributorList = [];
      state.error = null;
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  getDistributorsSuccess,
  clearDistributors,
  setFailure,
} = distributorSlice.actions;

export default distributorSlice.reducer;

export const fetchUserDistributors = () => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    let distributors = await fetchDistributors();
    if (distributors.error) {
      throw distributors.error;
    }
    dispatch(getDistributorsSuccess({ distributors: distributors.data }));
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};
