import { createSlice } from "@reduxjs/toolkit";
import { fetchPublicItems } from "../../api/itemApi";
import { mapPublicItems } from "../apiMaps";

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

const publicItemSlice = createSlice({
  name: "publicItems",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    getItemsSuccess(state, action) {
      const { items } = action.payload;
      state.items = items;
      state.isLoading = false;
      state.error = null;
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  getItemsSuccess,
  setFailure,
} = publicItemSlice.actions;

export default publicItemSlice.reducer;

export const fetchPublicItemsByIds = (ids) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const items = await fetchPublicItems(ids);
    if (items.error) {
      throw items.error
    }
    let mappedItems = mapPublicItems(items.data);
    dispatch(getItemsSuccess({items: mappedItems}))
  } catch (err) {
    dispatch(setFailure({error: err.toString()}))
  }
}
