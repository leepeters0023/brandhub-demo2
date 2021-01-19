import { createSlice } from "@reduxjs/toolkit";
import {
  fetchRollupItems,
  fetchNextRollupItems,
  createPO,
  createInvPO,
  fetchPO,
  updatePODate,
  updatePOMethod,
  updatePONote,
  updatePOTape,
  updatePOFile,
  updatePODirectShip,
  updatePOItemPackOut,
  updatePOItemCost,
  updatePOItemPackSize,
  deletePO,
  deletePOItem,
  addToPO,
  submitPO,
  completePO,
  updateShippingParams,
  addAdditionalPOCost,
} from "../../api/purchasingApi";
import {
  setIsLoading as patchLoading,
  patchSuccess,
  setFailure as patchFailure,
} from "./patchOrderSlice";
import { stringToCents } from "../../utility/utilityFunctions";
import { mapRollupItems, mapPurchaseOrder, mapPOItems } from "../apiMaps";

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
    brand: null,
    status: null,
    accepted: false,
    dueDate: null,
    expectedShip: null,
    actualShip: null,
    terms: null,
    supplier: null,
    contactName: null,
    email: null,
    phone: null,
    purchasedBy: null,
    method: "",
    supplierNotes: "",
    rfqNumber: null,
    shippingLabel: null,
    additionalFile: null,
    keyAcctTape: "",
    specDetails: null,
    poItems: [],
    totalCost: null,
    totalTax: null,
    directShip: null,
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
      state.currentPO.brand = purchaseOrder.brand;
      state.currentPO.status = purchaseOrder.status;
      state.currentPO.accepted = purchaseOrder.accepted;
      state.currentPO.dueDate = purchaseOrder.dueDate;
      state.currentPO.expectedShip = purchaseOrder.expectedShip;
      state.currentPO.actualShip = purchaseOrder.actualShip;
      state.currentPO.terms = purchaseOrder.terms;
      state.currentPO.supplier = purchaseOrder.supplier;
      state.currentPO.contactName = purchaseOrder.contactName;
      state.currentPO.email = purchaseOrder.email;
      state.currentPO.phone = purchaseOrder.phone;
      state.currentPO.purchasedBy = purchaseOrder.purchasedBy;
      state.currentPO.method = purchaseOrder.method;
      state.currentPO.supplierNotes = purchaseOrder.supplierNotes;
      state.currentPO.shippingLabel = purchaseOrder.shippingLabel;
      state.currentPO.additionalFile = purchaseOrder.additionalFile;
      state.currentPO.keyAcctTape = purchaseOrder.keyAcctTape;
      state.currentPO.rfqNumber = purchaseOrder.rfqNumber;
      state.currentPO.specDetails = purchaseOrder.specDetails;
      state.currentPO.poItems = purchaseOrder.poItems;
      state.currentPO.totalCost = purchaseOrder.totalCost;
      state.currentPO.totalTax = purchaseOrder.totalTax;
      state.currentPO.directShip = purchaseOrder.directShip;
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
      let fixedCost = stringToCents(cost);
      const updatedItems = state.currentPO.poItems.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            actCost: +fixedCost,
            totalCost: +fixedCost * item.totalItems,
          };
        } else return item;
      });
      state.currentPO.poItems = updatedItems;
      state.currentPO.totalCost = updatedItems
        .map((item) => item.totalCost)
        .reduce((a, b) => a + b);
      state.isUpdateLoading = false;
      state.error = null;
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
      state.error = null;
    },
    addCost(state, action) {
      const { item } = action.payload;
      const currentItems = state.currentPO.poItems.concat(item);
      state.currentPO.poItems = currentItems;
      state.currentPO.totalCost = currentItems
        .map((item) => item.totalCost)
        .reduce((a, b) => a + b);
      state.isUpdateLoading = false;
      state.error = null;
    },
    updateItemPackout(state, action) {
      const { id, packOut } = action.payload;
      const updatedItems = state.currentPO.poItems.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            packOut: packOut,
          };
        } else return item;
      });
      state.currentPO.poItems = updatedItems;
      state.isUpdateLoading = false;
      state.error = null;
    },
    updateMethod(state, action) {
      const { value } = action.payload;
      state.currentPO.method = value;
      state.isUpdateLoading = false;
      state.error = null;
    },
    updateSupplierNotes(state, action) {
      const { value } = action.payload;
      state.currentPO.supplierNotes = value;
      state.isUpdateLoading = false;
      state.error = null;
    },
    updateKeyAcctTape(state, action) {
      const { value } = action.payload;
      state.currentPO.keyAcctTape = value;
      state.isUpdateLoading = false;
      state.error = null;
    },
    updateDate(state, action) {
      const { type, value } = action.payload;
      state.currentPO[type] = value;
      state.isUpdateLoading = false;
      state.error = null;
    },
    updateDirectShip(state, action) {
      const { value } = action.payload;
      state.currentPO.directShip = value;
      state.isUpdateLoading = false;
      state.error = null;
    },
    updateAdditionalFile(state, action) {
      const { file } = action.payload;
      state.currentPO.additionalFile = file;
      state.isUpdateLoading = false;
      state.error = null;
    },
    deleteItemSuccess(state, action) {
      const { id } = action.payload;
      const currentItems = state.currentPO.poItems.filter(
        (item) => item.id !== id
      );
      state.currentPO.poItems = currentItems;
      state.isUpdateLoading = false;
      state.error = null;
    },
    submitPOSuccess(state) {
      state.currentPO.status = "submitted";
      state.isUpdateLoading = false;
      state.error = null;
    },
    completePOSuccess(state) {
      state.currentPO.status = "complete";
      state.isUpdateLoading = false;
      state.error = null;
    },
    updateParamSuccess(state) {
      state.isUpdateLoading = false;
      state.error = null;
    },
    deletePOSuccess(state) {
      state.isUpdateLoading = false;
      state.currentPO.id = null;
      state.currentPO.brand = null;
      state.currentPO.status = null;
      state.currentPO.accepted = false;
      state.currentPO.dueDate = null;
      state.currentPO.expectedShip = null;
      state.currentPO.actualShip = null;
      state.currentPO.terms = null;
      state.currentPO.supplier = null;
      state.currentPO.contactName = null;
      state.currentPO.email = null;
      state.currentPO.phone = null;
      state.currentPO.purchasedBy = null;
      state.currentPO.method = "";
      state.currentPO.supplierNotes = "";
      state.currentPO.shippingLabel = null;
      state.currentPO.additionalFile = null;
      state.currentPO.keyAcctTape = "";
      state.currentPO.rfqNumber = null;
      state.currentPO.specDetails = null;
      state.currentPO.poItems = [];
      state.currentPO.totalCost = null;
      state.currentPO.totalTax = null;
      state.currentPO.directShip = null;
      state.currentPO.shippingParams = [];
      state.error = null;
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
      state.currentPO.brand = null;
      state.currentPO.status = null;
      state.currentPO.accepted = false;
      state.currentPO.dueDate = null;
      state.currentPO.expectedShip = null;
      state.currentPO.actualShip = null;
      state.currentPO.terms = null;
      state.currentPO.supplier = null;
      state.currentPO.contactName = null;
      state.currentPO.email = null;
      state.currentPO.phone = null;
      state.currentPO.purchasedBy = null;
      state.currentPO.method = "";
      state.currentPO.supplierNotes = "";
      state.currentPO.shippingLabel = null;
      state.currentPO.additionalFile = null;
      state.currentPO.keyAcctTape = "";
      state.currentPO.rfqNumber = null;
      state.currentPO.specDetails = null;
      state.currentPO.poItems = [];
      state.currentPO.totalCost = null;
      state.currentPO.totalTax = null;
      state.currentPO.directShip = null;
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
  updateItemPackout,
  updateItemPackSize,
  addCost,
  updateDate,
  updateMethod,
  updateSupplierNotes,
  updateKeyAcctTape,
  updateDirectShip,
  updateAdditionalFile,
  deleteItemSuccess,
  deletePOSuccess,
  submitPOSuccess,
  completePOSuccess,
  updateParamSuccess,
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
    console.log(newPO)
    const formattedPO = mapPurchaseOrder(newPO.data);
    dispatch(getSinglePOSuccess({ purchaseOrder: formattedPO }));
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const createNewPO = (idArray, orderType, programId) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const newPO = await createPO(idArray, orderType, programId);
    if (newPO.error) {
      throw newPO.error;
    }
    const formattedPO = mapPurchaseOrder(newPO.data);
    dispatch(getSinglePOSuccess({ purchaseOrder: formattedPO }));
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const createInventoryPO = (itemId, qty, warehouse, programId) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const newPO = await createInvPO(itemId, qty, warehouse, programId);
    if (newPO.error) {
      throw newPO.error;
    }
    const formattedPO = mapPurchaseOrder(newPO.data);
    dispatch(getSinglePOSuccess({ purchaseOrder: formattedPO }));
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
}

