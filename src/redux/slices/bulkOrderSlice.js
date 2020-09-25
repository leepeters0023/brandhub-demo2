import { createSlice } from "@reduxjs/toolkit";
import { fetchBulkOrders } from "../../api/orderApi";

let initialState = {
  isLoading: false,
  bulkOrderId: null,
  status: null,
  items: [],
  orders: [],
  bulkOrderTotal: 0,
  bulkOrderNote: "",
  error: null,
}

const startLoading = (state) => {
  state.isLoading = true;
};

const loadingFailed = (state, action) => {
  const { error } = action.payload;
  state.isLoading = false;
  state.error = error;
};

const bulkOrderSlice = createSlice({
  name: "bulkOrder",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    buildTableFromOrders(state, action) {
      const { bulkOrderId, orders, items, status, note } = action.payload;
      if (orders.length !== 0) {
        let currentItems = [...items];
        let ordTotal = 0;
        orders.forEach((ord) => {
          let orderItems = [...ord.items];
          orderItems.forEach((item) => {
            ordTotal += item.estTotal;
            currentItems.find(
              (cItem) => item.itemNumber === cItem.itemNumber
            ).totalItems += item.totalItems;
            currentItems.find(
              (cItem) => item.itemNumber === cItem.itemNumber
            ).estTotal += item.estTotal;
          });
        });
        state.bulkOrderId = bulkOrderId;
        state.status = status;
        state.items = currentItems;
        state.orders = [...orders];
        state.bulkOrderNote = note;
        state.bulkOrderTotal = ordTotal;
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
      let currentOrder = orders.find((ord) => ord.orderNumber === orderNumber);
      let newItems = currentOrder.items.map((item) => {
        if (item.itemNumber === itemNumber) {
          let numVal = value === "" ? 0 : parseInt(value);
          return { ...item, totalItems: numVal, estTotal: numVal * item.price };
        } else return item;
      });
      let newTotalItems = 0;
      let newEstTotal = 0;
      newItems.forEach((item) => {
        newTotalItems += item.totalItems;
        newEstTotal += item.estTotal;
      });
      currentOrder.items = [...newItems];
      currentOrder.totalItems = newTotalItems;
      currentOrder.estTotal = newEstTotal;
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
          .estTotal;
        ord.items.forEach((item) => (ordTotal += item.estTotal));
      });
      currentItem.totalItems = totalItems;
      currentItem.estTotal = totalEstCost;
      items.splice(items.indexOf(currentItem), 1, currentItem);
      state.items = [...items];
      state.bulkOrderTotal = ordTotal;
    },
    removeGridItem(state, action) {
      const { itemNum } = action.payload;
      state.bulkOrderTotal -= state.items.find(
        (item) => item.itemNumber === itemNum
      ).estTotal;
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
        let estTotal = 0;
        currentItems.forEach((item) => {
          totalItems += item.totalItems;
          estTotal += item.estTotal;
        });
        ord.items = currentItems;
        ord.totalItems = totalItems;
        ord.totalEstCost = estTotal;
      });
      state.orders = currentOrders;
    },
    updateOrderDetails(state, action) {
      const { orderNumber, note, attn } = action.payload
      let currentOrders = state.orders.map((order) => {
        if (order.orderNumber === orderNumber) {
          return {
            ...order,
            note: note ? note : "",
            attn: attn ? attn : ""
          }
        } else return order
      })
      state.orders = currentOrders;
    },
    updateBulkOrderNote(state, action) {
      const { value } = action.payload;
      if (value.length <= 300) {
        state.bulkOrderNote = value;
      }
    },
    setBulkOrderStatus(state, action) {
      const { status } = action.payload;
      state.status = status;
    },
    resetState(state) {
      state.isLoading = false;
      state.bulkOrderId = null;
      state.status = null;
      state.items = [];
      state.orders = [];
      state.bulkOrderTotal = 0;
      state.bulkOrderNote = "";
      state.error = null;
    },
    setFailure: loadingFailed,
  }
})

export const {
  setIsLoading,
  buildTableFromOrders,
  setGridItem,
  setItemTotal,
  removeGridItem,
  updateOrderDetails,
  updateBulkOrderNote,
  setBulkOrderStatus,
  resetState,
  setFailure,
} = bulkOrderSlice.actions;

export default bulkOrderSlice.reducer;

export const fetchBulkOrdersByType = (type, userId) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const currentOrders = await fetchBulkOrders(type, userId);
    if (currentOrders.error) {
      throw currentOrders.error;
    }
    let currentItems = currentOrders.data[0]["pre-order-items"].map((item) => ({
      id: item.id,
      complianceStatus: item.item["compliance-status"],
      itemNumber: item.item["item-number"],
      brand: item.item.brand.name,
      itemType: item.item.type,
      price: item.item.cost,
      qty: `${item.item["qty-per-pack"]} / pack`,
      imgUrl: item.item["img-url"],
      estTotal: 0,
      totalItems: 0,
    }));

    currentItems.sort((a, b) => {
      return parseInt(a.itemNumber) < parseInt(b.itemNumber)
        ? -1
        : parseInt(a.itemNumber) > parseInt(b.itemNumber)
        ? 1
        : 0;
    });

    let orders = currentOrders.data[0].orders.map((ord) => ({
      orderNumber: ord.id,
      distributorId: ord.distributor.id,
      distributorName: ord.distributor.name,
      distributorCity: ord.distributor.city,
      distributorState: ord.distributor.state,
      note: ord.notes ? ord.notes : "",
      attn: ord.attn ? ord.attn : "",
      type: "program",
      program: ord.program.id,
      items: ord["order-items"]
        .map((item) => ({
          id: item.id,
          complianceStatus: item.item["compliance-status"],
          itemNumber: item.item["item-number"],
          itemType: item.item.type,
          price: item.item.cost,
          estTotal: item.qty * item.item.cost,
          totalItems: item.qty,
        }))
        .sort((a, b) => {
          return parseInt(a.itemNumber) < parseInt(b.itemNumber)
            ? -1
            : parseInt(a.itemNumber) > parseInt(b.itemNumber)
            ? 1
            : 0;
        }),
      totalItems: ord["order-items"]
        .map((item) => item.qty)
        .reduce((a, b) => a + b),
      estTotal: ord["order-items"]
        .map((item) => item.qty * item.item.cost)
        .reduce((a, b) => a + b),
    }));

    orders.sort((a, b) => {
      return a.distributorName < b.distributorName
        ? -1
        : a.distributorName > b.distributorName
        ? 1
        : 0;
    });

    let bulkOrderId = currentOrders.data[0].id;
    let bulkOrderStatus = currentOrders.data[0].status;
    let note = currentOrders.data[0].notes ? currentOrders.data[0].notes : ""

    dispatch(
      buildTableFromOrders({
        bulkOrderId: bulkOrderId,
        orders: orders,
        items: currentItems,
        status: bulkOrderStatus,
        note: note
      })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};