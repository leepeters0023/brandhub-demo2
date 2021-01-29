import { createSlice } from "@reduxjs/toolkit";
import { fetchWrapUpReport } from "../../api/reportApi";
import { mapOrderHistoryItems } from "../apiMaps";
import { setError } from "./errorSlice";

let initialState = {
  isLoading: false,
  reportType: null,
  reportData: [],
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

const reportSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    getReportsSuccess(state, action) {
      const { type, reportData } = action.payload;
      state.reportType = type;
      state.reportData = reportData;
      state.error = null;
      state.isLoading = false;
    },
    clearReports(state) {
      state.isLoading = false;
      state.reportType = null;
      state.reportData = [];
      state.error = null;
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  getReportsSuccess,
  clearReports,
  setFailure,
} = reportSlice.actions;

export default reportSlice.reducer;

export const getWrapUp = (filterObject) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const items = await fetchWrapUpReport(filterObject);
    if (items.error) {
      throw items.error;
    }
    let mappedItems = mapOrderHistoryItems(items.data);
    dispatch(getReportsSuccess({type: "wrap-up", reportData: mappedItems}))
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(setError({ error: err.toString() }));
  }
};
