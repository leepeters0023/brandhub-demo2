import { createSlice } from "@reduxjs/toolkit";
import { fetchOrdersByProgram, fetchOrderSetById } from "../../api/orderApi";

import { setPreOrderDetails } from "./preOrderDetailSlice";

import { mapOrderItems, mapOrderHistoryOrders } from "../apiMaps";

let initialState = {
  isLoading: false,
  orderId: null,
  type: null,
  status: null,
  items: [],
  orders: [],
  orderTotal: 0,
  orderNote: "",
  error: null,
};

const startLoading = (state) => {
  state.isLoading = true;
};

const loadingFailed = (state, action) => {
  const { error } = action.payload;
  state.isLoading = false;
  state.error = error;
};

const orderSetSlice = createSlice({
  name: "orderGrouping",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    buildTableFromOrders(state, action) {
      const { orderId, type, orders, items, status, note } = action.payload;
      if (orders.length !== 0) {
        let currentItems = [...items];
        let ordTotal = 0;
        orders.forEach((ord) => {
          let orderItems = [...ord.items];
          orderItems.forEach((item) => {
            ordTotal += item.totalEstCost;
            currentItems.find(
              (cItem) => item.itemNumber === cItem.itemNumber
            ).totalItems += item.totalItems;
            currentItems.find(
              (cItem) => item.itemNumber === cItem.itemNumber
            ).totalEstCost += item.totalEstCost;
          });
        });
        state.orderId = orderId;
        state.status = status;
        state.type = type;
        state.items = currentItems;
        state.orders = [...orders];
        state.orderNote = note;
        state.orderTotal = ordTotal;
        state.isLoading = false;
        state.error = null;
      } else {
        state.orders = [];
        state.items = [];
        state.isLaoding = false;
        state.error = null;
      }
    },
    setGridItem(state, action) {
      const { itemNumber, orderNumber, value } = action.payload;
      let orders = [...state.orders];
      let currentOrder = orders.find((ord) => ord.id === orderNumber);
      let newItems = currentOrder.items.map((item) => {
        if (item.itemNumber === itemNumber) {
          let numVal = value === "" ? 0 : parseInt(value);
          return {
            ...item,
            totalItems: numVal,
            totalEstCost: numVal * item.estCost,
          };
        } else return item;
      });
      let newTotalItems = 0;
      let newtotalEstCost = 0;
      newItems.forEach((item) => {
        newTotalItems += item.totalItems;
        newtotalEstCost += item.totalEstCost;
      });
      currentOrder.items = [...newItems];
      currentOrder.totalItems = newTotalItems;
      currentOrder.totalEstCost = newtotalEstCost;
      orders.splice(orders.indexOf(currentOrder), 1, currentOrder);
      state.orders = [...orders];
    },
    setItemTotal(state, action) {
      const { itemNumber } = action.payload;
      let items = [...state.items];
      let currentItem = items.find((item) => item.itemNumber === itemNumber);
      let totalItems = 0;
      let totalEstCost = 0;
      let ordTotal = 0;
      state.orders.forEach((ord) => {
        totalItems += ord.items.find((item) => item.itemNumber === itemNumber)
          .totalItems;
        totalEstCost += ord.items.find((item) => item.itemNumber === itemNumber)
          .totalEstCost;
        ord.items.forEach((item) => (ordTotal += item.totalEstCost));
      });
      currentItem.totalItems = totalItems;
      currentItem.totalEstCost = totalEstCost;
      items.splice(items.indexOf(currentItem), 1, currentItem);
      state.items = [...items];
      state.orderTotal = ordTotal;
    },
    removeGridItem(state, action) {
      const { itemNum } = action.payload;
      state.orderTotal -= state.items.find(
        (item) => item.itemNumber === itemNum
      ).totalEstCost;
      let currentItems = state.items.filter(
        (item) => item.itemNumber !== itemNum
      );
      state.items = currentItems;
      let currentOrders = [...state.orders];
      currentOrders.forEach((ord) => {
        let currentItems = ord.items.filter(
          (item) => item.itemNumber !== itemNum
        );
        let totalItems = 0;
        let totalEstCost = 0;
        currentItems.forEach((item) => {
          totalItems += item.totalItems;
          totalEstCost += item.totalEstCost;
        });
        ord.items = currentItems;
        ord.totalItems = totalItems;
        ord.totalEstCost = totalEstCost;
      });
      state.orders = currentOrders;
    },
    removeGridOrder(state, action) {
      const { orderId } = action.payload;
      let deleteOrder = state.orders.find((order) => order.id === orderId);
      state.orderTotal -= deleteOrder.totalEstCost;
      let currentOrders = state.orders.filter((order) => order.id !== orderId);
      state.orders = currentOrders;
      let currentItems = [...state.items];
      currentItems = currentItems.map((item) => {
        let editItem = deleteOrder.items.find(
          (i) => i.itemNumber === item.itemNumber
        );
        return {
          ...item,
          totalEstCost: item.totalEstCost - editItem.totalEstCost,
          totalItems: item.totalItems - editItem.totalItems,
        };
      });
      state.items = currentItems;
    },
    updateOrderDetails(state, action) {
      const { orderNumber, note, attn } = action.payload;
      let currentOrders = state.orders.map((order) => {
        if (order.id === orderNumber) {
          return {
            ...order,
            note: note ? note : "",
            attn: attn ? attn : "",
          };
        } else return order;
      });
      state.orders = currentOrders;
    },
    updateOrderNote(state, action) {
      const { value } = action.payload;
      if (value.length <= 300) {
        state.orderNote = value;
      }
    },
    setOrderStatus(state, action) {
      const { status } = action.payload;
      state.status = status;
    },
    resetState(state) {
      state.isLoading = false;
      state.orderId = null;
      state.type = null;
      state.status = null;
      state.items = [];
      state.orders = [];
      state.orderTotal = 0;
      state.orderNote = "";
      state.error = null;
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  buildTableFromOrders,
  setGridItem,
  setItemTotal,
  removeGridItem,
  removeGridOrder,
  updateOrderDetails,
  updateOrderNote,
  setOrderStatus,
  resetState,
  setFailure,
} = orderSetSlice.actions;

export default orderSetSlice.reducer;

export const fetchOrderSet = (id) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const currentOrders = await fetchOrderSetById(id);
    if (currentOrders.error) {
      throw currentOrders.error;
    }
    let currentItems = mapOrderItems(
      currentOrders.data["order-set-items"],
      "order-set-item"
    );
    let orders = mapOrderHistoryOrders(currentOrders.data.orders);
    orders.sort((a, b) => {
      return a.distributorName < b.distributorName
        ? -1
        : a.distributorName > b.distributorName
        ? 1
        : 0;
    });

    let orderTotal = currentOrders.data["total-estimated-cost"];
    let type = currentOrders.data.type;
    let orderId = currentOrders.data.id;
    let orderStatus = currentOrders.data.status;
    let territories =
      currentOrders.data["territory-names"].length === 0
        ? ["National"]
        : currentOrders.data["territory-names"].split(", ");
    let note = currentOrders.data.notes ? currentOrders.data.notes : "";
    dispatch(
      setPreOrderDetails({
        territories: territories,
        programId: null,
        orderTotal: orderTotal,
      })
    );

    dispatch(
      buildTableFromOrders({
        orderId: orderId,
        type: type,
        orders: orders,
        items: currentItems,
        status: orderStatus,
        note: note,
      })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const fetchProgramOrders = (program, userId) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const currentOrders = await fetchOrdersByProgram(program, userId);
    if (currentOrders.error) {
      throw currentOrders.error;
    }
    let currentItems = mapOrderItems(
      currentOrders.data[0]["order-set-items"],
      "order-set-item"
    );
    let orders = mapOrderHistoryOrders(currentOrders.data[0].orders);
    orders.sort((a, b) => {
      return a.distributorName < b.distributorName
        ? -1
        : a.distributorName > b.distributorName
        ? 1
        : 0;
    });
    let orderTotal = currentOrders.data[0]["total-estimated-cost"];
    let type = currentOrders.data[0].type;
    let orderId = currentOrders.data[0].id;
    let orderStatus = currentOrders.data[0].status;
    let territories =
      currentOrders.data[0]["territory-names"].length === 0
        ? ["National"]
        : currentOrders.data[0]["territory-names"].split(", ");
    let note = currentOrders.data[0].notes ? currentOrders.data[0].notes : "";
    dispatch(
      setPreOrderDetails({
        territories: territories,
        programId: program,
        orderTotal: orderTotal,
      })
    );
    dispatch(
      buildTableFromOrders({
        orderId: orderId,
        type: type,
        orders: orders,
        items: currentItems,
        status: orderStatus,
        note: note,
      })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};
