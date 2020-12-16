import { createSlice } from "@reduxjs/toolkit";
import { fetchSharedItems } from "../../api/itemApi";
import { mapItems } from "../apiMaps";

let initialState = {
  isLoading: false,
  items: [],
  error: null,
};

const startLoading = (state) => {
  state.isLoading = true;
};

const loadingFailed = (state, action) => {
  const { error } = action.payload;
  state.isLoading = false;
  state.error = error;
};

const sharedItemSlice = createSlice({
  name: "sharedItems",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    getItemsSuccess(state, action) {
      const { items } = action.payload;
      state.items = items;
      state.isLoading = false;
      state.error = null;
    },
    clearSharedItems(state) {
      state.isLoading = false;
      state.items = [];
      state.error = null;
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  getItemsSuccess,
  clearSharedItems,
  setFailure,
} = sharedItemSlice.actions;

export default sharedItemSlice.reducer;

export const fetchSharedItemsByIds = (ids) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const items = await fetchSharedItems(ids);
    if (items.error) {
      throw items.error;
    }
    let mappedItems = mapItems(items.data);
    dispatch(getItemsSuccess({ items: mappedItems }));
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};
