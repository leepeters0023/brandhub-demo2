import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  isLoading: false,
  orderType: null,
  itemsPerPage: 20,
  totalPages: null,
  pagesLoaded: 0,
  nextLink: null,
  items: [],
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

const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    setTotalPages(state, action) {
      const { pageCount } = action.payload;
      state.totalPages = pageCount
    },
    getItemsSuccess(state, action) {
      const { orderType, items, nextLink } = action.payload;
      let currentItems = [...state.items]
      let updatedItems = currentItems.concat(items);
      state.orderType = orderType;
      state.pagesLoaded += 1;
      state.nextLink = nextLink;
      state.items = updatedItems;
      state.isLoading = false;
      state.error = null
    },
    setFailure: loadingFailed
  }
})

export const {
  setIsLoading,
  setTotalPages,
  getItemsSuccess,
  setFailure
} = itemSlice.actions;

export default itemSlice.reducer();