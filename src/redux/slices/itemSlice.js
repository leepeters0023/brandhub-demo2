import { createSlice } from "@reduxjs/toolkit";
import { fetchItems, fetchNextItems } from "../../api/itemApi";
import { mapItems } from "../apiMaps";
import { setError } from "./errorSlice";
import { startGlobalLoad, stopGlobalLoad } from "./globalLoadSlice";

let initialState = {
  isLoading: false,
  isNextLoading: false,
  orderType: null,
  itemsPerPage: 20,
  totalPages: null,
  pagesLoaded: 0,
  nextLink: null,
  items: [],
  selectedItems: [],
  error: null,
};

const typeMap = {
  "in-stock": "inStock",
  "on-demand": "onDemand",
  "pre-order": "pre-order",
  "all": "allItems",
}

const startLoading = (state) => {
  state.isLoading = true;
};

const startNextLoading = (state) => {
  state.isNextLoading = true;
}

const loadingFailed = (state, action) => {
  const { error } = action.payload;
  state.isLoading = false;
  state.error = error;
};

const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    setNextIsLoading: startNextLoading,
    setTotalPages(state, action) {
      const { pageCount } = action.payload;
      state.totalPages = pageCount;
    },
    getItemsSuccess(state, action) {
      const { orderType, items, nextLink } = action.payload;
      state.orderType = orderType;
      state.pagesLoaded += 1;
      state.nextLink = nextLink;
      state.items = [...items];
      state.isLoading = false;
      state.error = null;
    },
    getNextItemsSuccess(state, action) {
      const { items, nextLink } = action.payload;
      let currentItems = [...state.items];
      let updatedItems = currentItems.concat(items);
      state.pagesLoaded += 1;
      state.nextLink = nextLink;
      state.items = updatedItems;
      state.isNextLoading = false;
      state.error = null;
    },
    clearNextLink(state) {
      state.nextLink = null;
    },
    updateItemSelection(state, action) {
      const { selectedItems } = action.payload;
      state.selectedItems = selectedItems;
    },
    clearItemSelection(state) {
      state.selectedItems = [];
    },
    resetItems(state) {
      state.isLoading = false;
      state.orderType = null;
      state.itemsPerPage = 20;
      state.totalPages = null;
      state.pageLoaded = 0;
      state.nextLink = null;
      state.items = [];
      state.selectedItems = [];
      state.error = null;
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  setNextIsLoading,
  setTotalPages,
  getItemsSuccess,
  getNextItemsSuccess,
  clearNextLink,
  updateItemSelection,
  clearItemSelection,
  resetItems,
  setFailure,
} = itemSlice.actions;

export default itemSlice.reducer;

export const fetchFilteredItems = (filterObject) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    dispatch(startGlobalLoad());
   const items = await fetchItems(filterObject);
    if (items.error) {
      throw items.error;
    }
    let newItems = mapItems(items)
    dispatch(
      getItemsSuccess({
        orderType: typeMap[filterObject.orderType],
        items: newItems,
        nextLink: items.data.nextLink,
      })
    );
    dispatch(stopGlobalLoad());
  } catch (err) {
    dispatch(setFailure({error: err.toString()}));
    dispatch(setError({ error: err.toString() }));
    dispatch(stopGlobalLoad());
  }
};

export const fetchNextFilteredItems = (url) => async (dispatch) => {
  try {
    dispatch(setNextIsLoading());
    dispatch(clearNextLink());
    dispatch(startGlobalLoad());
    const items = await fetchNextItems(url);
    if (items.error) {
      throw items.error;
    }
    let newItems = mapItems(items.data.items)
    dispatch(
      getNextItemsSuccess({
        items: newItems,
        nextLink: items.data.nextLink,
      })
    );
    dispatch(stopGlobalLoad());
  } catch (err) {
    dispatch(setFailure({error: err.toString()}));
    dispatch(setError({ error: err.toString() }));
    dispatch(stopGlobalLoad());
  }
}
