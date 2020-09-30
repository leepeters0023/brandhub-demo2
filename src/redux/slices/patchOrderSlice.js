import { createSlice } from "@reduxjs/toolkit";
import { navigate } from "@reach/router";

import {
  patchOrderItem,
  deleteOrderSetItem,
  deleteOrder,
  startOrderSet,
  restartOrderSet,
  submitOrderSet,
  approveOrderSet,
  setOrderSetNote,
  setOrderDetail,
} from "../../api/orderApi";

import { setProgramStatus } from "./programsSlice";
import {
  setOrderStatus,
  updateOrderDetails,
  removeGridItem,
  removeGridOrder,
} from "./orderSetSlice";

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

export const startOrdSet = (programId, value, orderSetId) => async (
  dispatch
) => {
  try {
    dispatch(setIsLoading());
    if (programId) {
      dispatch(setProgramStatus({ program: programId, status: value }));
    }
    const startStatus = await startOrderSet(orderSetId);
    console.log(startStatus);
    if (startStatus.error) {
      throw startStatus.error;
    }
    dispatch(setOrderStatus({ status: value }));
    dispatch(patchSuccess());
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

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

export const approveMultipleOrderSets = (orderSetArray, filters) => async (
  dispatch
) => {
  try {
    dispatch(setIsLoading());
    Promise.all(
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

export const setOrderSetNotes = (id, note) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const noteStatus = await setOrderSetNote(id, note);
    if (noteStatus.error) {
      throw noteStatus.error;
    }
    dispatch(patchSuccess());
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

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
