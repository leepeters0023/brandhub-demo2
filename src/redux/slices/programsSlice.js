import { createSlice } from "@reduxjs/toolkit";
import {
  fetchProgramsByTerritory,
  fetchProgramItems,
  fetchProgramsByName,
} from "../../api/programApi";
import { addOrderSetItem } from "../../api/orderApi";
import {
  setIsLoading as patchLoading,
  patchSuccess,
  setFailure as patchFailure,
} from "./patchOrderSlice";
import { startGlobalLoad, stopGlobalLoad } from "./globalLoadSlice";
import { mapPrograms, mapItems } from "../apiMaps";
import { setError } from "./errorSlice";

let initialState = {
  isLoading: false,
  listIsLoading: false,
  itemsIsLoading: false,
  programs: [],
  programList: [],
  currentPreOrderItems: [],
  isPrograms: false,
  error: null,
};

const startLoading = (state) => {
  state.isLoading = true;
};

const startListLoading = (state) => {
  state.listIsLoading = false;
};

const startItemsLoading = (state) => {
  state.itemsIsLoading = true;
};

const loadingFailed = (state, action) => {
  const { error } = action.payload;
  state.isLoading = false;
  state.error = error;
};

const programsSlice = createSlice({
  name: "programs",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    setItemsIsLoading: startItemsLoading,
    setListLoading: startListLoading,
    getProgramsSuccess(state, action) {
      const { programs } = action.payload;
      if (programs.length === 0) {
        state.initialLoading = false;
        state.programs = [];
        state.isPrograms = false;
      } else if (state.programs.length === 0) {
        state.programs = [...programs];
        state.initialLoading = false;
        state.isPrograms = true;
      } else {
        state.programs = [...programs];
        state.isPrograms = true;
      }
      state.isLoading = false;
      state.error = null;
    },
    getProgramItemsSuccess(state, action) {
      const { program, items } = action.payload;
      let updatedPrograms = state.programs.map((prog) => {
        if (prog.id === program) {
          return {
            ...prog,
            items: [...items],
            isItemsFetched: true,
          };
        } else {
          return prog;
        }
      });
      state.programs = updatedPrograms;
      state.itemsIsLoading = false;
      state.error = null;
    },
    getProgramListSuccess(state, action) {
      const { programs } = action.payload;
      state.programList = programs;
      state.listIsLoading = false;
      state.error = null;
    },
    setProgramStatus(state, action) {
      const { program, status } = action.payload;
      let updatedPrograms = state.programs.map((prog) => {
        if (prog.id === program) {
          return {
            ...prog,
            status: status,
          };
        } else return prog;
      });
      state.programs = updatedPrograms;
    },
    addPreOrderItems(state, action) {
      const { ids } = action.payload;
      const newIds = state.currentPreOrderItems.concat(ids);
      state.currentPreOrderItems = newIds;
    },
    deletePreOrderItems(state, action) {
      const { id } = action.payload;
      const newIds = state.currentPreOrderItems.filter((i) => i !== id);
      state.currentPreOrderItems = newIds;
    },
    resetPreOrderItems(state) {
      state.currentPreOrderItems = [];
    },
    clearPrograms(state) {
      state.isLoading = false;
      state.listIsLoading = false;
      state.itemsIsLoading = false;
      state.programs = [];
      state.programList = [];
      state.currentPreOrderItems = [];
      state.isPrograms = false;
      state.error = null;
    },
    clearProgramList(state) {
      state.listIsLoading = false;
      state.programList = [];
      state.error = null;
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  setListLoading,
  setItemsIsLoading,
  getProgramsSuccess,
  getProgramItemsSuccess,
  getProgramListSuccess,
  setProgramStatus,
  addPreOrderItems,
  deletePreOrderItems,
  resetPreOrderItems,
  clearPrograms,
  clearProgramList,
  setFailure,
} = programsSlice.actions;

export default programsSlice.reducer;

export const fetchInitialPrograms = (id, channelBool) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const programs = await fetchProgramsByTerritory(id, channelBool);
    if (programs.error) {
      throw programs.error;
    }
    const programArray = mapPrograms(programs.data);
    dispatch(getProgramsSuccess({ programs: programArray }));
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(setError({ error: err.toString() }));
  }
};

export const fetchPrograms = (id, channelBool) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    dispatch(startGlobalLoad());
    const programs = await fetchProgramsByTerritory(id, channelBool);
    if (programs.error) {
      throw programs.error;
    }
    if (programs.length === 0) {
      dispatch(getProgramsSuccess({ programs: [] }));
    }
    const programArray = mapPrograms(programs.data);
    dispatch(getProgramsSuccess({ programs: programArray }));
    dispatch(stopGlobalLoad());
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(setError({ error: err.toString() }));
    dispatch(stopGlobalLoad());
  }
};

export const fetchItems = (id) => async (dispatch) => {
  try {
    dispatch(setItemsIsLoading());
    dispatch(startGlobalLoad());
    const items = await fetchProgramItems(id);
    if (items.error) {
      throw items.error;
    }
    let mappedItems = mapItems(items.data);
    dispatch(getProgramItemsSuccess({ program: id, items: mappedItems }));
    dispatch(stopGlobalLoad());
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(setError({ error: err.toString() }));
    dispatch(stopGlobalLoad());
  }
};

export const fetchProgramList = (name) => async (dispatch) => {
  try {
    dispatch(setListLoading());
    let programs = await fetchProgramsByName(name);
    if (programs.error) {
      throw programs.error;
    }
    dispatch(getProgramListSuccess({ programs: programs.data }));
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(setError({ error: err.toString() }));
  }
};

export const addItemToPreOrder = (orderId, itemId) => async (dispatch) => {
  try {
    dispatch(patchLoading());
    let orderItemStatus = await addOrderSetItem(orderId, itemId);
    if (orderItemStatus.error) {
      throw orderItemStatus.error;
    }
    dispatch(patchSuccess());
  } catch (err) {
    dispatch(patchFailure({ error: err.toString() }));
  }
};
