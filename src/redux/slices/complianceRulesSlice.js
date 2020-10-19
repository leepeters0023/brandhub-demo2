import { createSlice } from "@reduxjs/toolkit";

/*
* Rule Model

{
  id: string (read),
  ruleType: string (read),
  ruleTags: array (read),
  description: object (read)
    {
      detail: string (read),
      contactName: string (read),
      contactEmail: string (read),
    }
}

*/

let initialState = {
  isLoading: false,
  isNextLoading: false,
  rulesPerPage: 20,
  nextPage: null,
  nextLink: null,
  rules: [],
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

const complianceRulesSlice = createSlice({
  name: "complianceRules",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    setNextIsLoading: startNextLoading,
    getRulesSuccess(state, action) {
      const { rules, nextLink } = action.payload;
      state.nextPage = nextLink ? true : false;
      state.nextLink = nextLink;
      state.rules = [...rules];
      state.isLoading = false;
      state.error = null;
    },
    getNextRulesSuccess(state, action) {
      const { rules, nextLink } = action.payload;
      state.nextPage = nextLink ? true : false;
      state.nextLink = nextLink;
      state.rules = state.rules.concat(rules);
      state.isNextLoading = false;
      state.error = null;
    },
    resetComplianceRules(state) {
      state.isLoading = false;
      state.isNextLoading = false;
      state.rulesPerPage = 20;
      state.nextPage = null;
      state.nextLink = null;
      state.rules = [];
      state.error = null;
    },
    setFailure: loadingFailed,
  }
})

export const {
  setIsLoading,
  setNextIsLoading,
  getRulesSuccess,
  getNextRulesSuccess,
  resetComplianceRules,
  setFailure,
} = complianceRulesSlice.actions;

export default complianceRulesSlice.reducer;