export const addItemsToPO = (idArray, poNum) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const updatedPO = await addToPO(idArray, poNum);
    if (updatedPO.error) {
      throw updatedPO.error;
    }
    const formattedPO = mapPurchaseOrder(updatedPO.data);
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
    dispatch(patchLoading())
    dispatch(setUpdateLoading());
    const dateStatus = updatePODate(id, type, value);
    if (dateStatus.error) {
      throw dateStatus.error;
    }
    dispatch(updateDate({ type: typeMap[type], value: value }));
    dispatch(patchSuccess())
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(patchFailure({ error: err.toString() }));
  }
};

export const updateShipMethod = (id, method) => async (dispatch) => {
  try {
    dispatch(patchLoading())
    dispatch(setUpdateLoading());
    const methodStatus = updatePOMethod(id, method);
    if (methodStatus.error) {
      throw methodStatus.error;
    }
    dispatch(updateMethod({ value: method }));
    dispatch(patchSuccess())
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(patchFailure({ error: err.toString() }));
  }
};

export const updateSupplierNote = (id, note) => async (dispatch) => {
  try {
    dispatch(patchLoading())
    dispatch(setUpdateLoading());
    const noteStatus = updatePONote(id, note);
    if (noteStatus.error) {
      throw noteStatus.error;
    }
    dispatch(updateSupplierNotes({ value: note }));
    dispatch(patchSuccess())
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(patchFailure({ error: err.toString() }));
  }
};

