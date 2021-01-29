import { createSlice } from "@reduxjs/toolkit";
import { fetchAllRules, fetchNextRules } from "../../api/complianceApi";
import { mapRules } from "../apiMaps";
import { setError } from "./errorSlice";

let initialState = {
  isLoading: false,
  isNextLoading: false,
  rulesPerPage: 20,
  nextPage: null,
  nextLink: null,
  rules: [],
  error: null,
};

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
  },
});

export const {
  setIsLoading,
  setNextIsLoading,
  getRulesSuccess,
  getNextRulesSuccess,
  resetComplianceRules,
  setFailure,
} = complianceRulesSlice.actions;

export default complianceRulesSlice.reducer;

export const fetchFilteredRules = (filterObject) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    let rules = await fetchAllRules(filterObject);
    if (rules.error) {
      throw rules.error;
    }
    const mappedRules = mapRules(rules.data.rules);
    dispatch(
      getRulesSuccess({
        rules: mappedRules,
        nextLink: rules.data.nextLink ? rules.data.nextLink : null,
      })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(setError({ error: err.toString() }));
  }
};

export const fetchNextFilteredRules = (url) => async (dispatch) => {
  try {
    dispatch(setNextIsLoading());
    let rules = await fetchNextRules(url);
    if (rules.error) {
      throw rules.error;
    }
    const mappedRules = mapRules(rules.data.rules);
    dispatch(
      getNextRulesSuccess({
        rules: mappedRules,
        nextLink: rules.data.nextLink ? rules.data.nextLink : null,
      })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(setError({ error: err.toString() }));
  }
};
