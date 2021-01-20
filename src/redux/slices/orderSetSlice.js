import { createSlice } from "@reduxjs/toolkit";
import {
  fetchOrdersByProgram,
  fetchOrderSetById,
  addSingleOrderToSet,
  addCustomAddressOrderToSet,
} from "../../api/orderApi";
import { fetchDistributorsByTerritory } from "../../api/distributorApi";
import { addAddress } from "../../api/addressApi";
import { setPreOrderDetails } from "./preOrderDetailSlice";
import {
  setIsLoading as patchLoading,
  patchSuccess,
  setFailure as patchFailure,
} from "./patchOrderSlice";
import { addPreOrderItems, resetPreOrderItems } from "./programsSlice";

import { mapOrderItems, mapOrderHistoryOrders } from "../apiMaps";

let initialState = {
  isLoading: false,
  isOrderLoading: false,
  orderId: null,
  type: null,
  status: null,
  isComplete: null,
  items: [],
  orders: [],
  stateFilter: null,
  totalEstItemCost: 0,
  orderTotal: 0,
  totalEstFreight: 0,
  totalEstTax: 0,
  orderNote: "",
  rebuildRef: false,
  error: null,
};

const startLoading = (state) => {
  state.isLoading = true;
};

const startOrderLoading = (state) => {
  state.isOrderLoading = true;
};

const loadingFailed = (state, action) => {
  const { error } = action.payload;
  state.isLoading = false;
  state.isOrderLoading = false;
  state.error = error;
};

