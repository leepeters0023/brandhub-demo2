import { createSlice } from "@reduxjs/toolkit";
import {
  fetchProgramsByTerritory,
  fetchNationalPrograms,
  fetchProgramItems,
} from "../../api/programApi";
import { brandBULookup } from "../../utility/constants";

/*
* DataFormat:
programs: {
  initialLoading: bool,
  isLoading: bool,
  programs: [...{ programObj }],
  error: null || string
}

programObj: {
  id: string,
  type: string,
  name: string,
  brand: string,
  bu: string,
  desc: string,
  goals: string,
  strategies: string,
  focusMonth: string,
  imgUrl: string,
  items: [...{ itemObj }], 
  isComplete: bool,
}

itemObj: {
  itemNumber: string,
  brand: string,
  itemType: string,
  price: float,
  qty: string,
  imgUrl: string
}

*/

let initialState = {
  isLoading: false,
  itemsIsLoading: false,
  programs: [],
  error: null,
};

const startLoading = (state) => {
  state.isLoading = true;
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
    getProgramsSuccess(state, action) {
      const { programs } = action.payload;
      if (state.programs.length === 0) {
        const programArray = programs.map((prog) => ({
          id: prog.id,
          type: prog.type,
          name: prog.name,
          brand:
            prog.brands.length > 0
              ? prog.brands.map((brand) => brand.name)
              : ["BRAND"],
          unit: brandBULookup[prog.brands[0].name] || "UNIT",
          desc:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fringilla arcu vitae nunc rhoncus, condimentum auctor tellus ullamcorper. Nullam felis enim, hendrerit nec egestas non, convallis quis orci. Ut non maximus risus, in tempus felis. Morbi euismod blandit bibendum. Suspendisse pulvinar elit porta imperdiet porta. Pellentesque eu rhoncus lectus. Morbi ultrices molestie nisi id ultrices.",
          goals: prog.goals,
          strategies: prog.strategies,
          focusMonth: prog["focus-month"],
          imgUrl: prog["img-url"],
          items: [],
          status: false,
        }));
        programArray.sort((a, b) => {
          return a.name.toLowerCase()[0] < b.name.toLowerCase()[0]
            ? -1
            : a.name.toLowerCase()[0] > b.name.toLowerCase()[0]
            ? 1
            : 0;
        });
        state.programs = [...programArray];
        state.initialLoading = false;
      } else {
        const currentPrograms = [...state.programs];
        const natPrograms = currentPrograms.filter(
          (prog) => prog.type === "national"
        );
        const programArray = programs.map((prog) => ({
          id: prog.id,
          type: prog.type,
          name: prog.name,
          brand:
            prog.brands.length > 0
              ? prog.brands.map((brand) => brand.name)
              : ["BRAND"],
          unit: brandBULookup[prog.brands[0].name] || "UNIT",
          desc:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fringilla arcu vitae nunc rhoncus, condimentum auctor tellus ullamcorper. Nullam felis enim, hendrerit nec egestas non, convallis quis orci. Ut non maximus risus, in tempus felis. Morbi euismod blandit bibendum. Suspendisse pulvinar elit porta imperdiet porta. Pellentesque eu rhoncus lectus. Morbi ultrices molestie nisi id ultrices.",
          goals: prog.goals,
          strategies: prog.strategies,
          focusMonth: prog["focus-month"],
          imgUrl: prog["img-url"],
          items: [],
          status: false,
        }));
        const newProgramArray = programArray.concat(natPrograms);
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
        brand: item.brand.name,
        itemType: item.name,
        price: item.price,
        qty: `${item["qty-per-pack"]} / pack`,
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
      state.programs = [];
      state.isLoading = false;
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  setItemsIsLoading,
  getProgramsSuccess,
  getProgramItemsSuccess,
  setProgramStatus,
  clearPrograms,
  setFailure,
} = programsSlice.actions;

export default programsSlice.reducer;

export const fetchInitialPrograms = (id) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const terrPrograms = await fetchProgramsByTerritory(id);
    if (terrPrograms.error) {
      throw terrPrograms.error
    }
    const natPrograms = await fetchNationalPrograms();
    if (natPrograms.error) {
      throw natPrograms.error
    }
    const programs = terrPrograms.data.concat(natPrograms.data);
    dispatch(getProgramsSuccess({ programs: programs }));
  } catch (err) {
    dispatch(setFailure({error: err.toString()}));
  }
};

export const fetchPrograms = (id) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const programs = await fetchProgramsByTerritory(id);
    if (programs.error) {
      throw programs.error
    }
    if (programs.length === 0) {
      dispatch(getProgramsSuccess({ programs: [] }));
    }
    dispatch(getProgramsSuccess({ programs: programs.data }));
  } catch (err) {
    dispatch(setFailure({error: err.toString()}));
  }
};

export const fetchItems = (id) => async (dispatch) => {
  try {
    dispatch(setItemsIsLoading());
    const items = await fetchProgramItems(id);
    if (items.error) {
      throw items.error
    }
    dispatch(getProgramItemsSuccess({ program: id, items: items.data }));
  } catch (err) {
    dispatch(setFailure({error: err.toString()}));
  }
};
