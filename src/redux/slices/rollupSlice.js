import { createSlice } from "@reduxjs/toolkit";
import { fetchAllPreOrders, fetchNextPreOrders } from "../../api/orderApi";

let initialState = {
  isLoading: false,
  isNextLoading: false,
  nextLink: null,
  preOrders: [],
  error: null,
};

const startLoading = (state) => {
  state.isLoading = true;
};

const startNextLoading = (state) => {
  state.isNextLoading = true;
};

const loadingFailed = (state, action) => {
  const { error } = action.payload;
  state.isLoading = false;
  state.error = error;
};

const rollupSlice = createSlice({
  name: "rollup",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    setNextIsLoading: startNextLoading,
    getPreOrdersSuccess(state, action) {
      const { preOrders, nextLink } = action.payload;
      state.nextLink = nextLink;
      state.preOrders = [...preOrders];
      state.isLoading = false;
      state.error = null;
    },
    getNextPreOrdersSuccess(state, action) {
      const { preOrders, nextLink } = action.payload;
      state.nextLink = nextLink;
      state.preOrders = state.preOrders.concat(preOrders);
      state.isNextLoading = false;
      state.error = null;
    },
    resetPreOrderRollup(state) {
      state.isLoading = false;
      state.isNextLoading = false;
      state.nextLink = null;
      state.preOrders = [];
      state.error = null;
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  setNextIsLoading,
  getPreOrdersSuccess,
  getNextPreOrdersSuccess,
  resetPreOrderRollup,
  setFailure,
} = rollupSlice.actions;

export default rollupSlice.reducer;
//TODO switch to fetchAllFilteredPreOrders
export const fetchFilteredPreOrders = () => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    let preOrders = await fetchAllPreOrders();
    if (preOrders.error) {
      throw preOrders.error;
    }
    let mappedPreOrders = preOrders.data.preOrders.map((preOrder) => ({
      id: preOrder.id,
      user: preOrder.user.name,
      program: preOrder.program.name,
      state: preOrder["random-order-state"],
      totalItems: preOrder["total-quantity"],
      totalOrders: preOrder["order-count"],
      totalEstCost: preOrder["total-cost"],
      totalActCost: "---",
      budget: "$25,000.00",
      orderDate: preOrder["submission-date"]
        ? preOrder["submission-date"]
        : "---",
      dueDate: preOrder["due-date"],
    }));
    dispatch(
      getPreOrdersSuccess({
        preOrders: mappedPreOrders,
        nextLink: preOrders.data.nextLink ? preOrders.data.nextLink : null,
      })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const fetchNextFilteredPreOrders = (url) => async (dispatch) => {
  try {
    dispatch(setNextIsLoading());
    let preOrders = await fetchNextPreOrders(url);
    if (preOrders.error) {
      throw preOrders.error;
    }
    let mappedPreOrders = preOrders.data.preOrders.map((preOrder) => ({
      id: preOrder.id,
      user: preOrder.user.name,
      program: preOrder.program.name,
      state: preOrder["random-order-state"],
      totalItems: preOrder["total-quantity"],
      totalOrders: preOrder["order-count"],
      totalEstCost: preOrder["total-cost"],
      totalActCost: "---",
      budget: "$25,000.00",
      orderDate: preOrder["submission-date"]
        ? preOrder["submission-date"]
        : "---",
      dueDate: preOrder["due-date"],
    }));
    dispatch(
      getNextPreOrdersSuccess({
        preOrders: mappedPreOrders,
        nextLink: preOrders.data.nextLink ? preOrders.data.nextLink : null
      })
    )
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
}
