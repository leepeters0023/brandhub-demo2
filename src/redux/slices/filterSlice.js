import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  fromDate: null,
  toDate: null,
  bu: [],
  brand: [],
  distributor: [],
  groupBy: null,
  itemType: [],
  month: [],
  orderType: null,
  poNum: null,
  program: [],
  rfqNum: null,
  ruleType: [],
  sequenceNum: null,
  status: null,
  supplier: [],
  tag: null,
  territory: null,
  user: [],
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
      state.brand = [];
      state.distributor = [];
      state.itemType = [];
      state.groupBy = null;
      state.month = [];
      state.orderType = null;
      state.poNum = null;
      state.program = null;
      state.sequenceNum = null;
      state.rfqNum = null;
      state.ruleType = [];
      state.status = null;
      state.supplier = [];
      state.tag = null;
      state.territory = null;
      state.user = [];
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
      state.sorted = !state.sorted;
    },
    resetFilters(state) {
      state.fromDate = null;
      state.toDate = null;
      state.bu = [];
      state.brand = [];
      state.distributor = [];
      state.groupBy = null;
      state.itemType = [];
      state.month = [];
      state.orderType = null;
      state.poNum = null;
      state.program = null;
      state.sequenceNum = null;
      state.supplier = [];
      state.rfqNum = null;
      state.ruleType = [];
      state.status = null;
      state.tag = null;
      state.territory = null;
      state.user = [];
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
        chippable = ["bu", "brand", "itemType"];
      }
      if (filterType.includes("history")) {
        chippable = [
          "fromDate",
          "toDate",
          "bu",
          "brand",
          "distributor",
          "itemType",
          "program",
          "sequenceNum",
          "status",
          "user",
          "rfqNum",
          "poNum", 
        ];
      }
      if (filterType === "program") {
        chippable = ["month", "brand", "bu"];
      }
      if (filterType === "itemRollup") {
        chippable = ["brand", "program", "itemType", "sequenceNum"];
      }
      if (filterType.includes("compliance")) {
        chippable = ["brand", "program", "itemyType", "tag", "ruleType", "sequenceNum", "status"]
      }
      if (filterType.includes("budget")) {
        chippable = ["brand", "user", "territory"]
      }
      let filters = [];
      let stateObject = { ...state };
      for (let filter in stateObject) {
        if (chippable.includes(filter)) {
          if (filter === "bu" || filter === "month" || filter === "ruleType" || filter === "supplier") {
            stateObject[filter].forEach((f) =>
              filters.push({ type: filter, value: f })
            );
          } else if (
            filter === "program" ||
            filter === "itemType" ||
            filter === "brand" ||
            filter === "user" ||
            filter === "distributor"
          ) {
            stateObject[filter].forEach((f) => {
              filters.push({type: filter, value: f.name})
            })
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
