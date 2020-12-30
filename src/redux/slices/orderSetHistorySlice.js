import { createSlice } from "@reduxjs/toolkit";

import {
  fetchAllFilteredOrderSets,
  fetchNextOrderSets,
  fetchOrderSetItems,
  fetchNextOrderSetItems,
} from "../../api/orderApi";

import { mapOrderSetHistory, mapOrderSetItems } from "../apiMaps";

/*
* Order Set History Model
TODO: Tie in budget when it is in the api
single order set model:
{
  id: string (read),
  userId: string (read),
  userName: string (read),
  orderDate: string (read),
  approvedDate: string (read, write (only field2 or higher can approve orders)),
  dueDate: string (read),
  type: string (read),
  program: string (read),
  territories: string (read),
  state: string (read),
  status: string (read, write),
  orderCount: int (read),
  totalItems: int (read),
  totalEstCost: int (read),
  totalActCost: int (read),
  budget: int (read)
}

order set item model
{
  user: string (read),
  itemNumber: string (read),
  program: string (read),
  itemType: string (read),
  state: string (read),
  packSize: int (read),
  totalItems: int (read, write (calculated when edits are made in order grid, we don't directly write)),
  estCost: int (read),
  totalEstCost: int (read, write (same as totalItems)),
  orderDate: date string (read),
  orderDue: date string (read),
  status: string (read, write (updates when order / approval windows close ** not in yet)),
  orderSetId: string (read)
}
*/

let initialState = {
  isLoading: false,
  isNextLoading: false,
  nextLink: null,
  orderCount: null,
  queryTotal: null,
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
    let orderSets = await fetchAllFilteredOrderSets(filterObject);
    if (orderSets.error) {
      throw orderSets.error;
    }
    let mappedOrderSets = mapOrderSetHistory(orderSets.data.orders);
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
    let mappedOrderSets = mapOrderSetHistory(orderSets.data.orders);
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

export const fetchFilteredOrderSetItems = (filterObject) => async (
  dispatch
) => {
  try {
    dispatch(setIsLoading());
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
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const fetchNextFilteredOrderSetItems = (url) => async (dispatch) => {
  try {
    dispatch(setNextIsLoading());
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
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};
