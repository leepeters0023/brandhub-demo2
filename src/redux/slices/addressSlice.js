import { createSlice } from "@reduxjs/toolkit";
import { fetchWarehouseAddress, fetchFilteredAddresses } from "../../api/addressApi";
import { setError } from "./errorSlice";

let initialState = {
  isLoading: false,
  customAddressList: [],
  rapidAddress: null,
  championAddress: null,
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

const addressSlice = createSlice({
  name: "addresses",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    getAddressesSuccess(state, action) {
      const { addresses } = action.payload;
      state.customAddressList = addresses;
      state.isLoading = false;
      state.error = null;
    },
    getWarehouseSuccess(state, action) {
      const { rapid, champion } = action.payload;
      state.rapidAddress = rapid;
      state.championAddress = champion;
      state.isLoading = null;
      state.error = false;
    },
    resetAddresses(state) {
      state.isLoading = false;
      state.customAddressList = [];
      state.rapidAddress = null;
      state.championAddress = null;
      state.error = null;
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  getAddressesSuccess,
  getWarehouseSuccess,
  resetAddresses,
  setFailure,
} = addressSlice.actions;

export default addressSlice.reducer;

export const fetchWarehouse = () => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const address = await fetchWarehouseAddress();
    if (address.error) {
      throw address.error;
    }
    const rapid = address.data.find((add) => add.name === "Rapid Displays");
    const champion = address.data.find((add) => add.name === "Champion Logistics");
    dispatch(getWarehouseSuccess({ rapid: rapid, champion: champion }));
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(setError({ error: err.toString() }));
  }
};

export const fetchAddresses = (name) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const addresses = await fetchFilteredAddresses(name);
    if (addresses.error) {
      throw addresses.error;
    }
    dispatch(getAddressesSuccess({ addresses: addresses.data }));
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(setError({ error: err.toString() }));
  }
}
