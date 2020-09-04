import { createSlice } from "@reduxjs/toolkit";
import {
  fetchProgramsByTerritory,
  fetchNationalPrograms,
} from "../../api/programApi";

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
  programs: [],
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

const programsSlice = createSlice({
  name: "programs",
  initialState,
  reducers: {
    setIsLoading: startLoading,
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
          unit: "Compass",
          desc:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fringilla arcu vitae nunc rhoncus, condimentum auctor tellus ullamcorper. Nullam felis enim, hendrerit nec egestas non, convallis quis orci. Ut non maximus risus, in tempus felis. Morbi euismod blandit bibendum. Suspendisse pulvinar elit porta imperdiet porta. Pellentesque eu rhoncus lectus. Morbi ultrices molestie nisi id ultrices.",
          goals: prog.goals,
          strategies: prog.strategies,
          focusMonth: prog["focus-month"],
          imgUrl: prog["img-url"],
          items: [
            {
              itemNumber: "110009456",
              brand: "New Amsterdam",
              itemType: "Glorifier",
              price: 5.5,
              qty: "5 / Pack",
              imgUrl:
                "https://res.cloudinary.com/joshdowns-dev/image/upload/v1595013432/Select/bh_newamsterdam_glorifier_g7orb2.jpg",
            },
            {
              itemNumber: "110234066",
              brand: "New Amsterdam",
              itemType: "Glorifier",
              price: 5.5,
              qty: "5 / Pack",
              imgUrl:
                "https://res.cloudinary.com/joshdowns-dev/image/upload/v1595013432/Select/bh_newamsterdam_glorifier_g7orb2.jpg",
            },
            {
              itemNumber: "110346066",
              brand: "New Amsterdam",
              itemType: "Glorifier",
              price: 5.5,
              qty: "5 / Pack",
              imgUrl:
                "https://res.cloudinary.com/joshdowns-dev/image/upload/v1595013432/Select/bh_newamsterdam_glorifier_g7orb2.jpg",
            },
            {
              itemNumber: "110006246",
              brand: "New Amsterdam",
              itemType: "Glorifier",
              price: 5.5,
              qty: "5 / Pack",
              imgUrl:
                "https://res.cloudinary.com/joshdowns-dev/image/upload/v1595013432/Select/bh_newamsterdam_glorifier_g7orb2.jpg",
            },
            {
              itemNumber: "123009066",
              brand: "New Amsterdam",
              itemType: "Glorifier",
              price: 5.5,
              qty: "5 / Pack",
              imgUrl:
                "https://res.cloudinary.com/joshdowns-dev/image/upload/v1595013432/Select/bh_newamsterdam_glorifier_g7orb2.jpg",
            },
            {
              itemNumber: "110234666",
              brand: "New Amsterdam",
              itemType: "Glorifier",
              price: 5.5,
              qty: "5 / Pack",
              imgUrl:
                "https://res.cloudinary.com/joshdowns-dev/image/upload/v1595013432/Select/bh_newamsterdam_glorifier_g7orb2.jpg",
            },
            {
              itemNumber: "112369066",
              brand: "New Amsterdam",
              itemType: "Glorifier",
              price: 5.5,
              qty: "5 / Pack",
              imgUrl:
                "https://res.cloudinary.com/joshdowns-dev/image/upload/v1595013432/Select/bh_newamsterdam_glorifier_g7orb2.jpg",
            },
          ],
          isComplete: false,
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
          unit: "Compass",
          desc:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fringilla arcu vitae nunc rhoncus, condimentum auctor tellus ullamcorper. Nullam felis enim, hendrerit nec egestas non, convallis quis orci. Ut non maximus risus, in tempus felis. Morbi euismod blandit bibendum. Suspendisse pulvinar elit porta imperdiet porta. Pellentesque eu rhoncus lectus. Morbi ultrices molestie nisi id ultrices.",
          goals: prog.goals,
          strategies: prog.strategies,
          focusMonth: prog["focus-month"],
          imgUrl: prog["img-url"],
          items: [
            {
              itemNumber: "110009456",
              brand: "New Amsterdam",
              itemType: "Glorifier",
              price: 5.5,
              qty: "5 / Pack",
              imgUrl:
                "https://res.cloudinary.com/joshdowns-dev/image/upload/v1595013432/Select/bh_newamsterdam_glorifier_g7orb2.jpg",
            },
            {
              itemNumber: "110234066",
              brand: "New Amsterdam",
              itemType: "Glorifier",
              price: 5.5,
              qty: "5 / Pack",
              imgUrl:
                "https://res.cloudinary.com/joshdowns-dev/image/upload/v1595013432/Select/bh_newamsterdam_glorifier_g7orb2.jpg",
            },
            {
              itemNumber: "110346066",
              brand: "New Amsterdam",
              itemType: "Glorifier",
              price: 5.5,
              qty: "5 / Pack",
              imgUrl:
                "https://res.cloudinary.com/joshdowns-dev/image/upload/v1595013432/Select/bh_newamsterdam_glorifier_g7orb2.jpg",
            },
            {
              itemNumber: "110006246",
              brand: "New Amsterdam",
              itemType: "Glorifier",
              price: 5.5,
              qty: "5 / Pack",
              imgUrl:
                "https://res.cloudinary.com/joshdowns-dev/image/upload/v1595013432/Select/bh_newamsterdam_glorifier_g7orb2.jpg",
            },
            {
              itemNumber: "123009066",
              brand: "New Amsterdam",
              itemType: "Glorifier",
              price: 5.5,
              qty: "5 / Pack",
              imgUrl:
                "https://res.cloudinary.com/joshdowns-dev/image/upload/v1595013432/Select/bh_newamsterdam_glorifier_g7orb2.jpg",
            },
            {
              itemNumber: "110234666",
              brand: "New Amsterdam",
              itemType: "Glorifier",
              price: 5.5,
              qty: "5 / Pack",
              imgUrl:
                "https://res.cloudinary.com/joshdowns-dev/image/upload/v1595013432/Select/bh_newamsterdam_glorifier_g7orb2.jpg",
            },
            {
              itemNumber: "112369066",
              brand: "New Amsterdam",
              itemType: "Glorifier",
              price: 5.5,
              qty: "5 / Pack",
              imgUrl:
                "https://res.cloudinary.com/joshdowns-dev/image/upload/v1595013432/Select/bh_newamsterdam_glorifier_g7orb2.jpg",
            },
          ],
          isComplete: false,
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
    setProgramComplete(state, action) {
      const { program, status } = action.payload;
      let updatedPrograms = state.programs.map((prog) => {
        if (prog.id === program) {
          return {
            ...prog,
            isComplete: status,
          };
        } else return prog;
      });
      state.programs = updatedPrograms;
    },
    clearPrograms(state) {
      state.programs = [];
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  getProgramsSuccess,
  setProgramComplete,
  clearPrograms,
  setFailure,
} = programsSlice.actions;

export default programsSlice.reducer;

export const fetchInitialPrograms = (id) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const terrPrograms = await fetchProgramsByTerritory(id);
    const natPrograms = await fetchNationalPrograms();
    const programs = terrPrograms.data.concat(natPrograms.data);
    dispatch(getProgramsSuccess({ programs: programs }));
  } catch (err) {
    dispatch(setFailure(err.toString()));
  }
};

export const fetchPrograms = (id) => async (dispatch) => {
  try {
    dispatch(setIsLoading());

    const programs = await fetchProgramsByTerritory(id);
    if (programs.length === 0) {
      dispatch(getProgramsSuccess({ programs: [] }));
    }

    dispatch(getProgramsSuccess({ programs: programs.data }));
  } catch (err) {
    dispatch(setFailure(err.toString()));
  }
};
