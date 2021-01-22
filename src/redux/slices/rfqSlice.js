import { createSlice } from "@reduxjs/toolkit";

import {
  fetchRollupItems,
  fetchNextRollupItems,
  createRFQ,
  fetchRFQ,
  sendBidRequests,
  updateRFQNote,
  updateRFQDate,
  acceptBid,
  declineBid,
} from "../../api/purchasingApi";

import { mapRollupItems, mapRFQ } from "../apiMaps";
/*
* RFQ Item Model (need to determine!)


*/

let initialState = {
  isLoading: false,
  isNextLoading: false,
  isUpdateLoading: false,
  nextPage: null,
  nextLink: null,
  rfqItems: [],
  selectedRFQItem: null,
  currentBidPrice: null,
  currentBidNote: "",
  currentRFQ: {
    id: null,
    status: null,
    dueDate: null,
    inMarketDate: null,
    bids: [],
    program: null,
    brand: null,
    itemType: null,
    itemNumber: null,
    totalItems: null,
    supplierNote: "",
    itemSpec: null,
    imgUrlThumb: null,
    imgUrlLg: null,
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

const rfqSlice = createSlice({
  name: "rfqSlice",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    setNextIsLoading: startNextLoading,
    setUpdateLoading: startUpdateLoading,
    getRFQItemsSuccess(state, action) {
      const { rfqItems, nextLink } = action.payload;
      state.nextPage = nextLink ? true : false;
      state.nextLink = nextLink;
      state.rfqItems = [...rfqItems];
      state.isLoading = false;
      state.error = null;
    },
    getNextRFQItemsSuccess(state, action) {
      const { rfqItems, nextLink } = action.payload;
      state.nextPage = nextLink ? true : false;
      state.nextLink = nextLink;
      state.rfqItems = state.rfqItems.concat(rfqItems);
      state.isNextLoading = false;
      state.error = null;
    },
    getSingleRFQSuccess(state, action) {
      const { rfq } = action.payload;
      state.currentRFQ.id = rfq.id;
      state.currentRFQ.status = rfq.status;
      state.currentRFQ.dueDate = rfq.dueDate;
      state.currentRFQ.inMarketDate = rfq.inMarketDate;
      state.currentRFQ.bids = rfq.bids;
      state.currentRFQ.program = rfq.program;
      state.currentRFQ.brand = rfq.brand;
      state.currentRFQ.itemType = rfq.itemType;
      state.currentRFQ.itemNumber = rfq.itemNumber;
      state.currentRFQ.totalItems = rfq.totalItems;
      state.currentRFQ.supplierNote = rfq.supplierNote;
      state.currentRFQ.itemSpec = rfq.itemSpec ? { ...rfq.itemSpec } : null;
      state.currentRFQ.imgUrlThumb = rfq.imgUrlThumb;
      state.currentRFQ.imgUrlLg = rfq.imgUrlLg;
      state.isLoading = false;
      state.isUpdateLoading = false;
      state.error = null;
    },
    setSelectedRFQItem(state, action) {
      const { itemId } = action.payload;
      state.selectedRFQItem = itemId;
    },
    updateQty(state, action) {
      const { qty } = action.payload;
      state.currentRFQ.totalItems = qty;
    },
    updateNote(state, action) {
      const { note } = action.payload;
      state.currentRFQ.supplierNote = note;
    },
    updateBids(state, action) {
      const { bids } = action.payload;
      state.currentRFQ.bids = bids;
    },
    updateCurrentBidPrice(state, action) {
      const { price } = action.payload;
      state.currentBidPrice = price;
    },
    updateCurrentBidNote(state, action) {
      const { note } = action.payload;
      state.currentBidNote = note;
    },
    updateDate(state, action) {
      const { date, type } = action.payload;
      if (type === "due-date") {
        state.currentRFQ.dueDate = date;
      } else {
        state.currentRFQ.inMarketDate = date;
      }
    },
    clearCurrentBidData(state) {
      state.currentBidPrice = null;
      state.currentBidNote = "";
    },
    updateSuccessful(state) {
      state.isUpdateLoading = false;
      state.error = null;
    },
    resetRFQ(state) {
      state.isLoading = false;
      state.rfqItems = [];
      state.currentRFQ.id = null;
      state.currentRFQ.status = null;
      state.currentRFQ.dueDate = null;
      state.currentRFQ.inMarketDate = null;
      state.currentRFQ.bids = [];
      state.currentRFQ.program = null;
      state.currentRFQ.brand = null;
      state.currentRFQ.itemType = null;
      state.currentRFQ.itemNumber = null;
      state.currentRFQ.totalItems = null;
      state.currentRFQ.supplierNote = "";
      state.currentRFQ.itemSpec = null;
      state.currentRFQ.imgUrlThumb = null;
      state.currentRFQ.imgUrlLg = null;
      state.error = null;
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  setNextIsLoading,
  setUpdateLoading,
  getRFQItemsSuccess,
  getNextRFQItemsSuccess,
  getSingleRFQSuccess,
  setSelectedRFQItem,
  updateQty,
  updateNote,
  updateBids,
  updateDate,
  updateCurrentBidNote,
  updateCurrentBidPrice,
  clearCurrentBidData,
  updateSuccessful,
  resetRFQ,
  setFailure,
} = rfqSlice.actions;

export default rfqSlice.reducer;

export const fetchFilteredRFQItems = (filterObject) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const items = await fetchRollupItems(filterObject, "rfq");
    if (items.error) {
      throw items.error;
    }
    let mappedItems = mapRollupItems(items.data.items);
    dispatch(
      getRFQItemsSuccess({
        rfqItems: mappedItems,
        nextLink: items.data.nextLink,
      })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const fetchNextFilteredRFQItems = (url) => async (dispatch) => {
  try {
    dispatch(setNextIsLoading());
    const items = await fetchNextRollupItems(url);
    if (items.error) {
      throw items.error;
    }
    let mappedItems = mapRollupItems(items.data.items);
    dispatch(
      getNextRFQItemsSuccess({
        rfqItems: mappedItems,
        nextLink: items.data.nextLink,
      })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const createNewRFQ = (item, user) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const newRFQ = await createRFQ(item, user);
    if (newRFQ.error) {
      throw newRFQ.error;
    }
    let mappedRFQ = mapRFQ(newRFQ.data);
    dispatch(getSingleRFQSuccess({ rfq: mappedRFQ }));
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const fetchSingleRFQ = (id) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const newRFQ = await fetchRFQ(id);
    if (newRFQ.error) {
      throw newRFQ.error;
    }
    let mappedRFQ = mapRFQ(newRFQ.data);
    dispatch(getSingleRFQSuccess({ rfq: mappedRFQ }));
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const sendBids = (idArray, rfqId) => async (dispatch) => {
  try {
    dispatch(setUpdateLoading());
    const bidResponse = await sendBidRequests(idArray, rfqId);
    if (bidResponse.error) {
      throw bidResponse.error;
    }
    let mappedRFQ = mapRFQ(bidResponse.data);
    dispatch(getSingleRFQSuccess({ rfq: mappedRFQ }));
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const updateSupplierNote = (id, note) => async (dispatch) => {
  try {
    dispatch(setUpdateLoading());
    const noteResponse = await updateRFQNote(id, note);
    if (noteResponse.error) {
      throw noteResponse.error;
    }
    dispatch(updateSuccessful());
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const updateRFQDates = (id, dateType, date) => async (dispatch) => {
  try {
    dispatch(setUpdateLoading());
    const dateResponse = await updateRFQDate(id, dateType, date);
    if (dateResponse.error) {
      throw dateResponse.error;
    }
    dispatch(updateDate({ date: date, type: dateType }));
    dispatch(updateSuccessful());
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const acceptCurrentBid = (id, price, note) => async (dispatch) => {
  try {
    dispatch(setUpdateLoading());
    const acceptResponse = await acceptBid(id, price, note);
    if (acceptResponse.error) {
      throw acceptResponse.error;
    }
    //todo
    dispatch(updateSuccessful());
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
}

export const declineCurrentBid = (id) => async (dispatch) => {
  try {
    dispatch(setUpdateLoading());
    const acceptResponse = await declineBid(id);
    if (acceptResponse.error) {
      throw acceptResponse.error;
    }
    //todo
    dispatch(updateSuccessful());
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
}
