import { createSlice } from "@reduxjs/toolkit";
import {
  fetchOrderHistory,
  fetchNextHistory,
  fetchSingleOrder,
  // fetchOrderItemsHistory,
  // fetchNextOrderItemsHistory,
} from "../../api/orderApi";

const orderTypeMap = {
  "pre-order": "Pre Order",
  "in-stock": "In Stock",
  "on-demand": "On Demand",
};

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
    let mappedOrders = orders.data.orders.map((order) => {
      return {
        orderNum: order.id,
        user: order.user.name,
        distributor: order.distributor ? order.distributor.name : "---",
        state: order.distributor ? order.distributor.state : "---",
        program: order.program !== null ? order.program.name : "---",
        orderDate: order["submitted-at"] ? order["submitted-at"] : "---",
        shipDate: order["ship-date"] ? order["ship-date"] : "---",
        type: orderTypeMap[order.type],
        totalItems: order["total-quantity"],
        estTotal: order["total-estimated-cost"],
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
      user: order.user.name,
      distributor: order.distributor ? order.distributor.name : "---",
      state: order.distributor ? order.distributor.state : "---",
      program: order.program !== null ? order.program.name : "---",
      orderDate: order["submitted-at"] ? order["submitted-at"] : "---",
      shipDate: order["ship-date"] ? order["ship-date"] : "---",
      type: orderTypeMap[order.type],
      totalItems: order["total-quantity"],
      estTotal: order["total-estimated-cost"],
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
    console.log(order);
    let formattedOrder = {
      id: order.data.id,
      distributorName: order.data.distributor.name,
      distributorId: order.data.distributor.id,
      type: orderTypeMap[order.data.type],
      status: order.data.status === "submitted" ? "Pending" : order.data.status,
      orderDate: order.data["submitted-at"]
        ? order.data["submitted-at"]
        : "---",
      shipDate: order.data["ship-date"] ? order.data["ship-date"] : "---",
      trackingNum: order.data["tracking-number"]
        ? order.data["tracking-number"]
        : "---",
      totalItems: order.data["total-quantity"],
      totalEstCost: order.data["total-estimated-cost"],
      totalActCost: "---",
      note: order.data.notes,
    };
    let formattedItems = order.data["order-items"].map((item) => ({
      itemNumber: item.item["item-number"],
      imgUrl: item.item["img-url"],
      brand: item.item.brand.name,
      itemType: item.item.type,
      qty: item.item["qty-per-pack"],
      price: item.item["estimated-cost"],
      totalItems: item.qty,
      estTotal: item["total-estimated-cost"],
      actTotal: "---",
    }));
    dispatch(
      getSingleOrderSuccess({ order: formattedOrder, items: formattedItems })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

// export const fetchFilterdOrderItemsHistory = (filterObject) => async (
//   dispatch
// ) => {
//   try {
//     dispatch(setIsLoading());
//     let items = await fetchOrderItemsHistory(filterObject);
//     console.log(items);
//     if (items.error) {
//       throw items.error;
//     }
//     let mappedItems = items.data.items.map((item) => ({
//       sequenceNum: item["item-number"],
//       program: item.program,
//       itemType: item["item-type"],
//       distributor: item.distributor,
//       state: item.state ? item.state : "---",
//       packSize: item["qty-per-pack"],
//       totalItems: item.qty,
//       estCost: item["est-cost"],
//       estTotal: item["est-total"],
//       actCost: item["act-cost"] ? item["act-cost"] : "---",
//       actTotal: item["act-total"] ? item["act-total"] : "---",
//       orderDate: item["submitted-at"],
//       shipDate: item["ship-date"] ? item["ship-date"] : "---",
//       tracking: item["tracking-number"] ? item["tracking-number"] : "---",
//       status: item.status,
//     }));
//     dispatch(
//       getOrderItemsSuccess({
//         items: mappedItems,
//         nextLink: items.data.nextLink ? items.data.nextLink : null,
//       })
//     );
//   } catch (err) {
//     dispatch(setFailure({ error: err.toString() }));
//   }
// };

// export const fetchNextFilterdOrderItemsHistory = (url) => async (
//   dispatch
// ) => {
//   try {
//     dispatch(setNextIsLoading());
//     let items = await fetchNextOrderItemsHistory(url);
//     console.log(items);
//     if (items.error) {
//       throw items.error;
//     }
//     let mappedItems = items.data.items.map((item) => ({
//       sequenceNum: item["item-number"],
//       program: item.program,
//       itemType: item["item-type"],
//       distributor: item.distributor,
//       state: item.state ? item.state : "---",
//       packSize: item["qty-per-pack"],
//       totalItems: item.qty,
//       estCost: item["est-cost"],
//       estTotal: item["est-total"],
//       actCost: item["act-cost"] ? item["act-cost"] : "---",
//       actTotal: item["act-total"] ? item["act-total"] : "---",
//       orderDate: item["submitted-at"],
//       shipDate: item["ship-date"] ? item["ship-date"] : "---",
//       tracking: item["tracking-number"] ? item["tracking-number"] : "---",
//       status: item.status,
//     }));
//     dispatch(
//       getOrderItemsSuccess({
//         items: mappedItems,
//         nextLink: items.data.nextLink ? items.data.nextLink : null,
//       })
//     );
//   } catch (err) {
//     dispatch(setFailure({ error: err.toString() }));
//   }
// };
