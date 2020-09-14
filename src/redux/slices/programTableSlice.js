import { createSlice } from "@reduxjs/toolkit";

import { fetchOrdersByProgram, fetchAllPreOrders } from "../../api/orderApi";

import { setProgramStatus } from "./programsSlice";

/*
* Data Format:
programsTable: {
  isLoading: bool,
  programId: string,
  items: [
    (array of items sorted by itemNumber)
    {
      itemNumber: string,
      brand: string,
      itemType: string,
      price: float,
      qty: string,
      imgUrl: string,
      complianceStatus: string,
      totalItems: int,
      estTotal: float,
    }
  ]
  orders: [
    (array of orders sorted alphabetically by distributor name)
    {
      orderNumber: string,
      distributorId: string,
      distributorName: string,
      type: string,
      program: null || [...string(programIds)],
      status: string,
      items: [...{ itemObj } sorted by itemNumber],
      shipping: { shippingObj },
      budget: string,
      totalItems: int,
      totalEstCost: float,
    }
  ],
  programTotal: float,
  preOrderTotal: {
    currentTotal: float (fetched from db for initial total value),
    actualTotal: float (based on change in the current program)
  }
  error: null || string
}
*/

let initialState = {
  isLoading: false,
  initialPreOrderLoading: false,
  preOrderSummaryLoading: false,
  preOrderSummary: [],
  status: null,
  preOrderId: null,
  programId: null,
  territories: [],
  items: [],
  orders: [],
  programTotal: 0,
  preOrderTotal: {
    initialTotal: 0,
    updatedTotal: 0,
  },
  preOrderNote: "",
  error: null,
};

const startLoading = (state) => {
  state.isLoading = true;
};

const startInitialLoading = (state) => {
  state.initialPreOrderLoading = true;
};

const startSummaryLoading = (state) => {
  state.preOrderSummaryLoading = true;
};

const loadingFailed = (state, action) => {
  const { error } = action.payload;
  state.isLoading = false;
  state.error = error;
};

const programTableSlice = createSlice({
  name: "programTable",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    setInitialPreOrdersLoading: startInitialLoading,
    setSummaryLoading: startSummaryLoading,
    setPreOrderSummary(state, action) {
      const { preOrders, totalCost } = action.payload;
      state.preOrderSummary = [...preOrders];
      state.preOrderTotal.initialTotal = totalCost;
      state.preOrderTotal.updatedTotal = totalCost;
      state.initialPreOrderLoading = false;
      state.preOrderSummaryLoading = false;
      state.error = null;
    },
    buildTableFromOrders(state, action) {
      const {
        programId,
        orders,
        items,
        preOrderId,
        status,
        territories,
      } = action.payload;
      if (orders.length !== 0) {
        let currentItems = [...items];
        let progTotal = 0;
        orders.forEach((ord) => {
          let orderItems = [...ord.items];
          orderItems.forEach((item) => {
            progTotal += item.estTotal;
            currentItems.find(
              (cItem) => item.itemNumber === cItem.itemNumber
            ).totalItems += item.totalItems;
            currentItems.find(
              (cItem) => item.itemNumber === cItem.itemNumber
            ).estTotal += item.estTotal;
          });
        });
        state.preOrderId = preOrderId;
        state.programId = programId;
        state.status = status;
        state.territories = [...territories];
        state.items = currentItems;
        state.orders = [...orders];
        state.programTotal = progTotal;
        state.isLoading = false;
      } else {
        state.orders = [];
        state.items = [];
        state.isLoading = false;
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
      let progTotal = 0;
      state.orders.forEach((ord) => {
        totalItems += ord.items.find((item) => item.itemNumber === itemNumber)
          .totalItems;
        totalEstCost += ord.items.find((item) => item.itemNumber === itemNumber)
          .estTotal;
        ord.items.forEach((item) => (progTotal += item.estTotal));
      });
      currentItem.totalItems = totalItems;
      currentItem.estTotal = totalEstCost;
      items.splice(items.indexOf(currentItem), 1, currentItem);
      state.items = [...items];
      let initialTotal = state.programTotal;
      state.programTotal = progTotal;
      state.preOrderTotal.updatedTotal =
        progTotal + state.preOrderTotal.updatedTotal - initialTotal;
    },
    removeGridItem(state, action) {
      const { itemNum } = action.payload;
      state.programTotal -= state.items.find(
        (item) => item.itemNumber === itemNum
      ).estTotal;
      state.preOrderTotal.actualTotal -= state.items.find(
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
    updatePreOrderNote(state, action) {
      const { value } = action.payload;
      if (value.length <= 300) {
        state.preOrderNote = value;
      }
    },
    setProgramName(state, action) {
      const { name } = action.payload;
      state.name = name;
    },
    setPreOrderStatus(state, action) {
      const { status } = action.payload;
      state.status = status;
    },
    resetState(state) {
      state.isLoading = false;
      state.initialPreOrderLoading = false;
      state.preOrderSummaryLoading = false;
      state.preOrderSummary = [];
      state.status = null;
      state.preOrderId = null;
      state.programId = null;
      state.territories = [];
      state.items = [];
      state.orders = [];
      state.programTotal = 0;
      state.preOrderTotal = {
        initialTotal: 0,
        updatedTotal: 0,
      };
      state.preOrderNote = "";
      state.error = null;
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  setInitialPreOrdersLoading,
  setSummaryLoading,
  setPreOrderSummary,
  buildTableFromOrders,
  setGridItem,
  setItemTotal,
  removeGridItem,
  updatePreOrderNote,
  setProgramName,
  setPreOrderStatus,
  resetState,
  setFailure,
} = programTableSlice.actions;

export default programTableSlice.reducer;

export const fetchPreOrders = (type) => async (dispatch) => {
  try {
    if (type === "initial") {
      dispatch(setInitialPreOrdersLoading());
    } else {
      dispatch(setSummaryLoading());
    }
    const currentPreOrders = await fetchAllPreOrders();
    if (currentPreOrders.error) {
      throw currentPreOrders.error;
    }
    let preOrders = currentPreOrders.data.map((order) => ({
      preOrderId: order.id,
      programId: order.program.id,
      territories:
        order["territory-names"].length === 0
          ? ["National"]
          : order["territory-names"].split(", "),
      totalItems: order["total-quantity"],
      totalEstCost: order["total-cost"],
      status: order.status,
    }));
    let totalCost = preOrders
      .map((order) => order.totalEstCost)
      .reduce((a, b) => a + b);
    preOrders.forEach((order) => {
      dispatch(
        setProgramStatus({ program: order.programId, status: order.status })
      );
    });
    dispatch(
      setPreOrderSummary({ preOrders: preOrders, totalCost: totalCost })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const fetchProgramOrders = (program) => async (dispatch) => {
  //TODO get note / patch note on save and submit
  try {
    dispatch(setIsLoading());
    const currentOrders = await fetchOrdersByProgram(program);
    if (currentOrders.error) {
      throw currentOrders.error;
    }
    if (currentOrders.data[0].status === "complete") {
      dispatch(setProgramStatus({ program: program, status: "complete" }));
    }
    // if (currentOrders.data[0].status === "submitted")
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

    let preOrderId = currentOrders.data[0].id;
    let preOrderStatus = currentOrders.data[0].status;
    let territories =
      currentOrders.data[0]["territory-names"].length === 0
        ? ["National"]
        : currentOrders.data[0]["territory-names"].split(", ");

    dispatch(
      buildTableFromOrders({
        programId: program,
        orders: orders,
        items: currentItems,
        preOrderId: preOrderId,
        status: preOrderStatus,
        territories: territories,
      })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};
