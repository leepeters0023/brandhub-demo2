import { createSlice } from "@reduxjs/toolkit";
import {
  fetchRollupItems,
  fetchNextRollupItems,
} from "../../api/purchasingApi";
import { mapRollupItems } from "../apiMaps";

let initialState = {
  isLoading: false,
  isNextLoading: false,
  isUpdateLoading: false,
  nextPage: null,
  nextLink: null,
  poItems: [],
  selectedPOItems: [],
  currentPO: {
    dueDate: null,
    expectedShip: null,
    actualShip: null,
    terms: null,
    supplier: null,
    contactName: null,
    email: null,
    phone: null,
    purchasedBy: null,
    supplierNotes: "",
    rfqNumber: null,
    specDetails: null,
    poItems: [],
    additionalCosts: [],
    totalCost: null,
    shippingParams: [],
  },
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

const purchaseOrderSlice = createSlice({
  name: "purchaseOrder",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    setNextIsLoading: startNextLoading,
    setUpdateLoading: startUpdateLoading,
    getPOItemsSuccess(state, action) {
      const { poItems, nextLink } = action.payload;
      state.nextPage = nextLink ? true : false;
      state.nextLink = nextLink;
      state.poItems = [...poItems];
      state.isLoading = false;
      state.error = null;
    },
    getNextPOItemsSuccess(state, action) {
      const { poItems, nextLink } = action.payload;
      state.nextPage = nextLink ? true : false;
      state.nextLink = nextLink;
      state.poItems = state.poItems.concat(poItems);
      state.isNextLoading = false;
      state.error = null;
    },
    getSinglePOSuccess(state, action) {
      const { purchaseOrder } = action.payload;
      state.currentPO.dueDate = purchaseOrder.dueDate;
      state.currentPO.expectedShip = purchaseOrder.expectedShip;
      state.currentPO.actualShip = purchaseOrder.actualShip;
      state.currentPO.terms = purchaseOrder.terms;
      state.currentPO.supplier = purchaseOrder.supplier;
      state.currentPO.contactName = purchaseOrder.contactName;
      state.currentPO.email = purchaseOrder.email;
      state.currentPO.phone = purchaseOrder.phone;
      state.currentPO.purchasedBy = purchaseOrder.purchasedBy;
      state.currentPO.supplierNotes = purchaseOrder.supplierNotes;
      state.currentPO.rfqNumber = purchaseOrder.rfqNumber;
      state.currentPO.specDetails = purchaseOrder.specDetails;
      state.currentPO.poItems = purchaseOrder.poItems;
      state.currentPO.additionalCosts = purchaseOrder.additionalCosts;
      state.currentPO.totalCost = purchaseOrder.totalCost;
      state.currentPO.shippingParams = purchaseOrder.shippingParams;
      state.error = null;
      state.isLoading = false;
    },
    setSelectedPOItems(state, action) {
      const { selectedItems } = action.payload;
      state.selectedPOItems = selectedItems;
    },
    addCost(state, action) {
      const { description, cost } = action.payload;
      let currentCosts =
        state.currentPO.additionalCosts.length > 0
          ? [...state.additionalCosts]
          : [];
      let newCost = {
        description: description,
        cost: cost,
      };
      currentCosts.push(newCost);
      state.currentPO.additionalCosts = currentCosts;
    },
    updateCost(state, action) {
      const { key, value, index } = action.payload;
      let currentCosts = state.currentPO.additionalCosts.map((cost, i) => {
        if (index === i) {
          return { [`${key}`]: value };
        } else return cost;
      });
      state.currentPO.additionalCosts = currentCosts;
      //TODO update total cost
    },
    updateSupplierNotes(state, action) {
      const { value } = action.payload;
      state.currentPO.supplierNotes = value;
    },
    resetPurchaseOrder(state) {
      state.isLoading = false;
      state.isNextLoading = false;
      state.isUpdateLoading = false;
      state.nextPage = null;
      state.nextLink = null;
      state.poItems = [];
      state.selectedPOItems = [];
      state.currentPO.dueDate = null;
      state.currentPO.expectedShip = null;
      state.currentPO.actualShip = null;
      state.currentPO.terms = null;
      state.currentPO.supplier = null;
      state.currentPO.contactName = null;
      state.currentPO.email = null;
      state.currentPO.phone = null;
      state.currentPO.purchasedBy = null;
      state.currentPO.supplierNotes = "";
      state.currentPO.rfqNumber = null;
      state.currentPO.specDetails = null;
      state.currentPO.poItems = [];
      state.currentPO.additionalCosts = [];
      state.currentPO.totalCost = null;
      state.currentPO.shippingParams = [];
      state.error = null;
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  setNextIsLoading,
  setUpdateLoading,
  getPOItemsSuccess,
  getNextPOItemsSuccess,
  getSinglePOSuccess,
  setSelectedPOItems,
  addCost,
  updateCost,
  resetPurchaseOrder,
  setFailure,
} = purchaseOrderSlice.actions;

export default purchaseOrderSlice.reducer;

export const fetchFilteredPOItems = (filterObject) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    console.log("here");
    const items = await fetchRollupItems(filterObject, "po");
    if (items.error) {
      throw items.error;
    }
    let mappedItems = mapRollupItems(items.data.items);
    dispatch(
      getPOItemsSuccess({ poItems: mappedItems, nextLink: items.data.nextLink })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const fetchNextFilteredPOItems = (url) => async (dispatch) => {
  try {
    dispatch(setNextIsLoading());
    const items = await fetchNextRollupItems(url);
    if (items.error) {
      throw items.error;
    }
    let mappedItems = mapRollupItems(items.data.items);
    dispatch(
      getNextPOItemsSuccess({
        poItems: mappedItems,
        nextLink: items.data.nextLink,
      })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};
