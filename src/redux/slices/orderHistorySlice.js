import { createSlice } from "@reduxjs/toolkit";
import {
  fetchOrderHistory,
  fetchNextHistory,
  fetchSingleOrder,
} from "../../api/orderApi";

let initialState = {
  isLoading: false,
  isNextLoading: false,
  ordersPerPage: 20,
  nextPage: null,
  nextLink: null,
  orders: [],
  singleOrder: {
    orderNumber: null,
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
      state.singleOrder.distributorName = order.distributorName;
      state.singleOrder.distributorId = order.distributorId;
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
    resetOrderHistory(state) {
      state.isLoading = false;
      state.isNextLoading = false;
      state.ordersPerPage = 20;
      state.nextPage = null;
      state.nextLink = null;
      state.orders = [];
      state.singleOrder = {
        orderNumber: null,
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
    console.log(orders.data)
    let mappedOrders = orders.data.orders.map((order) => {
      return {
        orderNum: order.id,
        user: order.user.name,
        distributor: order.distributor ? order.distributor.name : "---",
        state: order.distributor ? order.distributor.state : "---",
        program: order.program !== null ? order.program.name : "---",
        orderDate: order["order-date"] ? order["order-date"] : "---",
        shipDate: order["ship-date"] ? order["ship-date"] : "---",
        type: order.type,
        totalItems: order["total-quantity"],
        estTotal: order["total-cost"],
        actTotal: "---",
        orderStatus: order.status === "submitted" ? "Pending" : order.status,
      };
    });
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
    let mappedOrders = orders.data.orders.map((order) => ({
      orderNum: order.id,
      distributor: order.distributor.name,
      state: order.distributor.state,
      program: order.program.name,
      orderDate: order["order-date"] ? order["order-date"] : "---",
      shipDate: order["ship-date"] ? order["ship-date"] : "---",
      trackingNum: order["tracking-number"] ? order["tracking-number"] : "---",
      totalItems: order["total-quantity"],
      estTotal: order["total-cost"],
      actTotal: "---",
      orderStatus: order.status === "submitted" ? "Pending" : order.status,
    }));
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
    let formattedOrder = {
      id: order.data.id,
      distributorName: order.data.distributor.name,
      distributorId: order.data.distributor.id,
      type: order.data.type,
      status: order.data.status === "submitted" ? "Pending" : order.data.status,
      orderDate: order.data["order-date"] ? order.data["order-date"] : "---",
      shipDate: order.data["ship-date"] ? order.data["ship-date"] : "---",
      trackingNum: order.data["tracking-number"]
        ? order.data["tracking-number"]
        : "---",
      totalItems: order.data["total-quantity"],
      totalEstCost: order.data["total-cost"],
      totalActCost: "---",
      note: order.data.notes,
    };
    let formattedItems = order.data["order-items"].map((item) => ({
      itemNumber: item.item["item-number"],
      imgUrl: item.item["img-url"],
      brand: item.item.brand.name,
      itemType: item.item.type,
      qty: item.item["qty-per-pack"],
      price: item.item.cost,
      totalItems: item.qty,
      estTotal: item["total-cost"],
      actTotal: "---",
    }));
    dispatch(
      getSingleOrderSuccess({ order: formattedOrder, items: formattedItems })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};
