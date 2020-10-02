import { createSlice } from "@reduxjs/toolkit";

import {
  fetchAllFilteredOrderSets,
  fetchNextOrderSets,
} from "../../api/orderApi";

let initialState = {
  isLoading: false,
  isNextLoading: false,
  nextLink: null,
  orderCount: null,
  queryTotal: null,
  orderSets: [],
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
      const { orderSets, nextLink, orderCount, queryTotal } = action.payload;
      state.nextLink = nextLink;
      state.orderSets = [...orderSets];
      state.orderCount = orderCount;
      state.queryTotal = queryTotal;
      state.isLoading = false;
      state.error = null;
    },
    getNextOrderSetsSuccess(state, action) {
      const { orderSets, nextLink, orderCount, queryTotal } = action.payload;
      state.nextLink = nextLink;
      state.orderSets = state.orderSets.concat(orderSets);
      if (state.orderCount !== orderCount) {
        state.orderCount = orderCount;
      }
      if (state.queryTotal !== queryTotal) {
        state.queryTotal = queryTotal;
      }
      state.isNextLoading = false;
      state.error = null;
    },
    resetOrderSetHistory(state) {
      state.isLoading = false;
      state.isNextLoading = false;
      state.nextLink = null;
      state.orderSets = [];
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
  resetOrderSetHistory,
  getOrderSetDetailSuccess,
  setFailure,
} = orderSetHistorySlice.actions;

export default orderSetHistorySlice.reducer;

export const fetchFilteredOrderSets = (filterObject) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    let orderSets = await fetchAllFilteredOrderSets(filterObject);
    if (orderSets.error) {
      throw orderSets.error;
    }
    let mappedOrderSets = orderSets.data.orders.map((orderSet) => ({
      id: orderSet.id,
      type: orderSet.type,
      user: orderSet.user.name,
      program: orderSet.program ? orderSet.program.name : null,
      state: orderSet["random-order-state"],
      totalItems: orderSet["total-quantity"],
      totalOrders: orderSet["order-count"],
      totalEstCost: orderSet["total-cost"],
      totalActCost: "---",
      budget: "$25,000.00",
      orderDate: orderSet["submitted-at"]
        ? orderSet["submitted-at"]
        : "---",
      dueDate: orderSet["due-date"],
      status: orderSet.status,
    }));
    dispatch(
      getOrderSetsSuccess({
        orderSets: mappedOrderSets,
        nextLink: orderSets.data.nextLink ? orderSets.data.nextLink : null,
        orderCount: orderSets.data.orderCount
          ? orderSets.data.orderCount
          : null,
        queryTotal: orderSets.data.queryTotal
          ? orderSets.data.queryTotal
          : null,
      })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const fetchNextFilteredOrderSets = (url) => async (dispatch) => {
  try {
    dispatch(setNextIsLoading());
    let orderSets = await fetchNextOrderSets(url);
    if (orderSets.error) {
      throw orderSets.error;
    }
    console.log(orderSets);
    let mappedOrderSets = orderSets.data.orders.map((orderSet) => ({
      id: orderSet.id,
      type: orderSet.type,
      user: orderSet.user.name,
      program: orderSet.program ? orderSet.program.name : null,
      state: orderSet["random-order-state"],
      totalItems: orderSet["total-quantity"],
      totalOrders: orderSet["order-count"],
      totalEstCost: orderSet["total-cost"],
      totalActCost: "---",
      budget: "$25,000.00",
      orderDate: orderSet["submitted-at"]
        ? orderSet["submitted-at"]
        : "---",
      dueDate: orderSet["due-date"],
      status: orderSet.status,
    }));
    dispatch(
      getNextOrderSetsSuccess({
        orderSets: mappedOrderSets,
        nextLink: orderSets.data.nextLink ? orderSets.data.nextLink : null,
        orderCount: orderSets.data.orderCount
          ? orderSets.data.orderCount
          : null,
        queryTotal: orderSets.data.queryTotal
          ? orderSets.data.queryTotal
          : null,
      })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};
