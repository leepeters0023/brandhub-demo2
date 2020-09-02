import { createSlice } from "@reduxjs/toolkit";

import { fetchOrdersByProgram } from "../../api/programApi";

//TODO sort items on fetch by item id
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
  programId: null,
  items: [],
  orders: [],
  programTotal: 0,
  preOrderTotal: {
    currentTotal: 0,
    actualTotal: 0,
  },
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

const programTableSlice = createSlice({
  name: "programTable",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    buildTableFromOrders(state, action) {
      const { programId, orders } = action.payload;
      if (orders.length !== 0) {
        let currentItems = [...orders[0].items];
        currentItems = currentItems.map((item) => ({
          ...item,
          estTotal: 0,
          totalItems: 0,
        }));
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
        state.programId = programId;
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
      currentOrder.items = [...newItems];
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
      state.programTotal = progTotal;
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
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  buildTableFromOrders,
  setGridItem,
  setItemTotal,
  removeGridItem,
  setFailure,
} = programTableSlice.actions;

export default programTableSlice.reducer;

export const fetchProgramOrders = (user, program) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const currentOrders = await fetchOrdersByProgram(user, program);
    
    dispatch(
      buildTableFromOrders({ programId: program, orders: currentOrders })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};
