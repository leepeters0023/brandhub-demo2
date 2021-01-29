import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllTerritories,
  fetchFilteredTerritories,
  fetchAllStates,
  fetchFilteredStates,
} from "../../api/territoryApi";
import { setError } from "./errorSlice";

let initialState = {
  isLoading: false,
  isStatesLoading: false,
  territoryList: [],
  filteredTerritoryList: [],
  stateList: [],
  filteredStateList: [],
  error: null,
};

const startLoading = (state) => {
  state.isLoading = true;
};

const startStatesLoading = (state) => {
  state.isStatesLoading = true;
};

const loadingFailed = (state, action) => {
  const { error } = action.payload;
  state.isLoading = false;
  state.isStatesLoading = false;
  state.error = error;
};

const territorySlice = createSlice({
  name: "territories",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    setStatesLoading: startStatesLoading,
    getTerritoriesSuccess(state, action) {
      const { territories } = action.payload;
      state.filteredTerritoryList = territories;
      state.isLoading = false;
      state.error = null;
    },
    getAllTerritoriesSuccess(state, action) {
      const { territories } = action.payload;
      state.territoryList = territories;
      state.isLoading = false;
      state.error = null;
    },
    getStatesSuccess(state, action) {
      const { states } = action.payload;
      state.filteredStateList = states;
      state.isStatesLoading = false;
      state.error = null;
    },
    getAllStatesSuccess(state, action) {
      const { states } = action.payload;
      state.stateList = states;
      state.isStatesLoading = false;
      state.error = null;
    },
    clearFilteredStates(state) {
      state.filteredStateList = [];
    },
    clearTerritories(state) {
      state.isLoading = false;
      state.territoryList = [];
      state.filteredTerritoryList = [];
      state.stateList = [];
      state.filteredStateList = [];
      state.error = null;
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  setStatesLoading,
  getTerritoriesSuccess,
  getAllTerritoriesSuccess,
  getStatesSuccess,
  getAllStatesSuccess,
  clearFilteredStates,
  clearTerritories,
  setFailure,
} = territorySlice.actions;

export default territorySlice.reducer;

export const fetchTerritories = () => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    let territories = await fetchAllTerritories();
    if (territories.error) {
      throw territories.error;
    }
    dispatch(getAllTerritoriesSuccess({ territories: territories.data }));
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(setError({ error: err.toString() }));
  }
};

export const fetchTerritoriesByName = (name) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    let territories = await fetchFilteredTerritories(name);
    if (territories.error) {
      throw territories.error;
    }
    dispatch(getTerritoriesSuccess({ territories: territories.data }));
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(setError({ error: err.toString() }));
  }
};

export const fetchStates = () => async (dispatch) => {
  try {
    dispatch(setStatesLoading());
    const states = await fetchAllStates();
    if (states.error) {
      throw states.error;
    }
    const sortedStates = states.data.sort((a, b) => {
      return a.code.toLowerCase()[0] < b.code.toLowerCase()[0]
        ? -1
        : a.code.toLowerCase()[0] > b.code.toLowerCase()[0]
        ? 1
        : 0;
    });
    dispatch(getAllStatesSuccess({ states: sortedStates }));
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(setError({ error: err.toString() }));
  }
};

export const fetchStatesByIds = (ids) => async (dispatch) => {
  try {
    dispatch(setStatesLoading());
    const states = await fetchFilteredStates(ids);
    if (states.error) {
      throw states.error;
    }
    const sortedStates = states.data.sort((a, b) => {
      return a.code.toLowerCase()[0] < b.code.toLowerCase()[0]
        ? -1
        : a.code.toLowerCase()[0] > b.code.toLowerCase()[0]
        ? 1
        : 0;
    });
    dispatch(getStatesSuccess({ states: sortedStates }));
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(setError({ error: err.toString() }));
  }
};
