import { createSlice } from "@reduxjs/toolkit";
import { trackItem } from "../../api/purchasingApi";

let initialState = {
  isLoading: false,
  tracking: null,
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

const trackingSlice = createSlice({
  name: "tracking",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    getTrackingSucces(state, action) {
      const { tracking } = action.payload;
      state.tracking = tracking;
      state.isLoading = false;
      state.error = null;
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  getTrackingSucces,
  setFailure,
} = trackingSlice.actions;

export default trackingSlice.reducer;

export const getTracking = (id) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const tracking = await trackItem(id);
    if (tracking.error) {
      throw tracking.error;
    }
    dispatch(getTrackingSucces({ tracking: tracking.data }));
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};
