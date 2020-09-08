import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  isLoading: false,
  itemsPerPage: 20,
  totalPages: null,
  pagesLoaded: null,
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

    },
    getItemsSuccess(state, action) {

    },
    setFailure: loadingFailed
  }
})

export default itemSlice.reducer();