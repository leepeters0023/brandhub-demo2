import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  isLoading: false,
  supplier: null,
  contactName: null,
  email: null,
  phone: null,
  dueDate: null,
  expectedShip: null,
  terms: null,
  purchasedBy: null,
  supplierNotes: "",
  rfqNumber: null,
  specDetails: null,
  poItems: [],
  additionalCosts: [],
  totalCost: null,
  attention: null,
  address: null,
  label: "",
  actualShip: null,
  carrier: null,
  method: null,
  tracking: null,
  error: null,
}

const startLoading = (state) => {
  state.isLoading = true;
}

const loadingFailed = (state, action) => {
  const { error } = action.payload;
  state.isLoading = false;
  state.error = error
}

const purchaseOrderSlice = createSlice({
  name: "purchaseOrder",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    getPurchaseOrderSuccess(state, action) {
      const { purchaseOrder, items, costs } = action.payload;
      state.supplier = purchaseOrder.supplier;
      state.contactName = purchaseOrder.contactName;
      state.email = purchaseOrder.email;
      state.phone = purchaseOrder.phone;
      state.dueDate = purchaseOrder.dueDate;
      state.expectedShip = purchaseOrder.expectedShip;
      state.terms = purchaseOrder.terms;
      state.purchasedBy = purchaseOrder.purchasedBy;
      state.supplierNotes = purchaseOrder.supplierNotes;
      state.rfqNumber = purchaseOrder.rfqNumber;
      state.specDetails = purchaseOrder.specDetails;
      state.poItems = [...items];
      state.additionalCosts = [...costs];
      state.totalCost = purchaseOrder.totalCost;
      state.attention = purchaseOrder.attention;
      state.address = purchaseOrder.address;
      state.label = purchaseOrder.label;
      state.actualShip = purchaseOrder.actualShip;
      state.carrier = purchaseOrder.carrier;
      state.method = purchaseOrder.method;
      state.tracking = purchaseOrder.tracking;
      state.error = null;
      state.isLoading = false;
    },
    addCost(state, action) {
      const {description, cost} = action.payload;
      let currentCosts = state.additionalCosts.length > 0 ? [...state.additionalCosts] : [];
      let newCost = {
        description: description,
        cost: cost
      }
      currentCosts.push(newCost);
      state.additionalCosts = currentCosts;
    },
    updateCost(state, action) {
      const {key, value, index} = action.payload;
      let currentCosts = [...state.additionalCosts]
      currentCosts[index][`${key}`] = value;
      state.additionalCosts = currentCosts;
      //TODO update total cost
    },
    updateSupplierNotes(state, action) {
      const { value } = action.payload;
      state.supplierNotes = value;
    },
    updateLable(state, action) {
      const { value } = action.payload;
      state.label = value;
    },
    clearPurchaseOrder(state) {
      state.supplier = null;
      state.contactName = null;
      state.email = null;
      state.phone = null;
      state.dueDate = null;
      state.expectedShip = null;
      state.terms = null;
      state.purchasedBy = null;
      state.supplierNotes = "";
      state.rfqNumber = null;
      state.specDetails = null;
      state.poItems = [];
      state.additionalCosts = [];
      state.totalCost = null;
      state.attention = null;
      state.address = null;
      state.label = "";
      state.actualShip = null;
      state.carrier = null;
      state.method = null;
      state.tracking = null;
      state.error = null;
      state.isLoading = false;
    },
    setFailure: loadingFailed
  }
})

export const {
  setIsLoading,
  getPurchaseOrderSuccess,
  addCost,
  updateCost,
  updateSupplierNotes,
  updateLable,
  clearPurchaseOrder,
  setFailure
} = purchaseOrderSlice.actions;

export default purchaseOrderSlice.reducer;