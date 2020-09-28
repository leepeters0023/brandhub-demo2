import { createSlice } from "@reduxjs/toolkit";
import { navigate } from "@reach/router";

import {
  patchOrderItem,
  deleteOrderSetItem,
  submitOrderSet,
  setOrderSetNote,
  setOrderDetail,
  setOrderShipping,
  deleteOrderItem,
  submitOrder,
  updateOrderStatus,
  setOrderSetStatus,
} from "../../api/orderApi";

import { setProgramStatus } from "./programsSlice";
import { setOrderStatus, updateOrderDetails } from "./orderSetSlice";
import {
  setShippingLocation,
  updateCurrentOrder,
  removeItem,
} from "./currentOrderSlice";

import { fetchFilteredOrderHistory } from "./orderHistorySlice";

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

export const updateOrderItem = (id, qty, type) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const patchStatus = await patchOrderItem(id, qty);
    if (patchStatus.error) {
      throw patchStatus.error;
    }

    dispatch(patchSuccess());
    if (type !== "pre-order") {
      dispatch(updateCurrentOrder({ id: id, totalItems: qty }));
    }
  } catch (err) {
    dispatch(
      setFailure({
        error: err.toString(),
        cell: null,
      })
    );
  }
};

export const deleteOrdItem = (id) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const deleteStatus = await deleteOrderItem(id);
    if (deleteStatus.error) {
      throw deleteStatus.error;
    }

    dispatch(patchSuccess());
    dispatch(removeItem({ id: id }));
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const deleteSetItem = (id) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const deleteStatus = await deleteOrderSetItem(id);
    if (deleteStatus.error) {
      throw deleteStatus.error;
    }

    dispatch(patchSuccess());
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const setProgStatus = (id, value, preOrderId) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const compStatus = await setOrderSetStatus(preOrderId, value);
    if (compStatus.error) {
      throw compStatus.error;
    }
    if (id) {
      dispatch(setProgramStatus({ program: id, status: value }));
    }
    dispatch(setOrderStatus({ status: value }));
    dispatch(patchSuccess());
    if (value === "submitted") {
      const submitStatus = await submitOrderSet(preOrderId);
      if (submitStatus.error) {
        throw submitStatus.error;
      }
    }
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

export const setShipping = (orderId, distId, distName) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const shipStatus = await setOrderShipping(orderId, distId);
    if (shipStatus.error) {
      throw shipStatus.error;
    }
    dispatch(setShippingLocation({ location: { name: distName, id: distId } }));
    dispatch(patchSuccess());
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const submitCurrentOrder = (orderId, role) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const submitStatus = await submitOrder(orderId);
    if (submitStatus.error) {
      throw submitStatus.error;
    }
    if (role !== "field1") {
      const updateStatus = await updateOrderStatus(orderId, "approved");
      if (updateStatus.error) {
        throw updateStatus.error;
      }
    }
    dispatch(patchSuccess());
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const updateCurrentOrderStatus = (orderId, status, filters) => async (
  dispatch
) => {
  try {
    dispatch(setIsLoading());
    const updateStatus = await updateOrderStatus(orderId, status);
    if (updateStatus.error) {
      throw updateStatus.error;
    }
    if (filters) {
      dispatch(fetchFilteredOrderHistory(filters));
    }
    dispatch(patchSuccess());
    if (!filters) {
      navigate("/orders/approvals");
    }
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const updateMultipleOrderStatus = (
  orderIdArray,
  status,
  filters
) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    Promise.all(
      orderIdArray.map(async (id) => {
        const updateStatus = await updateOrderStatus(id, status);
        if (updateStatus.error) {
          throw updateStatus.error;
        }
      })
    );
    dispatch(fetchFilteredOrderHistory(filters));
    dispatch(patchSuccess());
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};
