import { createSlice } from "@reduxjs/toolkit";
import {
  fetchTriggeredRules,
  fetchNextTriggeredRules,
  approvePriorApproval,
  denyPriorApproval,
} from "../../api/complianceApi";
import {
  setIsLoading as patchLoading,
  patchSuccess,
  setFailure as patchFailure,
} from "./patchOrderSlice";
import { fetchOrderHistoryByItem } from "../../api/orderApi";
import { mapCompItems, mapOrderHistoryItems } from "../apiMaps";
import { setError } from "./errorSlice";

let initialState = {
  isLoading: false,
  isNextLoading: false,
  isUpdateLoading: false,
  itemsPerPage: 20,
  nextPage: null,
  nextLink: null,
  pendingNextLink: null,
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
    approveDenySuccess(state) {
      state.isUpdateLoading = false;
      state.selectedItems = [];
      state.error = null;
    },
    updateCompItemSelection(state, action) {
      const { selectedItems } = action.payload;
      state.selectedItems = selectedItems;
    },
    cancelCompItem(state, action) {
      const { id } = action.payload;
      const filteredItems = state.pendingOrderItems.filter(
        (item) => item.id !== id
      );
      state.pendingOrderItems = filteredItems;
      state.isUpdateLoading = false;
      state.error = null;
    },
    resetComplianceItems(state) {
      state.isLoading = false;
      state.isNextLoading = false;
      state.isUpdateLoading = false;
      state.itemsPerPage = 20;
      state.nextPage = null;
      state.nextLink = null;
      state.pendingNextLink = null;
      state.items = [];
      state.pendingOrderItems = [];
      state.selectedItemss = [];
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
  approveDenySuccess,
  updateCompItemSelection,
  cancelCompItem,
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
    dispatch(setError({ error: err.toString() }));
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
    dispatch(setError({ error: err.toString() }));
  }
};

export const fetchTriggeredRulesByOrders = (orderIds) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    let triggeredRules = await fetchOrderHistoryByItem({
      orderItemIds: orderIds,
    });
    if (triggeredRules.error) {
      throw triggeredRules.error;
    }
    const mappedCompItems = mapOrderHistoryItems(triggeredRules.data.items);
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
    dispatch(setError({ error: err.toString() }));
  }
};

//todo add next call? will it be necessary?

export const approvePriorApprovalItem = (ids) => async (dispatch) => {
  try {
    dispatch(setUpdateLoading());
    dispatch(patchLoading());
    for (let i = 0; i < ids.length; i++) {
      const approveStatus = await approvePriorApproval(ids[i]);
      if (approveStatus.error) {
        throw approveStatus.error;
      }
    }
    dispatch(approveDenySuccess());
    dispatch(patchSuccess());
  } catch (err) {
    dispatch(setFailure({ error: err }));
    dispatch(patchFailure({ error: err }));
    dispatch(setError({ error: err }));
  }
};

export const denyPriorApprovalItem = (ids) => async (dispatch) => {
  try {
    dispatch(setUpdateLoading());
    dispatch(patchLoading());
    for (let i = 0; i < ids.length; i++) {
      const denyStatus = await denyPriorApproval(ids[i]);
      if (denyStatus.error) {
        throw denyStatus.error;
      }
    }
    dispatch(approveDenySuccess());
    dispatch(patchSuccess());
  } catch (err) {
    dispatch(setFailure({ error: err }));
    dispatch(patchFailure({ error: err }));
    dispatch(setError({ error: err }));
  }
};
