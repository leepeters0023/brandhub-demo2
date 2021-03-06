import { createSlice } from "@reduxjs/toolkit";
import {
  fetchSingleOrderSetByType,
  addOrderSetItem,
  createOrderSet,
} from "../../api/orderApi";
import { fetchProgramItems } from "../../api/programApi";
import {
  setIsLoading as setOrderSetLoading,
  fetchProgramOrders,
} from "./orderSetSlice";
import { fetchPreOrders } from "./preOrderDetailSlice";
import { setError } from "./errorSlice";
import { startGlobalLoad, stopGlobalLoad } from "./globalLoadSlice";
import { mapOrderSet } from "../apiMaps";

let initialState = {
  isLoading: false,
  orderUpdateLoading: false,
  inStockOrderNumber: null,
  inStockOrderItems: [],
  selectedInStockItems: [],
  currentWarehouse: null,
  inStockOrderTerritory: null,
  inStockChannel: null,
  onDemandOrderNumber: null,
  selectedOnDemandItems: [],
  onDemandOrderItems: [],
  onDemandOrderTerritory: null,
  onDemandChannel: null,
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
      const { type, orderId, item, territoryId, channel } = action.payload;
      state[`${type}OrderNumber`] = orderId;
      state[`${type}OrderItems`] = [{ item }];
      state[`${type}OrderTerritory`] = territoryId;
      state[`${type}Channel`] = channel;
      state.orderId = orderId;
      state.isLoading = false;
      state.orderUpdateLoading = false;
      state.error = null;
    },
    createNewBulkOrderSuccess(state, action) {
      const {
        type,
        orderId,
        itemArray,
        territoryId,
        channel,
      } = action.payload;
      state[`${type}OrderNumber`] = orderId;
      state[`${type}OrderItems`] = itemArray;
      state[`${type}OrderTerritory`] = territoryId;
      state[`${type}Channel`] = channel;
      state.orderId = orderId;
      state.isLoading = false;
      state.orderUpdateLoading = false;
      state.error = null;
    },
    getCurrentOrderSuccess(state, action) {
      const { order, itemReference, warehouse } = action.payload;
      if (order.type === "In Stock") {
        state.inStockOrderNumber = order.id;
        state.inStockOrderItems = itemReference;
        state.inStockOrderTerritory = order.territoryId;
        state.inStockChannel = order.channel;
      } else if (order.type === "On Demand") {
        state.onDemandOrderNumber = order.id;
        state.onDemandOrderItems = itemReference;
        state.onDemandOrderTerritory = order.territoryId;
        state.onDemandChannel = order.channel;
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
      if (warehouse) {
        state.currentWarehouse = warehouse;
      }
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
    addBulkItems(state, action) {
      const { itemArray, type } = action.payload;
      let items;
      if (type === "inStock") {
        items = [...state.inStockOrderItems];
      } else if (type === "onDemand") {
        items = [...state.onDemandOrderItems];
      }
      items = items.concat(itemArray);
      state[`${type}OrderItems`] = items;
      state.isLoading = false;
      state.orderUpdateLoading = false;
      state.error = null;
    },
    updateSelection(state, action) {
      const { type, selectedItems } = action.payload;
      state[type] = selectedItems;
    },
    updateCurrentWarehouse(state, action) {
      const { warehouse } = action.payload;
      state.currentWarehouse = warehouse;
    },
    clearItemSelections(state) {
      state.selectedInStockItems = [];
      //state.currentWarehouse = null;
      state.selectedOnDemandItems = [];
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
    clearOrderByType(state, action) {
      const { type } = action.payload;
      if (type === "inStock") {
        state.inStockOrderNumber = null;
        state.inStockOrderItems = [];
        state.inStockOrderTerritory = null;
        state.inStockChannel = null;
      } else if (type === "onDemand") {
        state.onDemandOrderNumber = null;
        state.onDemandOrderItems = [];
        state.onDemandOrderTerritory = null;
        state.onDemandChannel = null;
      }
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
  createNewBulkOrderSuccess,
  getCurrentOrderSuccess,
  addNewItem,
  addBulkItems,
  updateSelection,
  updateCurrentWarehouse,
  clearItemSelections,
  clearCurrentOrder,
  clearOrderByType,
  updateSuccess,
  setFailure,
} = currentOrderSlice.actions;

export default currentOrderSlice.reducer;

export const createNewOrder = (
  type,
  itemNumber,
  territoryId,
  channel
) => async (dispatch) => {
  try {
    dispatch(setUpdateLoading());
    let newOrder = await createOrderSet(type, territoryId, channel);
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
        item: {
          id: orderItem.data.id,
          itemNumber: orderItem.data.item["item-number"],
        },
        territoryId: territoryId,
        channel: channel,
      })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(setError({ error: err.toString() }));
  }
};

export const createNewBulkItemOrder = (
  type,
  itemArray,
  territoryId,
  channel,
  programId,
  userId
) => async (dispatch) => {
  try {
    dispatch(setUpdateLoading());
    if (type === "preOrder") {
      dispatch(setOrderSetLoading());
    }
    let newOrder = await createOrderSet(
      type,
      territoryId,
      channel,
      programId
    );
    if (newOrder.error) {
      throw newOrder.error;
    }
    let currentItems = itemArray.length > 0 ? [...itemArray] : [];
    if (type === "preOrder" && itemArray.length === 0) {
      let programItems = await fetchProgramItems(programId);
      if (programItems.error) {
        throw programItems.error;
      }
      currentItems = programItems.data.map((item) => item.id);
    }
    let orderItems = [];
    let orderErrors = [];
    await Promise.all(
      currentItems.map(async (id) => {
        const itemStatus = await addOrderSetItem(newOrder.data.id, id);
        if (itemStatus.error) {
          orderErrors.push(itemStatus.error);
        } else {
          orderItems.push({
            id: itemStatus.data.id,
            itemNumber: itemStatus.data.item["item-number"],
          });
        }
      })
    );
    if (orderItems.length > 0) {
      dispatch(
        createNewBulkOrderSuccess({
          orderId: newOrder.data.id,
          itemArray: orderItems,
          type: type,
          territoryId: territoryId,
          channel: channel,
        })
      );
      if (type === "preOrder") {
        dispatch(fetchProgramOrders(programId, userId, territoryId));
        dispatch(fetchPreOrders(userId, "summary", programId, territoryId));
      }
    }
    if (orderErrors.length > 0) {
      throw orderErrors.join(", ");
    }
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(setError({ error: err.toString() }));
  }
};

export const fetchCurrentOrderByType = (type, userId) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    dispatch(startGlobalLoad());
    let order = await fetchSingleOrderSetByType(type, userId);
    if (order.error) {
      throw order.error;
    }
    let currentWarehouse;
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
      formattedOrder = mapOrderSet(order.data[0]);
      itemReferenceArray = order.data[0]["order-set-items"].map((item) => ({
        id: item.id,
        itemNumber: item.item["item-number"],
      }));
    }
    if (
      type === "inStock" &&
      order.data.length > 0 &&
      order.data[0].orders.length > 0
    ) {
      currentWarehouse = order.data[0].orders[0].warehouse;
    }
    dispatch(
      getCurrentOrderSuccess({
        order: formattedOrder,
        itemReference: itemReferenceArray,
        warehouse: currentWarehouse ? currentWarehouse : null,
      })
    );
    dispatch(stopGlobalLoad());
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(setError({ error: err.toString() }));
    dispatch(stopGlobalLoad());
  }
};

export const addNewOrderItem = (orderId, itemId, type) => async (dispatch) => {
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
    dispatch(setError({ error: err.toString() }));
  }
};

export const addBulkOrderItems = (orderId, itemArray, type) => async (
  dispatch
) => {
  try {
    dispatch(setUpdateLoading());
    let orderItems = [];
    let orderErrors = [];
    await Promise.all(
      itemArray.map(async (id) => {
        const itemStatus = await addOrderSetItem(orderId, id);
        if (itemStatus.error) {
          orderErrors.push(itemStatus.error);
        } else {
          orderItems.push({
            id: itemStatus.data.id,
            itemNumber: itemStatus.data.item["item-number"],
          });
        }
      })
    );
    if (orderItems.length > 0) {
      dispatch(addBulkItems({ itemArray: orderItems, type: type }));
    }
    if (orderErrors.length > 0) {
      throw orderErrors.join(", ");
    }
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(setError({ error: err.toString() }));
  }
};
