import { createSlice } from "@reduxjs/toolkit";
import { fetchItemTypes } from "../../api/itemApi";
import { setError } from "./errorSlice";

let initialState = {
  isLoading: false,
  itemTypeList: [],
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

const itemTypeSlice = createSlice({
  name: "itemTypes",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    getItemTypesSuccess(state, action) {
      const { itemTypes } = action.payload;
      state.itemTypeList = itemTypes;
      state.isLoading = false;
      state.error = null;
    },
    clearItemTypes(state) {
      state.isLoading = false;
      state.itemTypeList = [];
      state.error = null
    },
    setFailure: loadingFailed,
  }
})

export const {
  setIsLoading,
  getItemTypesSuccess,
  clearItemTypes,
  setFailure,
} = itemTypeSlice.actions;

export default itemTypeSlice.reducer;

export const fetchAllItemTypes = () => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    let itemTypes = await fetchItemTypes();
    if (itemTypes.error) {
      throw itemTypes.error
    }
    let mappedItemTypes = itemTypes.data.map((type) => ({
      id: type.id,
      categoryCode: type["category-code"],
      name: type.description,
      packSize: type["qty-per-pack"]
    }))
    dispatch(getItemTypesSuccess({ itemTypes: mappedItemTypes }))
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(setError({ error: err.toString() }));
  }
}