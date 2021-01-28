import { createSlice } from "@reduxjs/toolkit";

import { fetchRFQHistory, fetchNextRFQHistory } from "../../api/purchasingApi";

import { mapRFQHistory } from "../apiMaps";

let initialState = {
  isLoading: false,
  isNextLoading: false,
  rfqsPerPage: 20,
  nextPage: null,
  nextLink: null,
  rfqs: [],
  error: null,
};

const startLoading = (state) => {
  state.isLoading = true;
};

const startNextLoading = (state) => {
  state.isNextLoading = true;
};

const loadingFailed = (state, action) => {
  const { error } = action.payload;
  state.isLoading = false;
  state.error = error;
};

const rfqHistorySlice = createSlice({
  name: "rfqHistory",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    setNextIsLoading: startNextLoading,
    getRfqHistorySuccess(state, action) {
      const { rfqs, nextLink } = action.payload;
      state.nextPage = nextLink ? true : false;
      state.nextLink = nextLink;
      state.rfqs = [...rfqs];
      state.isLoading = false;
      state.error = null;
    },
    getNextRfqHistorySuccess(state, action) {
      const { rfqs, nextLink } = action.payload;
      state.nextPage = nextLink ? true : false;
      state.nextLink = nextLink;
      state.rfqs = state.rfqs.concat(rfqs);
      state.isNextLoading = false;
      state.error = null;
    },
    resetRfqHistory(state) {
      state.isLoading = false;
      state.isNextLoading = false;
      state.rfqsPerPage = 20;
      state.nextPage = null;
      state.nextLink = null;
      state.rfqs = [];
      state.error = null;
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  setNextIsLoading,
  getRfqHistorySuccess,
  getNextRfqHistorySuccess,
  resetRfqHistory,
  setFailure,
} = rfqHistorySlice.actions;

export default rfqHistorySlice.reducer;

export const fetchFilteredRFQHistory = (filterObject) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    let rfqs = await fetchRFQHistory(filterObject);
    if (rfqs.error) {
      throw rfqs.error;
    }
    let mappedRFQs = mapRFQHistory(rfqs.data.rfqs);
    dispatch(
      getRfqHistorySuccess({
        rfqs: mappedRFQs,
        nextLink: rfqs.data.nextLink,
      })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const fetchNextFilteredRFQHistory = (url) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    let rfqs = await fetchNextRFQHistory(url);
    if (rfqs.error) {
      throw rfqs.error;
    }
    let mappedRFQs = mapRFQHistory(rfqs.data.rfqs);
    dispatch(
      getNextRfqHistorySuccess({
        rfqs: mappedRFQs,
        nextLink: rfqs.data.nextLink,
      })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};
