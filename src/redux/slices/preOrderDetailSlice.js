import { createSlice } from "@reduxjs/toolkit";

import { fetchAllPreOrders } from "../../api/orderApi";

import { setProgramStatus } from "./programsSlice";

/*
* Pre Order Detail Model
notes: This slice is responsible for managing the details of all current pre order programs
and displaying that information in the accordian component while placing pre orders.

pre order summary object:
{
  preOrderId: string (read),
  programId: string (read),
  territories: array (read, comes as a string of names, we break it into an array)
  totalItems: int (read, write (updates when users update orders withing the order set corresponding to the pre order program)),
  totalEstCost: int (read, calculated from item totals in order set),
  status: string (read, write (editable by field2 or higher)),
}

*/

let initialState = {
  isLoading: false,
  initialPreOrderLoading: false,
  preOrderSummaryLoading: false,
  preOrderSummary: [],
  territories: [],
  preOrderTotal: 0,
  preOrderTotalMod: 0,
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
  state.initialPreOrderLoading = false;
  state.preOrderSummaryLoading = false;
  state.error = error;
};

const preOrderDetailSlice = createSlice({
  name: "preOrderDetails",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    setInitialPreOrdersLoading: startInitialLoading,
    setSummaryLoading: startSummaryLoading,
    setPreOrderSummary(state, action) {
      const { preOrders, totalCost, totalModCost } = action.payload;
      state.preOrderSummary = [...preOrders];
      state.preOrderTotal = totalCost;
      state.preOrderTotalMod = totalModCost;
      state.initialPreOrderLoading = false;
      state.preOrderSummaryLoading = false;
      state.error = null;
    },
    setPreOrderDetails(state, action) {
      const { territories, programId } = action.payload;
      state.programId = programId;
      state.territories = [...territories];
    },
    setProgramName(state, action) {
      const { name } = action.payload;
      state.name = name;
    },
    clearPreOrderDetail(state) {
      state.isLoading = false;
      state.initialPreOrderLoading = false;
      state.preOrderSummaryLoading = false;
      state.preOrderSummary = [];
      state.territories = [];
      state.preOrderTotal = 0;
      state.preOrderTotalMod = 0;
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
  setPreOrderDetails,
  setProgramName,
  clearPreOrderDetail,
  setFailure,
} = preOrderDetailSlice.actions;

export default preOrderDetailSlice.reducer;

export const fetchPreOrders = (id, type, program) => async (dispatch) => {
  try {
    if (type === "initial") {
      dispatch(setInitialPreOrdersLoading());
    } else {
      dispatch(setSummaryLoading());
    }
    const currentPreOrders = await fetchAllPreOrders(id);
    if (currentPreOrders.error) {
      throw currentPreOrders.error;
    }
    let preOrders = currentPreOrders.data.preOrders.map((order) => ({
      preOrderId: order.id,
      programId: order.program.id,
      territories:
        order["territory-names"].length === 0
          ? ["National"]
          : order["territory-names"].split(", "),
      totalItems: order["total-quantity"],
      totalEstCost: order["total-estimated-cost"],
      status: order.status,
    }));
    let totalCost = preOrders
      .map((order) => order.totalEstCost)
      .reduce((a, b) => a + b);
    let totalModCost = currentPreOrders.data.preOrders
      .filter((order) => order.program.id !== program)
      .map((ord) => ord["total-estimated-cost"])
      .reduce((a, b) => a + b);
    preOrders.forEach((order) => {
      dispatch(
        setProgramStatus({ program: order.programId, status: order.status })
      );
    });
    dispatch(
      setPreOrderSummary({
        preOrders: preOrders,
        totalCost: totalCost,
        totalModCost: totalModCost,
      })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};
