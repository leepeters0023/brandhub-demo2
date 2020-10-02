import { createSlice } from "@reduxjs/toolkit";
import subDays from "date-fns/subDays";
import format from "date-fns/format";

let initialState = {
  fromDate: format(subDays(new Date(), 7), "MM/dd/yyyy"),
  toDate: format(new Date(), "MM/dd/yyyy"),
  bu: [],
  brand: null,
  distributor: null,
  itemType: [],
  orderType: null,
  program: null,
  sequenceNum: null,
  status: null,
  user: null,
  sortOrder: null,
  sortOrderBy: null,
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    updateMultipleFilters(state, action) {
      const {filterObject} = action.payload;
      for (let filter in filterObject) {
        state[filter] = filterObject[filter]
      }
    },
    updateSingleFilter(state, action) {
      const {filter, value} = action.payload;
      state[filter] = value 
    },
    resetFilters(state) {
      state.fromDate = format(subDays(new Date(), 7), "MM/dd/yyyy");
      state.toDate = format(new Date(), "MM/dd/yyyy");
      state.bu = null;
      state.brand = null;
      state.distributor = null;
      state.itemType = null;
      state.orderType = null;
      state.program = null;
      state.sequenceNum = null;
      state.status = null;
      state.user = null;
      state.sortOrder = null;
      state.sortOrderBy = null;
    },
  }
})

export const {
  updateMultipleFilters,
  updateSingleFilter,
  resetFilters
} = filterSlice.actions

export default filterSlice.reducer;
