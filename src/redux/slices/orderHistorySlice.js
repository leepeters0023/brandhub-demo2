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

/*
* Order History Model
TODO: Create single item model, api call not available yet

single order model:
{
  id: string (read),
  distributorId: string (read),
  distributorName: string (read),
  distributorCity: string (read),
  distributorState: string (read),
  distributorCountry: string (read),
  distributorAddressOne: string (read),
  distributorAddressTwo: string (read),
  distributorZip: string (read),
  program: string (read),
  type: string (read),
  items: array (read),
  status: string (read, write),
  orderDate: string (read, (created upon order from api)),
  approvedDate: string (read, write (only field2 or higher can approve)),
  shipDate: string (read, updated via supplier portal),
  trackingNum: string (read, updated via supplier portal, might remove this field as it is potentially only ever on order-items),
  totalItems: int (read),
  totalEstCost: int (read),
  totalActCost: int (read, updated when actual cost is set in PO process),
  note: string (read, write (editable when placing order)),
  attn: string (read, write (editable when placing order))
}
*/

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
    type: null,
    status: null,
    orderDate: null,
    shipDate: null,
    trackingNum: null,
    totalItems: 0,
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
      state.singleOrder.distributorAddress = `${order.distributorAddressOne}, ${
        order.distributorAddressTwo ? `${order.distributorAddressTwo}, ` : ""
      } ${order.distributorCity} ${order.distributorState} ${
        order.distributorZip
      }`;
      state.singleOrder.type = order.type;
      state.singleOrder.status = order.status;
      state.singleOrder.items = [...items];
      state.singleOrder.orderDate = order.orderDate;
      state.singleOrder.shipDate = order.shipDate;
      state.singleOrder.trackingNum = order.trackingNum;
      state.singleOrder.totalItems = order.totalItems;
      state.singleOrder.totalEstCost = order.totalEstCost;
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
        type: null,
        status: null,
        orderDate: null,
        shipDate: null,
        trackingNum: null,
        totalItems: 0,
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
