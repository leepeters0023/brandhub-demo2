import { createSlice } from "@reduxjs/toolkit";
import { fetchSuppliers, fetchFilteredSuppliers } from "../../api/supplierApi";

/*
* Supplier Model

{
  id: string (read),
  name: string (read),
}

*/

let initialState = {
  isLoading: false,
  supplierList: [],
  filteredSupplierList: [],
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

const supplierSlice = createSlice({
  name: "suppliers",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    getSuppliersSuccess(state, action) {
      const { suppliers } = action.payload;
      state.supplierList = suppliers;
      state.isLoading = false;
      state.error = null;
    },
    getFilteredSuppliersSuccess(state, action) {
      const { suppliers } = action.payload;
      state.filteredSupplierList = suppliers;
      state.isLoading = false;
      state.error = null;
    },
    clearSuppliers(state) {
      state.isLoading = false;
      state.supplierList = [];
      state.filteredSupplierList = [];
      state.error = null;
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  getSuppliersSuccess,
  getFilteredSuppliersSuccess,
  clearSuppliers,
  setFailure,
} = supplierSlice.actions;

export default supplierSlice.reducer;

export const fetchAllSuppliers = () => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    let suppliers = await fetchSuppliers();
    if (suppliers.error) {
      throw suppliers.error;
    }
    let mappedSuppliers = suppliers.data
      .map((supplier) => ({
        id: supplier.id,
        name: supplier.name,
      }))
      .filter((sup) => sup.id !== "4");
    dispatch(getSuppliersSuccess({ suppliers: mappedSuppliers }));
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const fetchSuppliersByName = (name) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    let suppliers = await fetchFilteredSuppliers(name);
    if (suppliers.error) {
      throw suppliers.error;
    }
    let mappedSuppliers = suppliers.data
      .map((supplier) => ({
        id: supplier.id,
        name: supplier.name,
      }))
      .filter((sup) => sup.id !== "4");
    dispatch(getFilteredSuppliersSuccess({ suppliers: mappedSuppliers }));
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};
