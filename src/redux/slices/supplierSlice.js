import { createSlice } from "@reduxjs/toolkit";
import {
  fetchSuppliers,
  fetchFilteredSuppliers,
  fetchInitialSupplierValues,
} from "../../api/supplierApi";
import { setError } from "./errorSlice";

let initialState = {
  isLoading: false,
  isInitialLoading: false,
  navValues: {
    newRFQ: 0,
    inProgressRFQ: 0,
    awardedRFQ: 0,
    newPO: 0,
    inProgressPO: 0,
    shipHoldPO: 0,
  },
  supplierList: [],
  filteredSupplierList: [],
  error: null,
};

const startLoading = (state) => {
  state.isLoading = true;
};

const startInitialLoading = (state) => {
  state.isInitialLoading = true;
}

const loadingFailed = (state, action) => {
  const { error } = action.payload;
  state.isLoading = false;
  state.isInitialLoading = false;
  state.error = error;
};

const supplierSlice = createSlice({
  name: "suppliers",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    setInitialLoading: startInitialLoading,
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
    getNavValueSuccess(state, action) {
      const { navValues } = action.payload;
      state.navValues.newRFQ = navValues.newRFQ;
      state.navValues.inProgressRFQ = navValues.inProgressRFQ;
      state.navValues.awardedRFQ = navValues.awardedRFQ;
      state.navValues.newPO = navValues.newPO;
      state.navValues.inProgressPO = navValues.inProgressPO;
      state.navValues.shipHoldPO = navValues.shipHoldPO;
      state.isInitialLoading = false;
      state.error = null;
    },
    updateValues(state, action) {
      const { values } = action.payload;
      let currentValues = {...state.navValues}
      values.forEach((val) => {
        currentValues[val.key] = currentValues[val.key] + val.value
      })
      state.navValues = { ...currentValues}
    },
    clearSuppliers(state) {
      state.isLoading = false;
      state.isInitialLoading = false;
      state.navValues.newRFQ = 0;
      state.navValues.inProgressRFQ = 0;
      state.navValues.awardedRFQ = 0;
      state.navValues.newPO = 0;
      state.navValues.inProgressPO = 0;
      state.navValues.shipHoldPO = 0;
      state.supplierList = [];
      state.filteredSupplierList = [];
      state.error = null;
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  setInitialLoading,
  getSuppliersSuccess,
  getFilteredSuppliersSuccess,
  getNavValueSuccess,
  updateValues,
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
    dispatch(setError({ error: err.toString() }));
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
    dispatch(setError({ error: err.toString() }));
  }
};

export const fetchInitialValues = () => async (dispatch) => {
  try {
    dispatch(setInitialLoading());
    let values = await fetchInitialSupplierValues();
    if (values.error) {
      throw values.error;
    }
    dispatch(getNavValueSuccess({ navValues: values.data}))
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(setError({ error: err.toString() }));
  }
}
