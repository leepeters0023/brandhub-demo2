import { createSlice } from "@reduxjs/toolkit";
//import { fetchOrders } from "../../api/orderApi";
import { fetchOrdersByProgram, fetchOrderSetById } from "../../api/orderApi";

import { setPreOrderDetails } from "./preOrderDetailSlice";

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
            ordTotal += item.estTotal;
            currentItems.find(
              (cItem) => item.itemNumber === cItem.itemNumber
            ).totalItems += item.totalItems;
            currentItems.find(
              (cItem) => item.itemNumber === cItem.itemNumber
            ).estTotal += item.estTotal;
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
      let currentOrder = orders.find((ord) => ord.orderNumber === orderNumber);
      let newItems = currentOrder.items.map((item) => {
        if (item.itemNumber === itemNumber) {
          let numVal = value === "" ? 0 : parseInt(value);
          return {
            ...item,
            totalItems: numVal,
            estTotal: numVal * item.estCost,
          };
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
      state.orderTotal = ordTotal;
    },
    removeGridItem(state, action) {
      const { itemNum } = action.payload;
      state.orderTotal -= state.items.find(
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
    removeGridOrder(state, action) {
      const { orderId } = action.payload;
      let deleteOrder = state.orders.find(
        (order) => order.orderNumber === orderId
      );
      state.orderTotal -= deleteOrder.estTotal;
      let currentOrders = state.orders.filter(
        (order) => order.orderNumber !== orderId
      );
      state.orders = currentOrders;
      let currentItems = [...state.items];
      currentItems = currentItems.map((item) => {
        let editItem = deleteOrder.items.find(
          (i) => i.itemNumber === item.itemNumber
        );
        return {
          ...item,
          estTotal: item.estTotal - editItem.estTotal,
          totalItems: item.totalItems - editItem.totalItems,
        };
      });
      state.items = currentItems;
    },
    updateOrderDetails(state, action) {
      const { orderNumber, note, attn } = action.payload;
      let currentOrders = state.orders.map((order) => {
        if (order.orderNumber === orderNumber) {
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
    let currentItems = currentOrders.data["order-set-items"].map((item) => ({
      id: item.id,
      complianceStatus: item.item["compliance-status"],
      itemNumber: item.item["item-number"],
      brand: item.item.brands.map((brand) => brand.name).join(", "),
      itemType: item.item.type,
      estCost: item.item["estimated-cost"],
      packSize: item.item["qty-per-pack"],
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
    let orders = currentOrders.data.orders.map((ord) => ({
      orderNumber: ord.id,
      distributorId: ord.distributor.id,
      distributorName: ord.distributor.name,
      distributorCity: ord.distributor.city,
      distributorState: ord.distributor.state,
      note: ord.notes ? ord.notes : "",
      attn: ord.attn ? ord.attn : "",
      type: "program",
      program: ord.program ? ord.program.id : null,
      items: ord["order-items"]
        .map((item) => ({
          id: item.id,
          complianceStatus: item.item["compliance-status"],
          itemNumber: item.item["item-number"],
          itemType: item.item.type,
          estCost: item.item["estimated-cost"],
          packSize: item.item["qty-per-pack"],
          estTotal: item.qty * item.item["cost"],
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
        .map((item) => item.qty * item.item["cost"])
        .reduce((a, b) => a + b),
    }));

    orders.sort((a, b) => {
      return a.distributorName < b.distributorName
        ? -1
        : a.distributorName > b.distributorName
        ? 1
        : 0;
    });

    let orderTotal = currentOrders.data["total-cost"];
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
    console.log(currentOrders.data[0]["order-set-items"]);
    let currentItems = currentOrders.data[0]["order-set-items"].map((item) => ({
      id: item.id,
      complianceStatus: item.item["compliance-status"],
      itemNumber: item.item["item-number"],
      brand: item.item.brands.map((brand) => brand.name).join(", "),
      itemType: item.item.type,
      estCost: item.item["estimated-cost"],
      packSize: item.item["qty-per-pack"],
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
          estCost: item.item["estimated-cost"],
          packSize: item.item["qty-per-pack"],
          estTotal: item.qty * item.item["estimated-cost"],
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
        .map((item) => item.qty * item.item["cost"])
        .reduce((a, b) => a + b),
    }));

    orders.sort((a, b) => {
      return a.distributorName < b.distributorName
        ? -1
        : a.distributorName > b.distributorName
        ? 1
        : 0;
    });
    let orderTotal = currentOrders.data[0]["total-cost"];
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
