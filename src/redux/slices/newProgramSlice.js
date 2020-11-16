import { createSlice } from "@reduxjs/toolkit";
import addDays from "date-fns/addDays";
import format from "date-fns/format";

/*
* New Program Model
TODO
*/

let initialState = {
  isLoading: false,
  name: "",
  orderStartDate: null,
  orderEndDate: null,
  inMarketStartDate: null,
  inMarketEndDate: null,
  territories: [],
  items: [],
  inDraft: false,
  error: null,
};

const startLoading = (state) => {
  state.isLoading = true;
};

const loadingFailed = (state, action) => {
  const { error } = action.payload;
  state.isLoading = false;
  state.error = error;
};

const newProgramSlice = createSlice({
  name: "newProgram",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    startNewProgram(state) {
      state.inDraft = true;
      state.orderStartDate = format(new Date(), "MM/dd/yyyy");
      state.orderEndDate = format(addDays(new Date(), 30), "MM/dd/yyyy");
      state.inMarketStartDate = format(addDays(new Date(), 30), "MM/dd/yyyy");
      state.inMarketEndDate = format(addDays(new Date(), 120), "MM/dd/yyyy")
    },
    updateName(state, action) {
      const { name } = action.payload;
      state.name = name;
    },
    updateDate(state, action) {
      const { dateType, value } = action.payload;
      state[dateType] = value;
    },
    updateItems(state, action) {
      const { items } = action.payload;
      state.items = items;
    },
    updateTerritories(state, action) {
      const { territories } = action.payload;
      state.territories = territories;
    },
    resetNewProgram(state) {
      state.isLoading = false;
      state.name = "";
      state.orderStartDate = null;
      state.orderEndDate = null;
      state.inMarketStartDate = null;
      state.inMarketEndDate = null;
      state.territories = [];
      state.selectedItems = [];
      state.items = [];
      state.inDraft = false;
      state.error = null;
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  startNewProgram,
  updateName,
  updateDate,
  updateItems,
  updateTerritories,
  resetNewProgram,
  setFailure,
} = newProgramSlice.actions;

export default newProgramSlice.reducer;

//TODO handle api calls!