export const updateKeyAccountTape = (id, tape) => async (dispatch) => {
  try {
    dispatch(patchLoading())
    dispatch(setUpdateLoading());
    const tapeStatus = updatePOTape(id, tape);
    if (tapeStatus.error) {
      throw tapeStatus.error;
    }
    dispatch(updateKeyAcctTape({ value: tape }));
    dispatch(patchSuccess())
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(patchFailure({ error: err.toString() }));
  }
};

export const addAdditionalFile = (id, file) => async (dispatch) => {
  try {
    dispatch(patchLoading())
    dispatch(setUpdateLoading());
    const fileURL = await updatePOFile(id, file);
    if (fileURL.error) {
      throw fileURL.error;
    }
    dispatch(updateAdditionalFile({file: file}))
    dispatch(patchSuccess())
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(patchFailure({ error: err.toString() }));
  }
}

export const setDirectShip = (id, value) => async (dispatch) => {
  try {
    dispatch(patchLoading())
    dispatch(setUpdateLoading());
    const shipStatus = updatePODirectShip(id, value);
    if (shipStatus.error) {
      throw shipStatus.error;
    }
    dispatch(updateDirectShip({ value: value }));
    dispatch(patchSuccess())
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(patchFailure({ error: err.toString() }));
  }
};

export const setItemPackSize = (id, packSize) => async (dispatch) => {
  try {
    dispatch(patchLoading())
    dispatch(setUpdateLoading());
    const packSizeStatus = updatePOItemPackSize(id, packSize);
    if (packSizeStatus.error) {
      throw packSizeStatus.error;
    }
    dispatch(updateItemPackSize({ id: id, packSize: packSize }));
    dispatch(patchSuccess())
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(patchFailure({ error: err.toString() }));
  }
};

