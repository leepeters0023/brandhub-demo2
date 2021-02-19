import { createSlice } from "@reduxjs/toolkit";
import { fetchOrderItemReport, fetchReportById } from "../../api/reportApi";
import { mapOrderHistoryItems } from "../apiMaps";
import { setError } from "./errorSlice";
import { startGlobalLoad, stopGlobalLoad } from "./globalLoadSlice";

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

export const getOrderItemReport = (filterObject) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    dispatch(startGlobalLoad());
    const items = await fetchOrderItemReport(filterObject);
    if (items.error) {
      throw items.error;
    }
    let mappedItems = mapOrderHistoryItems(items.data);
    dispatch(getReportsSuccess({ type: "wrap-up", reportData: mappedItems }));
    dispatch(stopGlobalLoad());
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(setError({ error: err.toString() }));
    dispatch(stopGlobalLoad());
  }
};

export const getReportById = (id, filterObject) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    dispatch(startGlobalLoad());
    const reportData = await fetchReportById(id, filterObject);
    if (reportData.error) {
      throw reportData.error;
    }
    console.log(reportData.data);
    dispatch(getReportsSuccess({ type: id, reportData: reportData.data }));
    dispatch(stopGlobalLoad());
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(setError({ error: err.toString() }));
    dispatch(stopGlobalLoad());
  }
}
