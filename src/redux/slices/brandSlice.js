import { createSlice } from "@reduxjs/toolkit";
import { fetchBrandsByName } from "../../api/brandApi";

let initialState = {
  isLoading: false,
  brandList: [],
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

const brandSlice = createSlice({
  name: "brands",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    getBrandsSuccess(state, action) {
      const { brands } = action.payload;
      state.brandList = brands;
      state.isLoading = false;
      state.error = null;
    },
    clearBrands(state) {
      state.isLoading = false;
      state.brandList = [];
      state.error = null;
    },
    setFailure: loadingFailed,
  }
})

export const {
  setIsLoading,
  getBrandsSuccess,
  clearBrands,
  setFailure,
} = brandSlice.actions;

export default brandSlice.reducer;

export const fetchBrands = (name) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    let brands = await fetchBrandsByName(name);
    if (brands.error) {
      throw brands.error;
    }
    dispatch(getBrandsSuccess({ brands: brands.data }));
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
}