export const setItemPackOut = (id, packout) => async (dispatch) => {
  try {
    dispatch(patchLoading())
    dispatch(setUpdateLoading());
    const packStatus = updatePOItemPackOut(id, packout);
    if (packStatus.error) {
      throw packStatus.error;
    }
    dispatch(updateItemPackout({ id: id, packOut: packout }));
    dispatch(patchSuccess())
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(patchFailure({ error: err.toString() }));
  }
};

export const setItemActCost = (id, cost) => async (dispatch) => {
  try {
    dispatch(patchLoading())
    dispatch(setUpdateLoading());
    const costStatus = updatePOItemCost(id, cost);
    if (costStatus.error) {
      throw costStatus.error;
    }
    dispatch(updateItemActualCost({ id: id, cost: cost }));
    dispatch(patchSuccess())
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(patchFailure({ error: err.toString() }));
  }
};

export const deleteItem = (id) => async (dispatch) => {
  try {
    dispatch(patchLoading())
    dispatch(setUpdateLoading());
    const deleteStatus = await deletePOItem(id);
    if (deleteStatus.error) {
      throw deleteStatus.error;
    }
    dispatch(deleteItemSuccess({ id: id }));
    dispatch(patchSuccess())
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(patchFailure({ error: err.toString() }));
  }
};

export const addSetUpFee = (id, desc, cost) => async (dispatch) => {
  try {
    dispatch(patchLoading())
    dispatch(setUpdateLoading());
    const formattedCost = parseFloat(cost).toString();
    const newPOItem = await addAdditionalPOCost(id, desc, formattedCost);
    if (newPOItem.error) {
      throw newPOItem.error;
    }
    let mappedItem = mapPOItems([newPOItem.data]);
    dispatch(addCost({ item: mappedItem }))
    dispatch(patchSuccess())
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(patchFailure({ error: err.toString() }));
  }
}

export const deletePurchaseOrder = (id) => async (dispatch) => {
  try {
    dispatch(patchLoading())
    dispatch(setUpdateLoading());
    const deleteStatus = await deletePO(id);
    if (deleteStatus.error) {
      throw deleteStatus.error;
    }
    dispatch(deletePOSuccess());
    dispatch(patchSuccess())
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(patchFailure({ error: err.toString() }));
  }
};

export const submitPurchaseOrder = (id) => async (dispatch) => {
  try {
    dispatch(patchLoading())
    dispatch(setUpdateLoading());
    const submitStatus = await submitPO(id);
    if (submitStatus.error) {
      throw submitStatus.error;
    }
    dispatch(submitPOSuccess());
    dispatch(patchSuccess())
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(patchFailure({ error: err.toString() }));
  }
};

export const completePurchaseOrder = (id) => async (dispatch) => {
  try {
    dispatch(patchLoading())
    dispatch(setUpdateLoading());
    const completeStatus = await completePO(id);
    if (completeStatus.error) {
      throw completeStatus.error;
    }
    dispatch(completePOSuccess());
    dispatch(patchSuccess())
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(patchFailure({ error: err.toString() }));
  }
};

export const updateAllShippingParams = (updateArray, id) => async (
  dispatch
) => {
  try {
    dispatch(patchLoading())
    dispatch(setUpdateLoading());
    const params = await updateShippingParams(updateArray);
    if (params.error) {
      throw params.error;
    }
    const newPO = await fetchPO(id);
    if (newPO.error) {
      throw newPO.error;
    }
    const formattedPO = mapPurchaseOrder(newPO.data);
    dispatch(getSinglePOSuccess({ purchaseOrder: formattedPO }));
    dispatch(updateParamSuccess());
    dispatch(patchSuccess())
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(patchFailure({ error: err.toString() }));
  }
};
