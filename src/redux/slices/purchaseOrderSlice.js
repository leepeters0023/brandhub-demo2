import { createSlice } from "@reduxjs/toolkit";
import {
  fetchRollupItems,
  fetchNextRollupItems,
  createPO,
  fetchPO,
} from "../../api/purchasingApi";
import { mapRollupItems, mapPOItems } from "../apiMaps";
import addDays from "date-fns/addDays";
import format from "date-fns/format";

let initialState = {
  isLoading: false,
  isNextLoading: false,
  isUpdateLoading: false,
  nextPage: null,
  nextLink: null,
  poItems: [],
  selectedPOItems: [],
  currentPO: {
    id: null,
    status: null,
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
      state.currentPO.id = purchaseOrder.id;
      state.currentPO.status = purchaseOrder.status;
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

export const fetchSinglePO = (id) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const newPO = await fetchPO(id);
    if (newPO.error) {
      throw newPO.error;
    }
    const formattedPO = {
      id: newPO.data.id,
      status: newPO.data.status,
      dueDate: newPO.data["in-market-date"]
        ? newPO.data["in-market-date"]
        : format(addDays(new Date(), 120), "MM/dd/yyyy"),
      expectedShip: newPO.data["expected-ship-date"]
        ? newPO.data["expected-ship-date"]
        : format(addDays(new Date(), 90), "MM/dd/yyyy"),
      actualShip: newPO.data["actual-ship-date"]
        ? newPO.data["actual-ship-date"]
        : format(addDays(new Date(), 90), "MM/dd/yyyy"),
      terms: newPO.data.terms ? newPO.data.terms : "Net 30 Days",
      supplier: newPO.data.suppler ? newPO.data.supplier.name : "---",
      contactName: newPO.data.supplier ? newPO.data.supplier.contact : "---",
      email: newPO.data.supplier ? newPO.data.supplier.email : "---",
      phone: newPO.data.supplier ? newPO.data.supplier.phone : "---",
      purchasedBy: newPO.data.purchaser.name
        ? newPO.data.purchaser.name
        : `Buyer # ${newPO.data.purchaser.id}`,
      supplierNotes: newPO.data.note ? newPO.data.note : "",
      rfqNumber: newPO.data["rfq-number"] ? newPO.data["rfq-number"] : "---",
      specDetails: newPO.data["spec-details"]
        ? newPO.data["spec-details"]
        : "---",
      poItems: mapPOItems(newPO.data["purchase-order-items"]),
      additionalCosts: newPO.data["extra-costs"]
        ? newPO.data["extra-costs"]
        : [],
      totalCost: mapPOItems(newPO.data["purchase-order-items"])
        .map((item) => item.totalCost)
        .reduce((a, b) => a + b),
      shippingParams: newPO["shipping-params"]
        ? newPO["shipping-params"]
        : null,
    };
    dispatch(getSinglePOSuccess({ purchaseOrder: formattedPO }));
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
}

export const createNewPO = (idArray) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const newPO = await createPO(idArray);
    if (newPO.error) {
      throw newPO.error;
    }
    console.log(newPO);
    const formattedPO = {
      id: newPO.data.id,
      status: newPO.data.status,
      dueDate: newPO.data["in-market-date"]
        ? newPO.data["in-market-date"]
        : format(addDays(new Date(), 120), "MM/dd/yyyy"),
      expectedShip: newPO.data["expected-ship-date"]
        ? newPO.data["expected-ship-date"]
        : format(addDays(new Date(), 90), "MM/dd/yyyy"),
      actualShip: newPO.data["actual-ship-date"]
        ? newPO.data["actual-ship-date"]
        : format(addDays(new Date(), 90), "MM/dd/yyyy"),
      terms: newPO.data.terms ? newPO.data.terms : "Net 30 Days",
      supplier: newPO.data.suppler ? newPO.data.supplier.name : "---",
      contactName: newPO.data.supplier ? newPO.data.supplier.contact : "---",
      email: newPO.data.supplier ? newPO.data.supplier.email : "---",
      phone: newPO.data.supplier ? newPO.data.supplier.phone : "---",
      purchasedBy: newPO.data.purchaser.name
        ? newPO.data.purchaser.name
        : `Buyer # ${newPO.data.purchaser.id}`,
      supplierNotes: newPO.data.note ? newPO.data.note : "",
      rfqNumber: newPO.data["rfq-number"] ? newPO.data["rfq-number"] : "---",
      specDetails: newPO.data["spec-details"]
        ? newPO.data["spec-details"]
        : "---",
      poItems: mapPOItems(newPO.data["purchase-order-items"]),
      additionalCosts: newPO.data["extra-costs"]
        ? newPO.data["extra-costs"]
        : [],
      totalCost: mapPOItems(newPO.data["purchase-order-items"])
        .map((item) => item.totalCost)
        .reduce((a, b) => a + b),
      shippingParams: newPO["shipping-params"]
        ? newPO["shipping-params"]
        : null,
    };
    dispatch(getSinglePOSuccess({ purchaseOrder: formattedPO }));
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};
