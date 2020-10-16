import { createSlice } from "@reduxjs/toolkit";

/*
* RFQ Model

{
  id: string (read),
  poNum: string (read),
  supplier: string (read),
  totalOrdered: int (read),
  estTotal: int (read),
  actTotal: int (read),
  status: string (read),
  dueDate: date string (read),
}

*/

let initialState = {
  isLoading: false,
  isNextLoading: false,
  posPerPage: 20,
  nextPage: null,
  nextLink: null,
  pos: [],
  error: null,
}

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

const purchaseOrderHistorySlice = createSlice({
  name: "poHistory",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    setNextIsLoading: startNextLoading,
    getPoHistorySuccess(state, action) {
      const { pos, nextLink } = action.payload;
      state.nextPage = nextLink ? true : false;
      state.nextLink = nextLink;
      state.pos = [...pos];
      state.isLoading = false;
      state.error = null;
    },
    getNextPoHistorySuccess(state, action) {
      const { pos, nextLink } = action.payload;
      state.nextPage = nextLink ? true : false;
      state.nextLink = nextLink;
      state.pos = state.pos.concat(pos);
      state.isNextLoading = false;
      state.error = null;
    },
    resetPoHistory(state) {
      state.isLoading = false;
      state.isNextLoading = false;
      state.posPerPage = 20;
      state.nextPage = null;
      state.nextLink = null;
      state.pos = [];
      state.error = null;
    },
    setFailure: loadingFailed,
  }
})

export const {
  setIsLoading,
  setNextIsLoading,
  getPoHistorySuccess,
  getNextPoHistorySuccess,
  resetPoHistory,
  setFailure,
} = purchaseOrderHistorySlice.actions;

export default purchaseOrderHistorySlice.reducer;