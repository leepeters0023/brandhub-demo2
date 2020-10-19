import { createSlice } from "@reduxjs/toolkit";

/*
* Item Rule Model
notes:

{
  id: string (read);
  active: bool (read/write);
  sequenceNum: string (read);
  program: string (read);
  itemType: string (read);
  ruleType: string (read);
  ruleTags: array (read);
  status: string (read);
  emailRequired: bool (read);
  emailSent: date string (read);
}

*/

let initialState = {
  isLoading: false,
  isNextLoading: false,
  isUpdateLoading: false,
  itemsPerPage: 20,
  nextPage: null,
  nextLink: null,
  items: [],
  error: null,
}

const startLoading = (state) => {
  state.isLoading = true;
};

const startNextLoading = (state) => {
  state.isNextLoading = true;
};

const startUpdateLoading = (state) => {
  state.isUpdateLoading = true;
}

const loadingFailed = (state, action) => {
  const { error } = action.payload;
  state.isLoading = false;
  state.error = error;
};

const complianceItemsSlice = createSlice({
  name: "complianceItems",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    setNextIsLoading: startNextLoading,
    setUpdateLoading: startUpdateLoading,
    getComplianceItemsSuccess(state, action) {
      const { items, nextLink } = action.payload;
      state.nextPage = nextLink ? true : false;
      state.nextLink = nextLink;
      state.items = [...items];
      state.isLoading = false;
      state.error = null;
    },
    getNextComplianceItemsSuccess(state, action) {
      const { items, nextLink } = action.payload;
      state.nextPage = nextLink ? true : false;
      state.nextLink = nextLink;
      state.items = state.items.concat(items);
      state.isNextLoading = false;
      state.error = null;
    },
    resetcomplianceItems(state) {
      state.isLoading = false;
      state.isNextLoading = false;
      state.isUpdateLoading = false;
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
  setUpdateLoading,
  getComplianceItemsSuccess,
  getNextComplianceItemsSuccess,
  resetcomplianceItems,
  setFailure,
} = complianceItemsSlice.actions;

export default complianceItemsSlice.reducer;

//TODO build async thunk calls to api to update rule being active or not