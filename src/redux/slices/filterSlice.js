import { createSlice } from "@reduxjs/toolkit";

/*
* Filter Model
notes: filters are determined soley from the client logic and have nothing
to do with calls to the api for their creation.  They are used within api
calls to determine query strings that will be sent to the api.  All arrays
will include objects with an id key, and a name key ({id: string, name: string})
or just a single string represting the name and filter.  Every other field
is a string.
*/

let initialState = {
  fromDate: null,
  toDate: null,
  bu: [],
  brand: [],
  distributor: [],
  groupBy: null,
  itemType: [],
  favItems: [],
  month: [],
  orderType: null,
  poNum: null,
  program: [],
  rfqNum: null,
  ruleType: [],
  sequenceNum: null,
  itemDesc: null,
  status: null,
  supplier: [],
  tag: [],
  territory: [],
  type: null,
  user: [],
  userName: null,
  sortOrder: null,
  sortOrderBy: null,
  sortProgramsBy: null,
  chipList: [],
  defaultFilters: null,
  clearFilters: false,
  retainFilters: false,
  fetchCurrent: false,
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
      state.brand = [];
      state.distributor = [];
      state.itemType = [];
      state.favItems = [];
      state.groupBy = null;
      state.month = [];
      state.orderType = null;
      state.poNum = null;
      state.program = [];
      state.sequenceNum = null;
      state.itemDesc = null;
      state.rfqNum = null;
      state.ruleType = null;
      state.status = null;
      state.supplier = [];
      state.tag = [];
      state.territory = [];
      state.type = null;
      state.user = [];
      state.userName = null;
      state.sortOrder = null;
      state.sortOrderBy = null;
      state.sortProgramsBy = null;
      state.chipList = [];
      state.clearFilters = false;
      state.retainFilters = false;
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
    setRetain(state, action) {
      const { value } = action.payload;
      state.retainFilters = value;
    },
    setSorted(state) {
      state.sorted = !state.sorted;
    },
    setFetchCurrent(state) {
      state.fetchCurrent = !state.fetchCurrent;
    },
    resetFilters(state) {
      state.fromDate = null;
      state.toDate = null;
      state.bu = [];
      state.brand = [];
      state.distributor = [];
      state.groupBy = null;
      state.itemType = [];
      state.favItems = [];
      state.month = [];
      state.orderType = null;
      state.poNum = null;
      state.program = [];
      state.sequenceNum = null;
      state.itemDesc = null;
      state.supplier = [];
      state.rfqNum = null;
      state.ruleType = [];
      state.status = null;
      state.tag = [];
      state.territory = [];
      state.type = null;
      state.user = [];
      state.userName = null;
      state.sortOrder = null;
      state.sortOrderBy = null;
      state.sortProgramsBy = null;
      state.chipList = [];
      state.clearFilters = false;
      state.retainFilters = false;
    },
    setChips(state, action) {
      const { filterType } = action.payload;
      let chippable;
      if (filterType.includes("item-")) {
        chippable = [
          "bu",
          "brand",
          "itemType",
          "favItems",
          "program",
          "sequenceNum",
          "itemDesc",
        ];
      }
      if (
        filterType.includes("history") ||
        filterType === "rfq" ||
        filterType === "po"
      ) {
        chippable = [
          "bu",
          "brand",
          "distributor",
          "itemType",
          "program",
          "sequenceNum",
          "user",
          "rfqNum",
          "poNum",
          "supplier",
        ];
      }
      if (filterType === "program") {
        chippable = ["month", "brand", "bu"];
      }
      if (filterType.includes("itemRollup")) {
        chippable = ["brand", "program", "itemType", "sequenceNum"];
      }
      if (filterType.includes("compliance")) {
        chippable = [
          "brand",
          "program",
          "itemType",
          "tag",
          "sequenceNum",
        ];
      }
      if (filterType.includes("budget")) {
        chippable = ["brand", "user", "territory"];
      }
      if (filterType === "user-settings") {
        chippable = ["user"];
      }
      let filters = [];
      let stateObject = { ...state };
      for (let filter in stateObject) {
        if (chippable.includes(filter)) {
          if (filter === "month") {
            stateObject[filter].forEach((f) =>
              filters.push({ type: filter, value: f })
            );
          } else if (
            filter === "program" ||
            filter === "itemType" ||
            filter === "brand" ||
            filter === "user" ||
            filter === "distributor" ||
            filter === "territory" ||
            filter === "tag" ||
            filter === "supplier" ||
            filter === "bu"
          ) {
            stateObject[filter].forEach((f) => {
              filters.push({ type: filter, value: f.name });
            });
          } else if (filter === "favItems") {
            if (stateObject[filter].length > 0) {
              filters.push({ type: filter, value: "Favorite Items" });
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
  setRetain,
  setClear,
  setFetchCurrent,
  resetFilters,
  setChips,
} = filterSlice.actions;

export default filterSlice.reducer;
