import { createSlice } from "@reduxjs/toolkit";
import {
  fetchSingleOrder,
  fetchSingleOrderSetByType,
  deleteOrder,
  addOrderSetItem,
  createOrderSet,
} from "../../api/orderApi";

let initialState = {
  isLoading: false,
  orderUpdateLoading: false,
  inStockOrderNumber: null,
  inStockOrderItems: [],
  onDemandOrderNumber: null,
  onDemandOrderItems: [],
  userId: null,
  userName: null,
  orderId: null,
  type: null,
  status: null,
  orderDate: null,
  totalItems: 0,
  totalCost: 0,
  error: null,
};

const startLoading = (state) => {
  state.isLoading = true;
};

const startUpdateLoading = (state) => {
  state.orderUpdateLoading = true;
};

const loadingFailed = (state, action) => {
  const { error } = action.payload;
  state.isLoading = false;
  state.orderUpdateLoading = false;
  state.error = error;
};

const currentOrderSlice = createSlice({
  name: "currentOrder",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    setUpdateLoading: startUpdateLoading,
    createNewOrderSuccess(state, action) {
      const { type, orderId, item } = action.payload;
      state[`${type}OrderNumber`] = orderId;
      state[`${type}OrderItems`] = [{ item }];
      state.orderId = orderId;
      state.isLoading = false;
      state.orderUpdateLoading = false;
      state.error = null;
    },
    getCurrentOrderSuccess(state, action) {
      const { order, itemReference } = action.payload;
      if (order.type === "in-stock") {
        state.inStockOrderNumber = order.id;
        state.inStockOrderItems = itemReference;
      } else if (order.type === "on-demand") {
        state.onDemandOrderNumber = order.id;
        state.onDemandOrderItems = itemReference;
      }
      state.isLoading = false;
      state.orderUpdateLoading = false;
      state.userId = order.userId;
      state.userName = order.userName;
      state.orderId = order.id;
      state.type = order.type;
      state.status = order.status;
      state.orderDate = order.orderDate;
      state.totalItems = order.totalItems;
      state.totalCost = order.totalEstCost;
      state.error = null;
    },
    addNewItem(state, action) {
      const { item, type } = action.payload;
      let items;
      if (type === "inStock") {
        items = [...state.inStockOrderItems];
      } else if (type === "onDemand") {
        items = [...state.onDemandOrderItems];
      }
      items.push(item);
      state[`${type}OrderItems`] = items;
      state.isLoading = false;
      state.orderUpdateLoading = false;
      state.error = null;
    },
    clearCurrentOrder(state) {
      state.isLoading = false;
      state.orderUpdateLoading = false;
      state.userId = null;
      state.userName = null;
      state.orderNumber = null;
      state.type = null;
      state.status = null;
      state.totalItems = 0;
      state.totalCost = 0;
      state.error = null;
    },
    updateSuccess(state) {
      state.isLoading = false;
      state.orderUpdateLoading = false;
      state.error = null;
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  setUpdateLoading,
  createNewOrderSuccess,
  getCurrentOrderSuccess,
  addNewItem,
  clearCurrentOrder,
  updateSuccess,
  setFailure,
} = currentOrderSlice.actions;

export default currentOrderSlice.reducer;

export const createNewOrder = (type, itemNumber) => async (dispatch) => {
  try {
    dispatch(setUpdateLoading());
    let newOrder = await createOrderSet(type);
    if (newOrder.error) {
      throw newOrder.error;
    }
    let orderItem = await addOrderSetItem(newOrder.data.id, itemNumber);
    if (orderItem.error) {
      throw orderItem.error;
    }
    dispatch(
      createNewOrderSuccess({
        type: type,
        orderId: newOrder.data.id,
        item: { id: orderItem.data.id, itemNumber: orderItem.data.item.id },
      })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const fetchCurrentOrderByType = (type, userId) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    let order = await fetchSingleOrderSetByType(type, userId);
    if (order.error) {
      throw order.error;
    }
    let formattedOrder;
    let itemReferenceArray;
    if (order.data.length === 0) {
      formattedOrder = {
        userId: null,
        userName: null,
        id: null,
        type: null,
        status: null,
        orderDate: null,
        totalItems: 0,
        totalEstCost: 0,
      };
      itemReferenceArray = [];
    } else {
      formattedOrder = {
        userId: order.data[0].user.id,
        userName: order.data[0].user.name,
        id: order.data[0].id,
        type: order.data[0].type,
        status:
          order.data[0].status[0].toUpperCase() + order.data[0].status.slice(1),
        orderDate: order.data[0]["submitted-at"]
          ? order.data[0]["submitted-at"]
          : "---",
        totalItems: order.data[0]["total-quantity"],
        totalEstCost: order.data[0]["total-cost"],
      };
      itemReferenceArray = order.data[0]["order-set-items"].map((item) => ({
        id: item.id,
        itemNumber: item.item["item-number"],
      }));
    }
    dispatch(
      getCurrentOrderSuccess({
        order: formattedOrder,
        itemReference: itemReferenceArray,
      })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const fetchCurrentOrderById = (id) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    let order = await fetchSingleOrder(id);
    if (order.error) {
      throw order.error;
    }
    let formattedOrder = {
      userId: order.data.user.id,
      userName: order.data.user.name,
      id: order.data.id,
      distributorName: order.data.distributor
        ? order.data.distributor.name
        : "---",
      distributorId: order.data.distributor ? order.data.distributor.id : "---",
      attn: order.data.attn,
      type: order.data.type,
      status: order.data.status[0].toUpperCase() + order.data.status.slice(1),
      orderDate: order.data["submitted-at"]
        ? order.data["submitted-at"]
        : "---",
      rushOrder: "---",
      budget: "---",
      totalItems: order.data["total-quantity"],
      totalEstCost: order.data["total-cost"],
      orderNote: order.data.notes,
    };
    let formattedItems = order.data["order-items"].map((item) => ({
      id: item.id,
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
    let itemReferenceArray = order.data["order-items"].map((item) => ({
      id: item.id,
      itemNumber: item.item["item-number"],
    }));
    dispatch(
      getCurrentOrderSuccess({
        order: formattedOrder,
        orderItems: formattedItems,
        itemReference: itemReferenceArray,
      })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const deleteCurrentOrder = (id) => async (dispatch) => {
  try {
    dispatch(setUpdateLoading());
    const deleteStatus = await deleteOrder(id);
    if (deleteStatus.error) {
      throw deleteStatus.error;
    }
    dispatch(clearCurrentOrder());
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const addNewOrderItem = (orderId, itemId, type) => async (
  dispatch
) => {
  try {
    dispatch(setUpdateLoading());
      let orderItem = await addOrderSetItem(orderId, itemId);
      if (orderItem.error) {
        throw orderItem.error;
      }
      dispatch(
        addNewItem({
          item: {
            id: orderItem.data.id,
            itemNumber: orderItem.data.item["item-number"],
          },
          type: type,
        })
      );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};