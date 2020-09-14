import { createSlice } from "@reduxjs/toolkit";

import { patchOrderItem, deletePreOrderItem, submitPreOrder } from "../../api/orderApi";

import { setPreOrderProgramStatus } from "../../api/programApi";

import { setProgramStatus } from "./programsSlice";
import { setPreOrderStatus } from "./programTableSlice";

/*
* Data Format:
patchOrder: {
  isLoading: bool,
  cellsLoading: [],
  cellsError: [],
  error: string || null
}
*/

let initialState = {
  isLoading: false,
  cellsLoading: [],
  cellsError: [],
  error: null,
}

const startLoading = (state) => {
  state.isLoading = true;
};

const loadingFailed = (state, action) => {
  const { error, cell } = action.payload;
  let currentErrors = [...state.cellsError];
  currentErrors.push(cell);
  state.cellsError = currentErrors;
  state.isLoading = false;
  state.error = error;
};

const patchOrderSlice = createSlice({
  name: "patchOrder",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    addLoadingCell(state, action) {
      const { cell } = action.payload;
      let currentLoading = [...state.cellsLoading];
      currentLoading.push(cell)
      state.cellsLoading = currentLoading;
    },
    patchItemSuccess(state, action) {
      const {id, orderNumber} = action.payload;
      let currentLoading = [...state.cellsLoading];
      let currentCell = currentLoading.find((cell) => cell.id === id && cell.orderNumber === orderNumber);
      currentLoading.splice(currentLoading.indexOf(currentCell), 1)

      state.cellsLoading = [...currentLoading]
      state.isLoading = false
    },
    setProgStatusSuccess(state) {
      state.isLoading = false;
    },
    deleteItemSuccess(state) {
      state.isLoading = false
    },
    setFailure: loadingFailed,
  }
})

export const {
  setIsLoading,
  addLoadingCell,
  patchItemSuccess,
  setProgStatusSuccess,
  deleteItemSuccess,
  setFailure
} = patchOrderSlice.actions;

export default patchOrderSlice.reducer;

export const patchItem = (id, qty, orderNumber) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    dispatch(addLoadingCell({cell: {id: id, orderNumber: orderNumber}}))
    const patchStatus = await patchOrderItem(id, qty);
    console.log(patchStatus);

    dispatch(patchItemSuccess({id, orderNumber}));
  } catch(err) {
    dispatch(setFailure({ error: err.toString(), cell: {id: id, orderNumber: orderNumber, error: err.toString()} }));
  }
}

export const deletePreOrdItem = (id) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const deleteStatus = await deletePreOrderItem(id);
    console.log(deleteStatus);

    dispatch(deleteItemSuccess());
  } catch(err) {
    dispatch(setFailure({ error: err.toString() }));
  }
}

export const setProgStatus = (id, value, preOrderId) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const compStatus = await setPreOrderProgramStatus(preOrderId, value);
    dispatch(setProgramStatus({ program: id, status: value }))
    dispatch(setPreOrderStatus({ status: value }))
    dispatch(setProgStatusSuccess());
    console.log(compStatus);
    if (value === "submitted") {
      const submitStatus = await submitPreOrder(preOrderId)
      console.log(submitStatus)
    }
  } catch(err) {
    dispatch(setFailure({ error: err.toString() }));
  }
}