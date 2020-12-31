import { createSlice } from "@reduxjs/toolkit";
import { navigate } from "@reach/router";

/*
* Patch Order Model
notes: This slice manages the loading and error state for multiple views. It also manages
the loading and error state for each individual cell in the order grids

loading cell array:
{
  id: string (read) (this id is in reference to the order-item id),
  orderNum: string (read),
}

*/

import {
  patchOrderItem,
  deleteOrderSetItem,
  deleteOrder,
  startOrderSet,
  restartOrderSet,
  submitOrderSet,
  approveOrderSet,
  deleteOrderSet,
  setOrderDetail,
  updateOrderSetItemDate,
  updateOrderSetItemRush,
} from "../../api/orderApi";

import { setProgramStatus } from "./programsSlice";
import {
  setOrderStatus,
  updateOrderDetails,
  removeGridItem,
  removeGridOrder,
  clearOrderSet,
  updateSetItemDate,
  updateSetItemRush,
} from "./orderSetSlice";
import { clearOrderByType } from "./currentOrderSlice";
import { fetchFilteredOrderSets } from "./orderSetHistorySlice";

let initialState = {
  isLoading: false,
  cellsLoading: [],
  cellsError: [],
  error: null,
};

const startLoading = (state) => {
  state.isLoading = true;
};

const loadingFailed = (state, action) => {
  const { error, cell } = action.payload;
  if (cell) {
    let currentErrors = [...state.cellsError];
    currentErrors.push(cell);
    state.cellsError = currentErrors;
    state.isLoading = false;
  } else {
    state.isLoading = false;
    state.error = error;
  }
};

const patchOrderSlice = createSlice({
  name: "patchOrder",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    addLoadingCell(state, action) {
      const { cell } = action.payload;
      let currentLoading = [...state.cellsLoading];
      currentLoading.push(cell);
      state.cellsLoading = currentLoading;
    },
    patchItemSuccess(state, action) {
      const { id, orderNumber } = action.payload;
      let currentLoading = [...state.cellsLoading];
      let currentCell = currentLoading.find(
        (cell) => cell.id === id && cell.orderNumber === orderNumber
      );
      currentLoading.splice(currentLoading.indexOf(currentCell), 1);

      state.cellsLoading = [...currentLoading];
      state.isLoading = false;
      state.error = null;
    },
    patchSuccess(state) {
      state.isLoading = false;
      state.error = null;
    },
    resetPatchOrders(state) {
      state.isLoading = false;
      state.cellsLoading = [];
      state.cellsError = [];
      state.error = null;
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  addLoadingCell,
  patchItemSuccess,
  patchSuccess,
  resetPatchOrders,
  setFailure,
} = patchOrderSlice.actions;

export default patchOrderSlice.reducer;

//Updates a single order-item from the order grid
export const patchItem = (id, qty, orderNumber) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    dispatch(addLoadingCell({ cell: { id: id, orderNumber: orderNumber } }));
    const patchStatus = await patchOrderItem(id, qty);
    if (patchStatus.error) {
      throw patchStatus.error;
    }

    dispatch(patchItemSuccess({ id, orderNumber }));
  } catch (err) {
    dispatch(
      setFailure({
        error: err.toString(),
        cell: { id: id, orderNumber: orderNumber, error: err.toString() },
      })
    );
  }
};

//Deletes an item from an order set, and deletes all corresponding order items within it
export const deleteSetItem = (id, itemNum) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const deleteStatus = await deleteOrderSetItem(id);
    if (deleteStatus.error) {
      throw deleteStatus.error;
    }
    dispatch(removeGridItem({ itemNum }));
    dispatch(patchSuccess());
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

//Deletes an order, and all order items corresponding with it form an order set
export const deleteSetOrder = (id) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const deleteStatus = await deleteOrder(id);
    if (deleteStatus.error) {
      throw deleteStatus.error;
    }
    dispatch(removeGridOrder({ orderId: id }));
    dispatch(patchSuccess());
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const setSetDate = (id, date) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const dateStatus = await updateOrderSetItemDate(id, date);
    if (dateStatus.error) {
      throw dateStatus.error
    }
    dispatch(updateSetItemDate({id: id, date: date}))
    dispatch(patchSuccess());
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
}

