import { createSlice } from "@reduxjs/toolkit";

import { fetchRFQItems, createRFQ } from "../../api/supplierApi";

import { mapRFQItems } from "../apiMaps";
/*
* RFQ Item Model (not final!)

{
  id: string (read),
  sequenceNum: string (read),
  quoteDate: date string (read/write),
  dueDate: date string (read/write),
  program: string (read),
  brand(s): array (read),
  itemType: string (read),
  sequenceNum: string (read),
  qty: int (read, write),
  supplierNote: string (read, write),
  specDetails: object (read)
    {
      font4Color: string (read),
      frontFinish: string (read),
      back4Color: string (read),
      hotStamp: string (read),
      embossing: string (read),
      stock: string (read),
      flatSize: string (read),
      finishingType: string (read),
      perf: string (read),
      score: string (read)
    },
  images: array (read),
  suppliers: object (read, write)
    {
      imperial: {
        sent: bool (read, write)
        awarded: bool (read, write)
        quote: {
          quoteCost: int (read),
          note: string (read),
        } 
      },
      sterling: {
        sent: bool (read, write)
        awarded: bool (read, write)
        quote: {
          quoteCost: int (read),
          note: string (read),
        } 
      },
      curtis: {
        sent: bool (read, write)
        awarded: bool (read, write)
        quote: {
          quoteCost: int (read),
          note: string (read),
        } 
      },
      willey: {
        sent: bool (read, write)
        awarded: bool (read, write)
        quote: {
          quoteCost: int (read),
          note: string (read),
        } 
      }
    }
}

*/

let initialState = {
  isLoading: false,
  isNextLoading: false,
  nextPage: null,
  nextLink: null,
  rfqNum: null,
  rfqStatus: null,
  rfqItems: [],
  selectedRFQItem: null,
  error: null,
};

const startLoading = (state) => {
  state.isLoading = true;
};

const startNextLoading = (state) => {
  state.isNextLoading = true;
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
    setSelectedRFQItem(state, action) {
      const { itemId } = action.payload;
      state.selectedRFQItem = itemId;
    },
    updateQty(state, action) {
      const { sequenceNum, value } = action.payload;
      let newRFQs = state.rfqItems.map((rfq) => {
        if (rfq.sequenceNum === sequenceNum) {
          return {
            ...rfq,
            qty: value,
          };
        } else return rfq;
      });
      state.rfqItems = newRFQs;
      state.error = null;
    },
    updateNote(state, action) {
      const { sequenceNum, value } = action.payload;
      let newRFQs = state.rfqItems.map((rfq) => {
        if (rfq.sequenceNum === sequenceNum) {
          return {
            ...rfq,
            supplierNote: value,
          };
        } else return rfq;
      });
      state.rfqItems = newRFQs;
      state.error = null;
    },
    updateSupplier(state, action) {
      const { sequenceNum, supplier, key, value } = action.payload;
      let newRFQs = state.rfqItems.map((rfq) => {
        if (rfq.sequenceNum === sequenceNum) {
          return {
            ...rfq,
            suppliers: {
              ...rfq.suppliers,
              [`${supplier}`]: {
                ...rfq.suppliers[`${supplier}`],
                [`${key}`]: value,
              },
            },
          };
        } else return rfq;
      });
      state.rfqItems = newRFQs;
      state.error = null;
    },
    resetRFQ(state) {
      state.isLoading = false;
      state.rfqNum = null;
      state.rfqStatus = null;
      state.rfqItems = [];
      state.error = null;
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  setNextIsLoading,
  getRFQItemsSuccess,
  getNextRFQItemsSuccess,
  setSelectedRFQItem,
  updateQty,
  updateNote,
  updateSupplier,
  resetRFQ,
  setFailure,
} = rfqSlice.actions;

export default rfqSlice.reducer;

export const fetchFilteredRFQItems = (filterObject) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const items = await fetchRFQItems(filterObject);
    if (items.error) {
      throw items.error;
    }
    console.log(items.data);
    let mappedItems = mapRFQItems(items.data);
    console.log(mappedItems);
    dispatch(getRFQItemsSuccess({ rfqItems: mappedItems }));
  } catch (err) {
    dispatch(setFailure(err.toString()));
  }
};

export const createNewRFQ = (item, user) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const newRFQ = await createRFQ(item, user);
    if (newRFQ.error) {
      throw newRFQ.error;
    }
    console.log(newRFQ.data);
    //TODO getNewRFQSuccess: map all rfq params to state, read in on new rfq.
  } catch (err) {
    dispatch(setFailure(err.toString()));
  }
};
