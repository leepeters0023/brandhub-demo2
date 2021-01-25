import { createSlice } from "@reduxjs/toolkit";
import { approveOrDenyItem } from "../../api/complianceApi.js";

let initialState = {
  status: null,
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
  name: "itemApprovedOrDenied",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    approveOrDenyItemSuccess(state, action) {
      const { response } = action.payload;
      state.status = response;
      state.isLoading = false;
      state.error = null;
    },
    setFailure: loadingFailed,
  },
})

export const {
  setIsLoading,
  setFailure,
  approveOrDenyItemSuccess,
} = approveOrDenyItemSlice.actions;

export default approveOrDenyItemSlice.reducer;

export const fetchApproveOrDenyItemSlice = (token, itemStatus) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const response = await approveOrDenyItem(token, itemStatus);

    if (response.error) {
      throw response.error;
    }
    dispatch(
      approveOrDenyItemSuccess({
        response: response.status,
      })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

