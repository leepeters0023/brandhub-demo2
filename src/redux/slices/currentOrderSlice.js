import { createSlice } from "@reduxjs/toolkit";
import {
  fetchSingleOrder,
  fetchSingleOrderByType,
  deleteOrder,
  addOrderItem,
  patchOrderItem,
  createOrder,
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
  orderNumber: null,
  distributorId: null,
  distributorName: null,
  attention: "",
  type: null,
  status: null,
  orderDate: null,
  items: [],
  rushOrder: false,
  budget: null,
  totalItems: 0,
  totalCost: 0,
  orderNote: "",
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
      state.isLoading = false;
      state.orderUpdateLoading = false;
      state.error = null;
    },
    getCurrentOrderSuccess(state, action) {
      const { order, orderItems, itemReference } = action.payload;
      if (order.type === "in-stock") {
        state.inStockOrderNumber = order.id;
        state.inStockOrderItems = [...itemReference];
      } else if (order.type === "on-demand") {
        state.onDemandOrderNumber = order.id;
        state.onDemandOrderItems = [...itemReference];
      }
      state.isLoading = false;
      state.orderUpdateLoading = false;
      state.userId = order.userId;
      state.userName = order.userName;
      state.orderNumber = order.id;
      state.distributorId = order.distributorId;
      state.distributorName = order.distributorName;
      state.attention = order.attn;
      state.type = order.type;
      state.status = order.status;
      state.orderDate = order.orderDate;
      state.items = [...orderItems];
      state.rushOrder = order.rushOrder;
      state.budget = order.budget;
      state.totalItems = order.totalItems;
      state.totalCost = order.totalCost;
      state.orderNote = order.note;
      state.error = null;
    },
    updateCurrentOrder(state, action) {
      const { id, totalItems } = action.payload;
      let items = [...state.items];
      let currentItem = items.find((i) => i.id === id);
      let tempOrderTotalItems = state.totalItems - currentItem.totalItems;
      let tempOrderTotalCost = state.totalCost - currentItem.estTotal;
      currentItem.totalItems = totalItems;
      tempOrderTotalItems += totalItems;
      currentItem.estTotal = totalItems * currentItem.price;
      tempOrderTotalCost += totalItems * currentItem.price;
      items.splice(items.indexOf(currentItem), 1, currentItem);
      state.items = items;
      state.totalItems = tempOrderTotalItems;
      state.totalCost = tempOrderTotalCost;
      state.orderUpdateLoading = false;
      state.error = null;
    },
    addNewItem(state, action) {
      const { item, type } = action.payload;
      let items = [...state[`${type}OrderItems`]];
      items.push(item);
      state[`${type}OrderItems`] = items;
      state.isLoading = false;
      state.orderUpdateLoading = false;
      state.error = null;
    },
    setShippingLocation(state, action) {
      const { location } = action.payload;
      state.distributorName = location.name;
      state.distributorId = location.id;
    },
    addAttention(state, action) {
      const { attention } = action.payload;
      state.attention = attention;
    },
    updateOrderNote(state, action) {
      const { value } = action.payload;
      if (value.length <= 300) {
        state.orderNote = value;
      }
    },
    setRushOrder(state, action) {
      const { rush } = action.payload;
      state.rushOrder = rush;
    },
    removeItem(state, action) {
      const { id } = action.payload;
      let items = [...state.items];
      let currentItem = items.find((i) => i.id === id);
      state.totalItems -= currentItem.totalItems;
      state.totalCost -= currentItem.estTotal;
      state.items = items.filter((i) => i.itemNumber !== id);
    },
    clearCurrentOrder(state) {
      state.isLoading = false;
      state.orderUpdateLoading = false;
      state.userId = null;
      state.userName = null;
      state.orderNumber = null;
      state.distributorId = null;
      state.distributorName = null;
      state.attention = "";
      state.type = null;
      state.status = null;
      state.items = [];
      state.rushOrder = false;
      state.budget = null;
      state.totalItems = 0;
      state.totalCost = 0;
      state.orderNote = "";
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
  updateCurrentOrder,
  addNewItem,
  setShippingLocation,
  addAttention,
  updateOrderNote,
  setRushOrder,
  removeItem,
  clearCurrentOrder,
  updateSuccess,
  setFailure,
} = currentOrderSlice.actions;

export default currentOrderSlice.reducer;

export const createNewOrder = (type, itemNumber, qty) => async (dispatch) => {
  try {
    dispatch(setUpdateLoading());
    let newOrder = await createOrder(type);
    if (newOrder.error) {
      throw newOrder.error;
    }
    let orderItem = await addOrderItem(newOrder.data.id, itemNumber, qty);
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
    let order = await fetchSingleOrderByType(type, userId);
    if (order.error) {
      throw order.error;
    }
    let formattedOrder = {
      userId: order.data.user.id,
      userName: order.data.user.name,
      id: order.data.id,
      distributorName: order.data.distributor.name,
      distributorId: order.data.distributor.id,
      attn: order.data.attn,
      type: order.data.type,
      status: order.data.status[0].toUpperCase() + order.data.status.slice(1),
      orderDate: order.data["order-date"] ? order.data["order-date"] : "---",
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
        items: formattedItems,
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
      distributorName: order.data.distributor.name,
      distributorId: order.data.distributor.id,
      attn: order.data.attn,
      type: order.data.type,
      status: order.data.status[0].toUpperCase() + order.data.status.slice(1),
      orderDate: order.data["order-date"] ? order.data["order-date"] : "---",
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
        items: formattedItems,
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

export const addNewOrderItem = (
  orderId,
  itemNumber,
  orderItemId,
  qty,
  type
) => async (dispatch) => {
  try {
    dispatch(setUpdateLoading());
    if (!orderItemId) {
      let orderItem = await addOrderItem(orderId, itemNumber, qty);
      if (orderItem.error) {
        throw orderItem.error;
      }
      dispatch(
        addNewItem(
          {
            item: { id: orderItem.data.id, itemNumber: orderItem.data.item.id },
          },
          type
        )
      );
    } else {
      let patchStatus = await patchOrderItem(orderItemId, qty);
      if (patchStatus.error) {
        throw patchStatus.error;
      }
      dispatch(updateSuccess());
    }
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};