export const setRush = (id, status) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const rushStatus = await updateOrderSetItemRush(id, status);
    if (rushStatus.error) {
      throw rushStatus.error;
    }
    dispatch(updateSetItemRush({id: id, status: status}))
    dispatch(patchSuccess());
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
}

//Updates status on order set from inactive to in-progress
export const startOrdSet = (programId, value, orderSetId) => async (
  dispatch
) => {
  try {
    dispatch(setIsLoading());
    if (programId) {
      dispatch(setProgramStatus({ program: programId, status: value }));
    }
    const startStatus = await startOrderSet(orderSetId);
    if (startStatus.error) {
      throw startStatus.error;
    }
    dispatch(setOrderStatus({ status: value }));
    dispatch(patchSuccess());
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

//Updates status on order set from submitted to in-progress
export const restartOrdSet = (programId, value, orderSetId) => async (
  dispatch
) => {
  try {
    dispatch(setIsLoading());
    if (programId) {
      dispatch(setProgramStatus({ program: programId, status: value }));
    }
    const restartStatus = await restartOrderSet(orderSetId);
    if (restartStatus.error) {
      throw restartStatus.error;
    }
    dispatch(setOrderStatus({ status: value }));
    dispatch(patchSuccess());
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

//Updates status on order set from in-progress to submitted
export const submitOrdSet = (programId, value, orderSetId, role) => async (
  dispatch
) => {
  try {
    dispatch(setIsLoading());
    if (programId) {
      dispatch(setProgramStatus({ program: programId, status: value }));
    }
    const submitStatus = await submitOrderSet(orderSetId);
    if (submitStatus.error) {
      throw submitStatus.error;
    }
    dispatch(setOrderStatus({ status: value }));
    if (role && role !== "field1") {
      const approveStatus = await approveOrderSet(orderSetId);
      if (approveStatus.error) {
        throw approveStatus.error;
      }
      dispatch(setOrderStatus({ status: "approved" }));
    }
    dispatch(patchSuccess());
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

//updates status on order set from submitted to approved
export const approveOrdSet = (orderSetId, value, filters) => async (
  dispatch
) => {
  try {
    dispatch(setIsLoading());
    const approveStatus = await approveOrderSet(orderSetId);
    if (approveStatus.error) {
      throw approveStatus.error;
    }
    if (filters) {
      dispatch(fetchFilteredOrderSets(filters));
    }
    dispatch(setOrderStatus({ status: value }));
    dispatch(patchSuccess());
    if (!filters) {
      navigate("/orders/approvals");
    }
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

//accepts an array of subbmitted order ids and moves them all to approved status
export const approveMultipleOrderSets = (orderSetArray, filters) => async (
  dispatch
) => {
  try {
    dispatch(setIsLoading());
    await Promise.all(
      orderSetArray.map(async (id) => {
        const approveStatus = await approveOrderSet(id);
        if (approveStatus.error) {
          throw approveStatus.error;
        }
      })
    );
    dispatch(fetchFilteredOrderSets(filters));
    dispatch(patchSuccess());
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

//deletes an entire order set, and all orders and order items within it
export const deleteOrdSet = (orderSetId, filters, type, orderType) => async (
  dispatch
) => {
  try {
    dispatch(setIsLoading());
    const deleteStatus = await deleteOrderSet(orderSetId);
    if (deleteStatus.error) {
      throw deleteStatus.error;
    }
    if (filters && type === "approval") {
      dispatch(fetchFilteredOrderSets(filters));
    }
    if (filters && type === "order") {
      dispatch(clearOrderSet());
      if (orderType === "in-stock") {
        dispatch(clearOrderByType({ type: "inStock" }));
      }
      if (orderType === "on-demand") {
        dispatch(clearOrderByType({ type: "onDemand" }));
      }
    }
    dispatch(patchSuccess());
    if (!filters && type === "approval") {
      navigate("/orders/approvals");
    }
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

//updates note and attention line on an individual order
export const setOrderDetails = (id, note, attn, type) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const noteStatus = await setOrderDetail(id, note, attn);
    if (noteStatus.error) {
      throw noteStatus.error;
    }
    dispatch(updateOrderDetails({ orderNumber: id, note: note, attn: attn }));
    dispatch(patchSuccess());
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};
