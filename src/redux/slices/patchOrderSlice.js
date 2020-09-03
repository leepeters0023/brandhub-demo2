import { createSlice } from "@reduxjs/toolkit";

import { patchOrderItem, deletePreOrderItem } from "../../api/orderApi";

/*
* Data Format:
patchOrder: {
  isLoading: bool,
  error: string || null
}
*/

let initialState = {
  isLoading: false,
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

const patchOrderSlice = createSlice({
  name: "patchOrder",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    patchItemSuccess(state) {
      state.isLoading = false
    },
    deleteItemSuccess(state) {
      state.isLoading = false
    },
    setFailure: loadingFailed,
  }
})

export const {
  setIsLoading,
  patchItemSuccess,
  deleteItemSuccess,
  setFailure
} = patchOrderSlice.actions;

export default patchOrderSlice.reducer;

export const patchItem = (id, qty) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const patchStatus = await patchOrderItem(id, qty);
    console.log(patchStatus);

    dispatch(patchItemSuccess());
  } catch(err) {
    dispatch(setFailure({ error: err.toString() }));
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