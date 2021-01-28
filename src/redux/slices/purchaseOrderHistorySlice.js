import { createSlice } from "@reduxjs/toolkit";
import { fetchPOHistory, fetchNextPOHistory } from "../../api/purchasingApi";
import { mapPOHistoryItems } from "../apiMaps";

let initialState = {
  isLoading: false,
  isNextLoading: false,
  posPerPage: 20,
  nextPage: null,
  nextLink: null,
  pos: [],
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

const purchaseOrderHistorySlice = createSlice({
  name: "poHistory",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    setNextIsLoading: startNextLoading,
    getPoHistorySuccess(state, action) {
      const { pos, nextLink } = action.payload;
      state.nextPage = nextLink ? true : false;
      state.nextLink = nextLink;
      state.pos = [...pos];
      state.isLoading = false;
      state.error = null;
    },
    getNextPoHistorySuccess(state, action) {
      const { pos, nextLink } = action.payload;
      state.nextPage = nextLink ? true : false;
      state.nextLink = nextLink;
      state.pos = state.pos.concat(pos);
      state.isNextLoading = false;
      state.error = null;
    },
    resetPoHistory(state) {
      state.isLoading = false;
      state.isNextLoading = false;
      state.posPerPage = 20;
      state.nextPage = null;
      state.nextLink = null;
      state.pos = [];
      state.error = null;
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  setNextIsLoading,
  getPoHistorySuccess,
  getNextPoHistorySuccess,
  resetPoHistory,
  setFailure,
} = purchaseOrderHistorySlice.actions;

export default purchaseOrderHistorySlice.reducer;

export const fetchFilteredPOHistory = (filterObject) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    let pos = await fetchPOHistory(filterObject);
    if (pos.error) {
      throw pos.error;
    }
    const mappedPOItems = mapPOHistoryItems(pos.data.pos);
    dispatch(
      getPoHistorySuccess({
        pos: mappedPOItems,
        nextLink: pos.data.nextLink,
      })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const fetchNextFilteredPOHistory = (url) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    let pos = await fetchNextPOHistory(url);
    if (pos.error) {
      throw pos.error;
    }
    const mappedPOItems = mapPOHistoryItems(pos.data.pos);
    dispatch(
      getNextPoHistorySuccess({
        pos: mappedPOItems,
        nextLink: pos.data.nextLink,
      })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};