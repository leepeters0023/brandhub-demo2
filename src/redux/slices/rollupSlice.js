import { createSlice } from "@reduxjs/toolkit";

import {
  fetchAllFilteredPreOrders,
  fetchNextPreOrders,
} from "../../api/orderApi";

let initialState = {
  isLoading: false,
  isNextLoading: false,
  nextLink: null,
  orderCount: null,
  queryTotal: null,
  preOrders: [],
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

const rollupSlice = createSlice({
  name: "rollup",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    setNextIsLoading: startNextLoading,
    getPreOrdersSuccess(state, action) {
      const { preOrders, nextLink, orderCount, queryTotal } = action.payload;
      state.nextLink = nextLink;
      state.preOrders = [...preOrders];
      state.orderCount = orderCount;
      state.queryTotal = queryTotal;
      state.isLoading = false;
      state.error = null;
    },
    getNextPreOrdersSuccess(state, action) {
      const { preOrders, nextLink, orderCount, queryTotal } = action.payload;
      state.nextLink = nextLink;
      state.preOrders = state.preOrders.concat(preOrders);
      if (state.orderCount !== orderCount) {
        state.orderCount = orderCount;
      }
      if (state.queryTotal !== queryTotal) {
        state.queryTotal = queryTotal;
      }
      state.isNextLoading = false;
      state.error = null;
    },
    resetPreOrderRollup(state) {
      state.isLoading = false;
      state.isNextLoading = false;
      state.nextLink = null;
      state.preOrders = [];
      state.error = null;
    },
    getPreOrderDetailSuccess(state) {
      state.isLoading = false;
      state.error = null;
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  setNextIsLoading,
  getPreOrdersSuccess,
  getNextPreOrdersSuccess,
  resetPreOrderRollup,
  getPreOrderDetailSuccess,
  setFailure,
} = rollupSlice.actions;

export default rollupSlice.reducer;
//TODO switch to fetchAllFilteredPreOrders
export const fetchFilteredPreOrders = (filterObject) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    let preOrders = await fetchAllFilteredPreOrders(filterObject);
    if (preOrders.error) {
      throw preOrders.error;
    }
    let mappedPreOrders = preOrders.data.orders.map((preOrder) => ({
      id: preOrder.id,
      user: preOrder.user.name,
      program: preOrder.program.name,
      state: preOrder["random-order-state"],
      totalItems: preOrder["total-quantity"],
      totalOrders: preOrder["order-count"],
      totalEstCost: preOrder["total-cost"],
      totalActCost: "---",
      budget: "$25,000.00",
      orderDate: preOrder["submission-date"]
        ? preOrder["submission-date"]
        : "---",
      dueDate: preOrder["due-date"],
      status: preOrder.status,
    }));
    console.log(preOrders.data)
    dispatch(
      getPreOrdersSuccess({
        preOrders: mappedPreOrders,
        nextLink: preOrders.data.nextLink ? preOrders.data.nextLink : null,
        orderCount: preOrders.data.orderCount ? preOrders.data.orderCount : null,
        queryTotal: preOrders.data.queryTotal ? preOrders.data.queryTotal : null,
      })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const fetchNextFilteredPreOrders = (url) => async (dispatch) => {
  try {
    dispatch(setNextIsLoading());
    let preOrders = await fetchNextPreOrders(url);
    if (preOrders.error) {
      throw preOrders.error;
    }
    let mappedPreOrders = preOrders.data.preOrders.map((preOrder) => ({
      id: preOrder.id,
      user: preOrder.user.name,
      program: preOrder.program.name,
      state: preOrder["random-order-state"],
      totalItems: preOrder["total-quantity"],
      totalOrders: preOrder["order-count"],
      totalEstCost: preOrder["total-cost"],
      totalActCost: "---",
      budget: "$25,000.00",
      orderDate: preOrder["submission-date"]
        ? preOrder["submission-date"]
        : "---",
      dueDate: preOrder["due-date"],
      status: preOrder.status,
    }));
    dispatch(
      getNextPreOrdersSuccess({
        preOrders: mappedPreOrders,
        nextLink: preOrders.data.nextLink ? preOrders.data.nextLink : null,
        orderCount: preOrders.data.orderCount ? preOrders.data.orderCount : null,
        queryTotal: preOrders.data.queryTotal ? preOrders.data.queryTotal : null,
      })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};


