import { createSlice } from "@reduxjs/toolkit";

/*
* RFQ Item Model

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
          price: int (read),
          note: string (read),
        } 
      },
      sterling: {
        sent: bool (read, write)
        awarded: bool (read, write)
        quote: {
          price: int (read),
          note: string (read),
        } 
      },
      curtis: {
        sent: bool (read, write)
        awarded: bool (read, write)
        quote: {
          price: int (read),
          note: string (read),
        } 
      },
      willey: {
        sent: bool (read, write)
        awarded: bool (read, write)
        quote: {
          price: int (read),
          note: string (read),
        } 
      }
    }
}

*/

let initialState = {
  isLoading: false,
  rfqNum: null,
  rfqStatus: null,
  rfqItems: [],
  error: null,
}

const startLoading = (state) => {
  state.isLoading = true;
}

const loadingFailed = (state, action) => {
  const { error } = action.payload;
  state.isLoading = false;
  state.error = error;
}

const rfqSlice = createSlice({
  name: "rfqSlice",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    getRFQSuccess(state, action) {
      const { rfqs } = action.payload;
      state.rfqItems = [...rfqs ]
      state.isLoading = false;
      state.error = null;
    },
    updateQty(state, action) {
      const { sequenceNum, value } = action.payload;
      let newRFQs = state.rfqItems.map((rfq) => {
        if (rfq.sequenceNum === sequenceNum) {
          return {
            ...rfq,
            qty: value
          }
        } else return rfq
      })
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
          }
        } else return rfq
      })
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
              }
            }
          }
        } else return rfq
      })
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
  }
})

export const {
  setIsLoading,
  getRFQSuccess,
  updateQty,
  updateNote,
  updateSupplier,
  resetRFQ,
  setFailure,
} = rfqSlice.actions;

export default rfqSlice.reducer;