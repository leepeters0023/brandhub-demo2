import { createSlice } from "@reduxjs/toolkit";

/*
* Item Model

{
  id: string (read),
  sequenceNum: string (read),
  territory: string (read),
  program: string (read),
  itemType: string (read),
  totalOrdered: int (read),
  notCompliant: int (read),
  estCost: int (read),
  estTotal: int (read),
  dueDate: date string (read),
  supplier: string (read)
}

*/

let initialState = {
  isLoading: false,
  isNextLoading: false,
  itemsPerPage: 20,
  nextPage: null,
  nextLink: null,
  items: [],
  error: false,
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

const itemRollupSlice = createSlice({
  name: "itemRollup",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    setNextIsLoading: startNextLoading,
    getItemRollupSuccess(state, action) {
      const {items, nextLink} = action.payload;
      state.nextPage = nextLink ? true : false;
      state.nextLink = nextLink;
      state.items = [...items];
      state.isLoading = false;
      state.error = null;
    },
    getNextItemRollupSuccess(state, action) {
      const {items, nextLink} = action.payload;
      state.nextPage = nextLink ? true : false;
      state.nextLink = nextLink;
      state.items = state.items.concat(items);
      state.isNextLoading = false;
      state.error = null;
    },
    resetItemRollup(state) {
      state.isLoading = false;
      state.isNextLoading = false;
      state.itemsPerPage = 20;
      state.nextPage = null;
      state.nextLink = null;
      state.items = [];
      state.error = null;
    },
    setFailure: loadingFailed,
  }
})

export const {
  setIsLoading,
  setNextIsLoading,
  getItemRollupSuccess,
  getNextItemRollupSuccess,
  resetItemRollup,
  setFailure,
} = itemRollupSlice.actions;

export default itemRollupSlice.reducer;