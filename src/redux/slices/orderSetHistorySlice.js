import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllFilteredOrderSets,
  fetchNextOrderSets,
  fetchOrderSetItems,
  fetchNextOrderSetItems,
} from "../../api/orderApi";
import { mapOrderSetHistory, mapOrderSetItems } from "../apiMaps";
import { setError } from "./errorSlice";
import { startGlobalLoad, stopGlobalLoad } from "./globalLoadSlice";

let initialState = {
  isLoading: false,
  isNextLoading: false,
  nextLink: null,
  orderSets: [],
  itemGroups: [],
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

const orderSetHistorySlice = createSlice({
  name: "rollup",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    setNextIsLoading: startNextLoading,
    getOrderSetsSuccess(state, action) {
      const { orderSets, nextLink } = action.payload;
      state.nextLink = nextLink;
      state.orderSets = [...orderSets];
      state.isLoading = false;
      state.error = null;
    },
    getNextOrderSetsSuccess(state, action) {
      const { orderSets, nextLink } = action.payload;
      state.nextLink = nextLink;
      state.orderSets = state.orderSets.concat(orderSets);
      state.isNextLoading = false;
      state.error = null;
    },
    getOrderSetItemsSuccess(state, action) {
      const { itemGroups, nextLink } = action.payload;
      state.nextLink = nextLink;
      state.itemGroups = [...itemGroups];
      state.isLoading = false;
      state.error = null;
    },
    getNextOrderSetItemsSuccess(state, action) {
      const { itemGroups, nextLink } = action.payload;
      state.nextLink = nextLink;
      state.itemGroups = state.itemGroups.concat(itemGroups);
      state.isNextLoading = false;
      state.error = null;
    },
    resetOrderSetHistory(state) {
      state.isLoading = false;
      state.isNextLoading = false;
      state.nextLink = null;
      state.orderSets = [];
      state.itemGroups = [];
      state.error = null;
    },
    getOrderSetDetailSuccess(state) {
      state.isLoading = false;
      state.error = null;
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  setNextIsLoading,
  getOrderSetsSuccess,
  getNextOrderSetsSuccess,
  getOrderSetItemsSuccess,
  getNextOrderSetItemsSuccess,
  resetOrderSetHistory,
  getOrderSetDetailSuccess,
  setFailure,
} = orderSetHistorySlice.actions;

export default orderSetHistorySlice.reducer;

export const fetchFilteredOrderSets = (filterObject) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    dispatch(startGlobalLoad());
    let orderSets = await fetchAllFilteredOrderSets(filterObject);
    if (orderSets.error) {
      throw orderSets.error;
    }
    let mappedOrderSets = mapOrderSetHistory(orderSets.data.orders);
    dispatch(
      getOrderSetsSuccess({
        orderSets: mappedOrderSets,
        nextLink: orderSets.data.nextLink ? orderSets.data.nextLink : null,
      })
    );
    dispatch(stopGlobalLoad());
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(setError({ error: err.toString() }));
    dispatch(stopGlobalLoad());
  }
};

export const fetchNextFilteredOrderSets = (url) => async (dispatch) => {
  try {
    dispatch(setNextIsLoading());
    dispatch(startGlobalLoad());
    let orderSets = await fetchNextOrderSets(url);
    if (orderSets.error) {
      throw orderSets.error;
    }
    let mappedOrderSets = mapOrderSetHistory(orderSets.data.orders);
    dispatch(
      getNextOrderSetsSuccess({
        orderSets: mappedOrderSets,
        nextLink: orderSets.data.nextLink ? orderSets.data.nextLink : null,
      })
    );
    dispatch(stopGlobalLoad());
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(setError({ error: err.toString() }));
    dispatch(stopGlobalLoad());
  }
};

export const fetchFilteredOrderSetItems = (filterObject) => async (
  dispatch
) => {
  try {
    dispatch(setIsLoading());
    dispatch(startGlobalLoad());
    let orderSetItems = await fetchOrderSetItems(filterObject);
    if (orderSetItems.error) {
      throw orderSetItems.error;
    }
    let mappedItems = mapOrderSetItems(orderSetItems.data.items);
    dispatch(
      getOrderSetItemsSuccess({
        itemGroups: mappedItems,
        nextLink: orderSetItems.data.nextLink
          ? orderSetItems.data.nextLink
          : null,
      })
    );
    dispatch(stopGlobalLoad());
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(setError({ error: err.toString() }));
    dispatch(stopGlobalLoad());
  }
};

export const fetchNextFilteredOrderSetItems = (url) => async (dispatch) => {
  try {
    dispatch(setNextIsLoading());
    dispatch(startGlobalLoad());
    let orderSetItems = await fetchNextOrderSetItems(url);
    if (orderSetItems.error) {
      throw orderSetItems.error;
    }
    let mappedItems = mapOrderSetItems(orderSetItems.data.items);
    dispatch(
      getNextOrderSetItemsSuccess({
        itemGroups: mappedItems,
        nextLink: orderSetItems.data.nextLink
          ? orderSetItems.data.nextLink
          : null,
      })
    );
    dispatch(stopGlobalLoad());
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(setError({ error: err.toString() }));
    dispatch(stopGlobalLoad());
  }
};