const orderSetSlice = createSlice({
  name: "orderGrouping",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    setOrderLoading: startOrderLoading,
    buildTableFromOrders(state, action) {
      const {
        orderId,
        type,
        orders,
        items,
        status,
        isComplete,
        note,
        totalEstFreight,
        totalEstTax,
      } = action.payload;
      let currentItems = [...items];
      if (orders.length !== 0) {
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
        state.isComplete = isComplete;
        state.type = type;
        state.items = currentItems;
        state.orders = [...orders];
        state.orderNote = note;
        state.totalEstItemCost = ordTotal;
        state.orderTotal = ordTotal + totalEstFreight + totalEstTax;
        state.totalEstFreight = totalEstFreight;
        state.totalEstTax = totalEstTax;
        state.isLoading = false;
        state.error = null;
      } else {
        state.orders = [];
        state.orderId = orderId;
        state.status = status;
        state.isComplete = isComplete;
        state.type = type;
        state.items = currentItems;
        state.orderNote = note;
        state.totalEstItemCost = 0;
        state.orderTotal = 0;
        state.totalEstFreight = 0;
        state.isLoading = false;
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
      state.totalEstItemCost = ordTotal;
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
    setIsComplete(state, action) {
      const { status } = action.payload;
      state.isComplete = status;
    },
    updateSetItemDate(state, action) {
      const { id, date } = action.payload;
      const currentItems = state.items.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            inMarketDate: date,
          };
        } else return { ...item };
      });
      state.items = currentItems;
    },
    updateSetItemRush(state, action) {
      const { id, status } = action.payload;
      const currentItems = state.items.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            isRush: status,
          };
        } else return { ...item };
      });
      state.items = currentItems;
    },
    setRebuildRef(state) {
      state.rebuildRef = !state.rebuildRef;
    },
    addOrderSuccess(state, action) {
      const { order } = action.payload;
      const currentOrders = state.orders
        .map((ord) => ({ ...ord }))
        .concat(order);
      currentOrders.sort((a, b) => {
        return a.distributorName < b.distributorName
          ? -1
          : a.distributorName > b.distributorName
          ? 1
          : 0;
      });
      state.orders = [...currentOrders];
      state.isOrderLoading = false;
      state.error = null;
    },
    addMultipleOrdersSuccess(state, action) {
      const { orders } = action.payload;
      const currentOrders = state.orders
        .map((ord) => ({ ...ord }))
        .concat(orders);
      currentOrders.sort((a, b) => {
        return a.distributorName < b.distributorName
          ? -1
          : a.distributorName > b.distributorName
          ? 1
          : 0;
      });
      state.orders = [...currentOrders];
      state.isOrderLoading = false;
      state.error = null;
    },
    setStateFilter(state, action) {
      const { stateCode } = action.payload;
      state.stateFilter = stateCode;
    },
    clearOrderSet(state) {
      state.isLoading = false;
      state.orderId = null;
      state.type = null;
      state.status = null;
      state.isComplete = null;
      state.items = [];
      state.orders = [];
      state.stateFilter = null;
      state.totalEstItemCost = 0;
      state.orderTotal = 0;
      state.totalEstFreight = 0;
      state.totalEstTax = 0;
      state.orderNote = "";
      state.error = null;
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  setOrderLoading,
  buildTableFromOrders,
  setGridItem,
  setItemTotal,
  removeGridItem,
  removeGridOrder,
  updateOrderDetails,
  updateOrderNote,
  setOrderStatus,
  setIsComplete,
  clearOrderSet,
  setRebuildRef,
  updateSetItemDate,
  updateSetItemRush,
  addOrderSuccess,
  addMultipleOrdersSuccess,
  setStateFilter,
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
      let aName = a.distributorName ? a.distributorName : a.customAddressName;
      let bName = b.distributorName ? b.distributorName : b.customAddressName;
      return aName < bName ? -1 : aName > bName ? 1 : 0;
    });

    let totalFreight = 0;
    let totalTax = 0;
    orders.forEach((ord) => {
      totalFreight += ord.totalEstFreight;
      totalTax += ord.totalEstTax;
    });

    let type = currentOrders.data.type;
    let orderId = currentOrders.data.id;
    let orderStatus = currentOrders.data.status;
    let complete = currentOrders.data["is-work-complete"];
    let totalEstFreight = totalFreight;
    let totalEstTax = totalTax;
    let territories =
      currentOrders.data["territory-names"].length === 0
        ? ["National"]
        : currentOrders.data["territory-names"].split(", ");
    let note = currentOrders.data.notes ? currentOrders.data.notes : "";
    dispatch(
      setPreOrderDetails({
        territories: territories,
        programId: null,
      })
    );

    dispatch(
      buildTableFromOrders({
        orderId: orderId,
        type: type,
        orders: orders,
        items: currentItems,
        status: orderStatus,
        isComplete: complete,
        note: note,
        totalEstFreight: totalEstFreight,
        totalEstTax: totalEstTax,
      })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const fetchProgramOrders = (program, userId, terrId) => async (
  dispatch
) => {
  try {
    dispatch(setIsLoading());
    dispatch(resetPreOrderItems());
    const currentOrders = await fetchOrdersByProgram(program, userId, terrId);
    if (currentOrders.error) {
      throw currentOrders.error;
    }
    console.log(currentOrders);
    let currentItems = mapOrderItems(
      currentOrders.data[0]["order-set-items"],
      "order-set-item"
    );
    let orders = mapOrderHistoryOrders(currentOrders.data[0].orders);
    orders.sort((a, b) => {
      let aName = a.distributorName ? a.distributorName : a.customAddressName;
      let bName = b.distributorName ? b.distributorName : b.customAddressName;
      return aName < bName ? -1 : aName > bName ? 1 : 0;
    });

    let totalFreight = 0;
    let totalTax = 0;
    orders.forEach((ord) => {
      totalFreight += ord.totalEstFreight;
      totalTax += ord.totalEstTax;
    });

    let type = currentOrders.data[0].type;
    let orderId = currentOrders.data[0].id;
    let orderStatus = currentOrders.data[0].status;
    let complete = currentOrders.data[0]["is-work-complete"];
    let totalEstFreight = totalFreight;
    let totalEstTax = totalTax;
    let territories =
      currentOrders.data[0].program.type === "National"
        ? ["National"]
        : currentOrders.data[0]["territory-names"].split(", ");
    let note = currentOrders.data[0].notes ? currentOrders.data[0].notes : "";
    dispatch(
      setPreOrderDetails({
        territories: territories,
        programId: program,
      })
    );
    dispatch(
      buildTableFromOrders({
        orderId: orderId,
        type: type,
        orders: orders,
        items: currentItems,
        status: orderStatus,
        isComplete: complete,
        note: note,
        totalEstFreight: totalEstFreight,
        totalEstTax: totalEstTax,
      })
    );
    dispatch(addPreOrderItems({ ids: currentItems.map((i) => i.itemId) }));
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const createSingleOrder = (id, dist, type) => async (dispatch) => {
  try {
    dispatch(setOrderLoading());
    dispatch(patchLoading());
    const order = await addSingleOrderToSet(id, dist, type);
    if (order.error) {
      throw order.error;
    }
    const formattedOrder = mapOrderHistoryOrders([order.data]);
    dispatch(addOrderSuccess({ order: formattedOrder }));
    dispatch(setRebuildRef());
    dispatch(patchSuccess());
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(patchFailure({ error: err.toString() }));
  }
};

export const createMultipleOrders = (idArray, id, type) => async (dispatch) => {
  try {
    dispatch(setOrderLoading());
    dispatch(patchLoading());
    const orders = [];
    await Promise.all(
      idArray.map(async (distId) => {
        const order = await addSingleOrderToSet(id, distId, type);
        if (order.error) {
          throw order.error;
        }
        orders.push(order.data);
      })
    );
    let mappedOrders = mapOrderHistoryOrders(orders);
    dispatch(addMultipleOrdersSuccess({ orders: mappedOrders }));
    dispatch(setRebuildRef());
    dispatch(patchSuccess());
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(patchFailure({ error: err.toString() }));
  }
};

export const createAllOrders = (territoryId, id, type) => async (dispatch) => {
  try {
    dispatch(setOrderLoading());
    dispatch(patchLoading());
    const distributors = await fetchDistributorsByTerritory(territoryId);
    if (distributors.error) {
      throw distributors.error;
    }
    let idArray = distributors.data.map((dist) => dist.id);
    const orders = [];
    await Promise.all(
      idArray.map(async (distId) => {
        const order = await addSingleOrderToSet(id, distId, type);
        if (order.error) {
          throw order.error;
        }
        orders.push(order.data);
      })
    );
    let mappedOrders = mapOrderHistoryOrders(orders);
    dispatch(addMultipleOrdersSuccess({ orders: mappedOrders }));
    dispatch(setRebuildRef());
    dispatch(patchSuccess());
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(patchFailure({ error: err.toString() }));
  }
};

export const addCustomAddressOrder = (address, id, type, addId) => async (
  dispatch
) => {
  try {
    dispatch(setOrderLoading());
    dispatch(patchLoading());
    let addressId = addId ? addId : null;
    if (!addressId) {
      const newAddress = await addAddress(address);
      if (newAddress.error) {
        throw newAddress.error;
      }
      addressId = newAddress.data.id;
    }
    const order = await addCustomAddressOrderToSet(id, addressId, type);
    if (order.error) {
      throw order.error;
    }
    const formattedOrder = mapOrderHistoryOrders([order.data]);
    dispatch(addOrderSuccess({ order: formattedOrder }));
    dispatch(setRebuildRef());
    dispatch(patchSuccess());
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(patchFailure({ error: err.toString() }));
  }
};
