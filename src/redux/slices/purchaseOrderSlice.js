import { createSlice } from "@reduxjs/toolkit";
import {
  fetchRollupItems,
  fetchNextRollupItems,
  createPO,
  fetchPO,
  updatePODate,
  updatePONote,
  updatePOItemCost,
  updatePOItemPackSize,
} from "../../api/purchasingApi";
import { mapRollupItems, mapPOItems } from "../apiMaps";
import addDays from "date-fns/addDays";

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
    shippingLabel: null,
    keyAcctTape: "",
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
      state.currentPO.shippingLabel = purchaseOrder.shippingLabel;
      state.currentPO.keyAcctTape = purchaseOrder.keyAcctTape;
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
    updateItemActualCost(state, action) {
      const { id, cost } = action.payload;
      console.log(id, cost);
      const updatedItems = state.currentPO.poItems.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            actCost: +cost,
            totalCost: +cost * item.totalItems,
          };
        } else return item;
      });
      console.log(updatedItems);
      state.currentPO.poItems = updatedItems;
      state.currentPO.totalCost = updatedItems
        .map((item) => item.totalCost)
        .reduce((a, b) => a + b);
      state.isUpdateLoading = false;
    },
    updateItemPackSize(state, action) {
      const { id, packSize } = action.payload;
      const updatedItems = state.currentPO.poItems.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            packSize: packSize,
          };
        } else return item;
      });
      state.currentPO.poItems = updatedItems;
      state.isUpdateLoading = false;
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
      state.isUpdateLoading = false;
    },
    updateDate(state, action) {
      const { type, value } = action.payload;
      state.currentPO[type] = value;
      state.isUpdateLoading = false;
    },
    resetPurchaseOrder(state) {
      state.isLoading = false;
      state.isNextLoading = false;
      state.isUpdateLoading = false;
      state.nextPage = null;
      state.nextLink = null;
      state.poItems = [];
      state.selectedPOItems = [];
      state.currentPO.id = null;
      state.currentPO.status = null;
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
      state.currentPO.shippingLabel = null;
      state.currentPO.keyAcctTape = "";
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
  updateItemActualCost,
  updateItemPackSize,
  addCost,
  updateCost,
  updateDate,
  updateSupplierNotes,
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
        : addDays(new Date(), 120),
      expectedShip: newPO.data["expected-ship-date"]
        ? newPO.data["expected-ship-date"]
        : addDays(new Date(), 90),
      terms: newPO.data.terms ? newPO.data.terms : "Net 30 Days",
      supplier: newPO.data.suppler ? newPO.data.supplier.name : "---",
      contactName: newPO.data.supplier ? newPO.data.supplier.contact : "---",
      email: newPO.data.supplier ? newPO.data.supplier.email : "---",
      phone: newPO.data.supplier ? newPO.data.supplier.phone : "---",
      purchasedBy: newPO.data.purchaser.name
        ? newPO.data.purchaser.name
        : `Buyer # ${newPO.data.purchaser.id}`,
      supplierNotes: newPO.data.note ? newPO.data.note : "",
      keyAcctTape: newPO.data["key-account-tape"]
        ? newPO.data["key-account-tape"]
        : "",
      shippingLabel: newPO.data.label ? newPO.data.label : "---",
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
        : addDays(new Date(), 120),
      expectedShip: newPO.data["expected-ship-date"]
        ? newPO.data["expected-ship-date"]
        : addDays(new Date(), 90),
      terms: newPO.data.terms ? newPO.data.terms : "Net 30 Days",
      supplier: newPO.data.suppler ? newPO.data.supplier.name : "---",
      contactName: newPO.data.supplier ? newPO.data.supplier.contact : "---",
      email: newPO.data.supplier ? newPO.data.supplier.email : "---",
      phone: newPO.data.supplier ? newPO.data.supplier.phone : "---",
      purchasedBy: newPO.data.purchaser.name
        ? newPO.data.purchaser.name
        : `Buyer # ${newPO.data.purchaser.id}`,
      supplierNotes: newPO.data.note ? newPO.data.note : "",
      keyAcctTape: newPO.data["key-account-tape"]
        ? newPO.data["key-account-tape"]
        : "",
      shippingLabel: newPO.data.label ? newPO.data.label : "---",
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

export const updateDateByType = (id, type, value) => async (dispatch) => {
  const typeMap = {
    "in-market-date": "dueDate",
    "expected-ship-date": "expectedShip",
    "actual-ship-date": "actualShip",
  };
  try {
    dispatch(setUpdateLoading());
    const dateStatus = updatePODate(id, type, value);
    if (dateStatus.error) {
      throw dateStatus.error;
    }
    dispatch(updateDate({ type: typeMap[type], value: value }));
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const updateSupplierNote = (id, note) => async (dispatch) => {
  try {
    dispatch(setUpdateLoading());
    const noteStatus = updatePONote(id, note);
    if (noteStatus.error) {
      throw noteStatus.error;
    }
    dispatch(updateSupplierNotes({ value: note }));
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const setItemPackSize = (id, packSize) => async (dispatch) => {
  try {
    dispatch(setUpdateLoading());
    const packSizeStatus = updatePOItemPackSize(id, packSize);
    if (packSizeStatus.error) {
      throw packSizeStatus.error
    }
    dispatch(updateItemPackSize({ id: id, packSize: packSize }))
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
}

export const setItemActCost = (id, cost) => async (dispatch) => {
  try {
    dispatch(setUpdateLoading());
    const costStatus = updatePOItemCost(id, cost);
    if (costStatus.error) {
      throw costStatus.error
    }
    dispatch(updateItemActualCost({ id: id, cost: cost }))
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
}
