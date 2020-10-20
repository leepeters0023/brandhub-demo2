import { createSlice } from "@reduxjs/toolkit";
import {
  fetchProgramsByTerritory,
  fetchNationalPrograms,
  fetchProgramItems,
  fetchProgramsByName,
} from "../../api/programApi";
import { mapPrograms } from "../../utility/utilityFunctions";

let initialState = {
  isLoading: false,
  listIsLoading: false,
  itemsIsLoading: false,
  programs: [],
  programList: [],
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
      if (state.programs.length === 0) {
        state.programs = [...programs];
        state.initialLoading = false;
      } else {
        const currentPrograms = [...state.programs];
        const natPrograms = currentPrograms.filter(
          (prog) => prog.type === "national"
        );
        const newProgramArray = programs.concat(natPrograms);
        newProgramArray.sort((a, b) => {
          return a.name.toLowerCase()[0] < b.name.toLowerCase()[0]
            ? -1
            : a.name.toLowerCase()[0] > b.name.toLowerCase()[0]
            ? 1
            : 0;
        });
        state.programs = [...newProgramArray];
      }
      state.isLoading = false;
      state.error = null;
    },
    getProgramItemsSuccess(state, action) {
      const { program, items } = action.payload;
      let progItems = items.map((item) => ({
        id: item.id,
        itemNumber: item["item-number"],
        brand: item.brands.map((brand) => brand.name).join(", "),
        itemType: item.type,
        estCost: item["estimated-cost"],
        packSize: item["qty-per-pack"],
        imgUrl: item["img-url"],
      }));

      let updatedPrograms = state.programs.map((prog) => {
        if (prog.id === program) {
          return {
            ...prog,
            items: [...progItems],
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
    clearPrograms(state) {
      state.isLoading = false;
      state.listIsLoading = false;
      state.itemsIsLoading = false;
      state.programs = [];
      state.programList = [];
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
  clearPrograms,
  clearProgramList,
  setFailure,
} = programsSlice.actions;

export default programsSlice.reducer;

export const fetchInitialPrograms = (id) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    let terrPrograms;
    if (id) {
      terrPrograms = await fetchProgramsByTerritory(id);
      if (terrPrograms.error) {
        throw terrPrograms.error;
      }
    } else terrPrograms = { data: [] };
    const natPrograms = await fetchNationalPrograms();
    if (natPrograms.error) {
      throw natPrograms.error;
    }
    const programs = terrPrograms.data.concat(natPrograms.data);
    const programArray = mapPrograms(programs);
    dispatch(getProgramsSuccess({ programs: programArray }));
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const fetchPrograms = (id) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const programs = await fetchProgramsByTerritory(id);
    if (programs.error) {
      throw programs.error;
    }
    if (programs.length === 0) {
      dispatch(getProgramsSuccess({ programs: [] }));
    }
    const programArray = mapPrograms(programs.data);
    dispatch(getProgramsSuccess({ programs: programArray }));
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const fetchItems = (id) => async (dispatch) => {
  try {
    dispatch(setItemsIsLoading());
    const items = await fetchProgramItems(id);
    if (items.error) {
      throw items.error;
    }
    dispatch(getProgramItemsSuccess({ program: id, items: items.data }));
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
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
  }
};
