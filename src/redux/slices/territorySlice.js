import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllTerritories,
  fetchFilteredTerritories,
  fetchAllStates,
  fetchFilteredStates,
  fetchCompliantStates,
  createTerritory,
  updateTerritory,
} from "../../api/territoryApi";
import {
  setIsLoading as patchLoading,
  patchSuccess,
  setFailure as patchFailure,
} from "./patchOrderSlice";
import { setError } from "./errorSlice";
import { sortTerritories } from "../apiMaps";

let initialState = {
  isLoading: false,
  isUpdateLoading: false,
  isStatesLoading: false,
  territoryList: [],
  filteredTerritoryList: [],
  stateList: [],
  filteredStateList: [],
  compliantStateList: [],
  updateStatus: false,
  error: null,
};

const startLoading = (state) => {
  state.isLoading = true;
};

const startUpdateLoading = (state) => {
  state.isUpdateLoading = true;
};

const startStatesLoading = (state) => {
  state.isStatesLoading = true;
};

const loadingFailed = (state, action) => {
  const { error } = action.payload;
  state.isLoading = false;
  state.isStatesLoading = false;
  state.isUpdateLoading = false;
  state.error = error;
};

const territorySlice = createSlice({
  name: "territories",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    setUpdateLoading: startUpdateLoading,
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
    getCompliantStatesSuccess(state, action) {
      const { states } = action.payload;
      state.compliantStateList = states;
      state.isStatesLoading = false;
      state.error = null;
    },
    updateTerritorySuccess(state, action) {
      const { id, territory } = action.payload;
      const updatedTerritories = state.territoryList.map((terr) => {
        if (terr.id === id) {
          return territory;
        } else return { ...terr };
      });
      state.territoryList = updatedTerritories;
      state.isUpdateLoading = false;
      state.updateStatus = true;
      state.error = null;
    },
    addTerritorySuccess(state) {
      state.isUpdateLoading = false;
      state.updateStatus = true;
      state.error = null;
    },
    setUpdateSuccess(state, action) {
      const { updateStatus } = action.payload;
      state.updateStatus = updateStatus;
    },
    clearFilteredStates(state) {
      state.filteredStateList = [];
    },
    clearTerritories(state) {
      state.isLoading = false;
      state.isUpdateLoading = false;
      state.isStatesLoading = false;
      state.territoryList = [];
      state.filteredTerritoryList = [];
      state.stateList = [];
      state.filteredStateList = [];
      state.compliantStateList = [];
      state.updateStatus = false;
      state.error = null;
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  setUpdateLoading,
  setStatesLoading,
  getTerritoriesSuccess,
  getAllTerritoriesSuccess,
  getStatesSuccess,
  getAllStatesSuccess,
  getCompliantStatesSuccess,
  updateTerritorySuccess,
  addTerritorySuccess,
  setUpdateSuccess,
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
    const sortedTerritories = sortTerritories(territories.data);
    dispatch(getAllTerritoriesSuccess({ territories: sortedTerritories }));
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

export const fetchAllCompliantStates = (id) => async (dispatch) => {
  try {
    dispatch(setStatesLoading());
    const states = await fetchCompliantStates(id);
    if (states.error) {
      throw states.error;
    }
    dispatch(getCompliantStatesSuccess({ states: states.data }));
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(setError({ error: err.toString() }));
  }
};

export const updateTerritoryById = (name, states, id) => async (dispatch) => {
  try {
    dispatch(patchLoading());
    dispatch(setUpdateLoading());
    const territory = await updateTerritory(name, states, id);
    if (territory.error) {
      throw territory.error;
    }
    const formattedTerritory = sortTerritories([territory.data]);
    dispatch(updateTerritorySuccess({ id: id, territory: formattedTerritory[0] }));
    dispatch(patchSuccess());
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(patchFailure({ error: err.toString() }));
    dispatch(setError({ error: err.toString() }));
  }
};

export const addNewTerritory = (
  name,
  states,
  externalId,
  type
) => async (dispatch) => {
  try {
    dispatch(patchLoading());
    dispatch(setUpdateLoading());
    const territory = await createTerritory(name, states, externalId, type);
    if (territory.error) {
      throw territory.error;
    }
    const territories = await fetchAllTerritories();
    if (territories.error) {
      throw territories.error;
    }
    const sortedTerritories = sortTerritories(territories.data);
    dispatch(getAllTerritoriesSuccess({ territories: sortedTerritories }));
    dispatch(addTerritorySuccess());
    dispatch(patchSuccess());
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(patchFailure({ error: err.toString() }));
    dispatch(setError({ error: err.toString() }));
  }
};
