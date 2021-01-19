import { createSlice } from "@reduxjs/toolkit";
import {
  fetchOrderHistory,
  fetchNextHistory,
  fetchSingleOrder,
  fetchOrderHistoryByItem,
  fetchNextOrderHistoryByItem,
} from "../../api/orderApi";

import {
  mapOrderHistoryOrders,
  mapSingleOrder,
  mapOrderItems,
  mapOrderHistoryItems,
} from "../apiMaps";

let initialState = {
  isLoading: false,
  isNextLoading: false,
  ordersPerPage: 20,
  nextPage: null,
  nextLink: null,
  orders: [],
  items: [],
  singleOrder: {
    orderNumber: null,
    user: null,
    distributorName: null,
    distributorId: null,
    distributorAddress: null,
    customAddressName: null,
    customAddressId: null,
    customAddressAddress: null,
    type: null,
    status: null,
    orderDate: null,
    shipDate: null,
    trackingNum: null,
    totalItems: 0,
    totalItemEstCost: 0,
    totalItemActCost: 0,
    totalEstFreight: 0,
    totalActFreight: 0,
    totalEstTax: 0,
    totalActTax: 0,
    totalEstCost: 0,
    totalActCost: 0,
    note: null,
    attn: null,
  },
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

const orderHistorySlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    setNextIsLoading: startNextLoading,
    getSingleOrderSuccess(state, action) {
      const { order, items } = action.payload;
      state.singleOrder.orderNumber = order.id;
      state.singleOrder.user = order.user;
      state.singleOrder.distributorName = order.distributorName;
      state.singleOrder.distributorId = order.distributorId;
      state.singleOrder.distributorAddress = order.distributorId ? `${order.distributorAddressOne}, ${
        order.distributorAddressTwo ? `${order.distributorAddressTwo}, ` : ""
      } ${order.distributorCity} ${order.distributorState} ${
        order.distributorZip
      }` : null;
      state.singleOrder.customAddressName = order.customAddressName;
      state.singleOrder.customAddressId = order.customAddressId;
      state.singleOrder.customAddressAddress = order.customAddressId ? `${order.customAddressAddressOne}, ${
        order.customAddressAddressTwo ? `${order.customAddressAddressTwo}, ` : ""
      } ${order.customAddressCity} ${order.customAddressState} ${
        order.customAddressZip
      }` : "---";
      state.singleOrder.type = order.type;
      state.singleOrder.status = order.status;
      state.singleOrder.items = [...items];
      state.singleOrder.orderDate = order.orderDate;
      state.singleOrder.shipDate = order.shipDate;
      state.singleOrder.trackingNum = order.trackingNum;
      state.singleOrder.totalItems = order.totalItems;
      state.singleOrder.totalItemEstCost =  order.totalEstCost;
      state.singleOrder.totalItemActCost =  order.totalActCost;
      state.singleOrder.totalEstFreight =  order.totalEstFreight;
      state.singleOrder.totalActFreight =  order.totalActFreight;
      state.singleOrder.totalEstTax = order.totalEstTax;
      state.singleOrder.totalActTax = order.totalActTax;
      state.singleOrder.totalEstCost = order.totalEstCost + order.totalEstFreight + order.totalEstTax;
      state.singleOrder.totalActCost = order.totalActCost;
      state.singleOrder.note = order.note;
      state.singleOrder.attn = order.attn;
      state.isLoading = false;
      state.error = null;
    },
    getOrderHistorySuccess(state, action) {
      const { orders, nextLink } = action.payload;
      state.nextPage = nextLink ? true : false;
      state.nextLink = nextLink;
      state.orders = [...orders];
      state.isLoading = false;
      state.error = null;
    },
    getNextHistorySuccess(state, action) {
      const { orders, nextLink } = action.payload;
      state.nextPage = nextLink ? true : false;
      state.nextLink = nextLink;
      state.orders = state.orders.concat(orders);
      state.isNextLoading = false;
      state.error = null;
    },
    getOrderItemsSuccess(state, action) {
      const { items, nextLink } = action.payload;
      state.nextPage = nextLink ? true : false;
      state.nextLink = nextLink;
      state.items = [...items];
      state.isLoading = false;
      state.error = null;
    },
    getNextItemsSuccess(state, action) {
      const { items, nextLink } = action.payload;
      state.nextPage = nextLink ? true : false;
      state.nextLink = nextLink;
      state.items = state.items.concat(items);
      state.isNextLoading = false;
      state.error = null;
    },
    resetOrderHistory(state) {
      state.isLoading = false;
      state.isNextLoading = false;
      state.ordersPerPage = 20;
      state.nextPage = null;
      state.nextLink = null;
      state.orders = [];
      state.items = [];
      state.singleOrder = {
        orderNumber: null,
        user: null,
        distributorName: null,
        distributorId: null,
        distributorAddress: null,
        customAddressName: null,
        customAddressId: null,
        customAddressAddress: null,
        type: null,
        status: null,
        orderDate: null,
        shipDate: null,
        trackingNum: null,
        totalItems: 0,
        totalItemEstCost: 0,
        totalItemActCost: 0,
        totalEstFreight: 0,
        totalActFreight: 0,
        totalEstTax: 0,
        totalActTax: 0,
        totalEstCost: 0,
        totalActCost: 0,
        note: null,
      };
      state.error = null;
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  setNextIsLoading,
  getSingleOrderSuccess,
  getOrderHistorySuccess,
  getOrderItemsSuccess,
  getNextItemsSuccess,
  getNextHistorySuccess,
  resetOrderHistory,
  setFailure,
} = orderHistorySlice.actions;

export default orderHistorySlice.reducer;

export const fetchFilteredOrderHistory = (filterObject) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    let orders = await fetchOrderHistory(filterObject);
    if (orders.error) {
      throw orders.error;
    }
    let mappedOrders = mapOrderHistoryOrders(orders.data.orders);
    dispatch(
      getOrderHistorySuccess({
        orders: mappedOrders,
        nextLink: orders.data.nextLink ? orders.data.nextLink : null,
      })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const fetchNextOrderHistory = (url) => async (dispatch) => {
  try {
    dispatch(setNextIsLoading());
    let orders = await fetchNextHistory(url);
    if (orders.error) {
      throw orders.error;
    }

    let mappedOrders = mapOrderHistoryOrders(orders.data.orders);
    dispatch(
      getNextHistorySuccess({
        orders: mappedOrders,
        nextLink: orders.data.nextLink ? orders.data.nextLink : null,
      })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const fetchOrder = (id) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    let order = await fetchSingleOrder(id);
    if (order.error) {
      throw order.error;
    }
    console.log(order);
    let formattedOrder = mapSingleOrder(order.data);
    let formattedItems = mapOrderItems(order.data["order-items"]);
    dispatch(
      getSingleOrderSuccess({ order: formattedOrder, items: formattedItems })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const fetchFilteredOrderHistoryByItem = (filterObject) => async (
  dispatch
) => {
  try {
    dispatch(setIsLoading());
    let items = await fetchOrderHistoryByItem(filterObject);
    if (items.error) {
      throw items.error;
    }
    let mappedItems = mapOrderHistoryItems(items.data.items)
    dispatch(
      getOrderItemsSuccess({
        items: mappedItems,
        nextLink: items.data.nextLink ? items.data.nextLink : null,
      })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const fetchNextFilteredOrderHistoryByItem = (url) => async (
  dispatch
) => {
  try {
    dispatch(setNextIsLoading());
    let items = await fetchNextOrderHistoryByItem(url);
    if (items.error) {
      throw items.error;
    }
    let mappedItems = mapOrderHistoryItems(items.data.items)
    dispatch(
      getNextItemsSuccess({
        items: mappedItems,
        nextLink: items.data.nextLink ? items.data.nextLink : null,
      })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};
