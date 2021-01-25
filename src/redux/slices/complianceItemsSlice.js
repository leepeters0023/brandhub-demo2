import { createSlice } from "@reduxjs/toolkit";
import {
  fetchTriggeredRules,
  fetchNextTriggeredRules,
} from "../../api/complianceApi";
import { mapCompItems } from "../apiMaps";
/*
* Item Rule Model

todo

*/

let initialState = {
  isLoading: false,
  isNextLoading: false,
  isUpdateLoading: false,
  itemsPerPage: 20,
  nextPage: null,
  nextLink: null,
  items: [],
  pendingOrderItems: [],
  selectedItems: [],
  error: null,
};

const startLoading = (state) => {
  state.isLoading = true;
};

const startNextLoading = (state) => {
  state.isNextLoading = true;
};

const startUpdateLoading = (state) => {
  state.isUpdateLoading = true;
};

const loadingFailed = (state, action) => {
  const { error } = action.payload;
  state.isLoading = false;
  state.error = error;
};

const complianceItemsSlice = createSlice({
  name: "complianceItems",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    setNextIsLoading: startNextLoading,
    setUpdateLoading: startUpdateLoading,
    getComplianceItemsSuccess(state, action) {
      const { items, nextLink } = action.payload;
      state.nextPage = nextLink ? true : false;
      state.nextLink = nextLink;
      state.items = [...items];
      state.isLoading = false;
      state.error = null;
    },
    getNextComplianceItemsSuccess(state, action) {
      const { items, nextLink } = action.payload;
      state.nextPage = nextLink ? true : false;
      state.nextLink = nextLink;
      state.items = state.items.concat(items);
      state.isNextLoading = false;
      state.error = null;
    },
    getPendingOrderItemsSuccess(state, action) {
      const { items, nextLink } = action.payload;
      state.nextPage = nextLink ? true : false;
      state.pendingNextLink = nextLink;
      state.pendingOrderItems = [...items];
      state.isLoading = false;
      state.error = null;
    },
    updateCompItemSelection(state, action) {
      const { selectedItems } = action.payload;
      state.selectedItems = selectedItems;
    },
    resetComplianceItems(state) {
      state.isLoading = false;
      state.isNextLoading = false;
      state.isUpdateLoading = false;
      state.itemsPerPage = 20;
      state.nextPage = null;
      state.nextLink = null;
      state.items = [];
      state.pendingOrderItems = [];
      state.selectedItems = [];
      state.error = null;
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  setNextIsLoading,
  setUpdateLoading,
  getComplianceItemsSuccess,
  getNextComplianceItemsSuccess,
  getPendingOrderItemsSuccess,
  updateCompItemSelection,
  resetComplianceItems,
  setFailure,
} = complianceItemsSlice.actions;

export default complianceItemsSlice.reducer;

export const fetchFilteredTriggeredRules = (filterObject) => async (
  dispatch
) => {
  try {
    dispatch(setIsLoading());
    let triggeredRules = await fetchTriggeredRules(filterObject);
    if (triggeredRules.error) {
      throw triggeredRules.error;
    }
    console.log(triggeredRules);
    const mappedCompItems = mapCompItems(triggeredRules.data.rules);
    dispatch(
      getComplianceItemsSuccess({
        items: mappedCompItems,
        nextLink: triggeredRules.data.nextLink
          ? triggeredRules.data.nextLink
          : null,
      })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const fetchNextFilteredTriggeredRules = (url) => async (dispatch) => {
  try {
    dispatch(setNextIsLoading());
    let triggeredRules = await fetchNextTriggeredRules(url);
    if (triggeredRules.error) {
      throw triggeredRules.error;
    }
    const mappedCompItems = mapCompItems(triggeredRules.data.rules);
    dispatch(
      getNextComplianceItemsSuccess({
        items: mappedCompItems,
        nextLink: triggeredRules.data.nextLink
          ? triggeredRules.data.nextLink
          : null,
      })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const fetchTriggeredRulesByOrders = (orderIds) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    let triggeredRules = await fetchTriggeredRules({ orderItemIds: orderIds });
    if (triggeredRules.error) {
      throw triggeredRules.error;
    }
    console.log(triggeredRules);
    const mappedCompItems = mapCompItems(triggeredRules.data.rules);
    dispatch(
      getPendingOrderItemsSuccess({
        items: mappedCompItems,
        nextLink: triggeredRules.data.nextLink
          ? triggeredRules.data.nextLink
          : null,
      })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};
