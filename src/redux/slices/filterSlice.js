import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  fromDate: null,
  toDate: null,
  bu: [],
  brand: null,
  distributor: null,
  itemType: [],
  month: [],
  orderType: null,
  program: null,
  sequenceNum: null,
  status: null,
  user: null,
  sortOrder: null,
  sortOrderBy: null,
  sortProgramsBy: null,
  chipList: [],
  defaultFilters: null,
  clearFilters: false,
  sorted: false,
  filterType: null,
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setFilterType(state, action) {
      const { type } = action.payload;
      state.filterType = type;
    },
    setDefaultFilters(state, action) {
      const { filterObject } = action.payload;
      state.fromDate = null;
      state.toDate = null;
      state.bu = [];
      state.brand = null;
      state.distributor = null;
      state.itemType = [];
      state.month = [];
      state.orderType = null;
      state.program = null;
      state.sequenceNum = null;
      state.status = null;
      state.user = null;
      state.sortOrder = null;
      state.sortOrderBy = null;
      state.sortProgramsBy = null;
      state.chipList = [];
      state.clearFilters = false;
      state.defaultFilters = { ...filterObject };
    },
    updateMultipleFilters(state, action) {
      const { filterObject } = action.payload;
      for (let filter in filterObject) {
        state[filter] = filterObject[filter];
      }
    },
    updateSingleFilter(state, action) {
      const { filter, value } = action.payload;
      state[filter] = value;
    },
    setClear(state) {
      state.clearFilters = true;
    },
    setSorted(state) {
      state.sorted = true;
    },
    resetFilters(state) {
      state.fromDate = null;
      state.toDate = null;
      state.bu = [];
      state.brand = null;
      state.distributor = null;
      state.itemType = [];
      state.month= [];
      state.orderType = null;
      state.program = null;
      state.sequenceNum = null;
      state.status = null;
      state.user = null;
      state.sortOrder = null;
      state.sortOrderBy = null;
      state.sortProgramsBy = null;
      state.chipList = [];
      state.clearFilters = false;
    },
    setChips(state, action) {
      const { filterType } = action.payload;
      let chippable;
      if (filterType === "item") {
        chippable = [
          "bu",
          "brand",
          "itemType",
        ];
      }
      if (filterType === "history") {
        chippable = [
          "fromDate",
          "toDate",
          "bu",
          "brand",
          "distributor",
          "itemType",
          "orderType",
          "program",
          "sequenceNum",
          "status",
          "user",
        ];
      }
      if (filterType === "program") {
        chippable = [
          "month",
          "brand",
          "bu"
        ]
      }
      let filters = [];
      let stateObject = { ...state };
      for (let filter in stateObject) {
        if (chippable.includes(filter)) {
          if (filter === "bu" || filter === "itemType" || filter === "month") {
            stateObject[filter].forEach((f) =>
              filters.push({ type: filter, value: f })
            );
          } else if (
            filter === "brand" ||
            filter === "user" ||
            filter === "distributor"
          ) {
            if (stateObject[filter]) {
              filters.push({ type: filter, value: stateObject[filter].name });
            }
          } else if (stateObject[filter]) {
            filters.push({ type: filter, value: stateObject[filter] });
          }
        }
      }
      state.chipList = filters;
    },
  },
});

export const {
  setFilterType,
  setDefaultFilters,
  updateMultipleFilters,
  updateSingleFilter,
  setSorted,
  setClear,
  resetFilters,
  setChips,
} = filterSlice.actions;

export default filterSlice.reducer;
