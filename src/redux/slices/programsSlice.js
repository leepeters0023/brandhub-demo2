import { createSlice } from "@reduxjs/toolkit";
import { fetchProgramsByTerritory, fetchNationalPrograms } from "../../api/programApi";

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
}

const startLoading = (state) => {
  state.isLoading = true;
}

const loadingFailed = (state, action) => {
  const { error } = action.payload;
  state.isLoading = false;
  state.error = error;
}

const programsSlice = createSlice({
  name: "programs",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    getProgramsSuccess(state, action) {
      const {programs} = action.payload
      if (state.programs.length === 0) {
        const programArray = programs.map((prog) => ({
          id: prog.id,
          type: prog.type,
          name: prog.name,
          brand: prog.brand,
          unit: prog.unit,
          desc: prog.desc,
          goals: prog.goals,
          strategies: prog.strategies,
          focusMonth: prog.focusMonth,
          imgUrl: prog.imgUrl,
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
          isComplete: prog.isComplete
        }))
        programArray.sort((a, b) => {
          return a.name.toLowerCase()[0] < b.name.toLowerCase()[0]
          ? -1
          : a.name.toLowerCase()[0] > b.name.toLowerCase()[0]
          ? 1
          : 0;
        });
        state.programs = [...programArray]
        state.initialLoading = false;
      } else {
        const currentPrograms = [...state.programs];
        const natPrograms = currentPrograms.filter(prog => prog.type === "national");
        const programArray = programs.map((prog) => ({
          id: prog.id,
          type: prog.type,
          name: prog.name,
          brand: prog.brand,
          unit: prog.unit,
          desc: prog.desc,
          goals: prog.goals,
          strategies: prog.strategies,
          focusMonth: prog.focusMonth,
          imgUrl: prog.imgUrl,
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
          isComplete: prog.isComplete
        }))
        const newProgramArray = programArray.concat(natPrograms);
        newProgramArray.sort((a, b) => {
          return a.name.toLowerCase()[0] < b.name.toLowerCase()[0]
          ? -1
          : a.name.toLowerCase()[0] > b.name.toLowerCase()[0]
          ? 1
          : 0;
        });
        state.programs = [...newProgramArray]
      }
      state.isLoading = false
      state.error = null
    },
    setProgramComplete(state, action) {
      const { program, status } = action.payload;
      let updatedPrograms = state.programs.map((prog) => {
        if (prog.id === program) {
          return {
            ...prog,
            isComplete: status
          }
        } else return prog
      })
      state.programs = updatedPrograms
    },
    clearPrograms(state) {
      state.programs = [];
    },
    setFailure: loadingFailed
  }
})

export const {
  setIsLoading,
  getProgramsSuccess,
  setProgramComplete,
  clearPrograms,
  setFailure
} = programsSlice.actions

export default programsSlice.reducer

export const fetchInitialPrograms = (id) => async dispatch => {
  try {
    dispatch(setIsLoading())
    const terrBrands = {};
    const natBrands = {};
    const terrPrograms = await fetchProgramsByTerritory(id);
    terrPrograms.data.included.forEach((incBrand) => {
      terrBrands[`${incBrand.id}`] = incBrand.attributes.name
    })
    const terrProgramsBrands = terrPrograms.data.data.map((prog) => ({
      id: prog.id,
      type: prog.attributes.type,
      name: `${prog.attributes.name}`,
      brand: prog.relationships.brands.data.map(brand => (terrBrands[brand.id])),
      unit: "Compass",
      desc: "Aute id elit laborum anim reprehenderit commodo veniam aliqua ad sit nulla elit laboris id. Tempor excepteur duis do voluptate aliqua est id Lorem dolore enim mollit minim. Dolor aute labore nulla consectetur labore ullamco nisi exercitation velit aliqua commodo duis fugiat commodo. Deserunt eiusmod dolor esse nostrud ipsum qui proident consequat incididunt nostrud sit laboris tempor. Est est aliquip aliqua eu ad duis velit. Magna sunt do ullamco anim. Exercitation minim cupidatat adipisicing ad occaecat consequat duis cupidatat.",
      goals: prog.attributes.goals,
      strategies: prog.attributes.strategies,
      focusMonth: prog.attributes["focus-month"],
      imgUrl: prog.attributes["img-url"],
      isComplete: false,
      })
    )
    const natPrograms = await fetchNationalPrograms();
    natPrograms.data.included.forEach((incBrand) => {
      natBrands[`${incBrand.id}`] = incBrand.attributes.name
    })
    const natProgramsBrands = natPrograms.data.data.map((prog) => ({
      id: prog.id,
      type: prog.attributes.type,
      name: `${prog.attributes.name}`,
      brand: prog.relationships.brands.data.map(brand => (natBrands[brand.id])),
      unit: "Compass",
      desc: "Aute id elit laborum anim reprehenderit commodo veniam aliqua ad sit nulla elit laboris id. Tempor excepteur duis do voluptate aliqua est id Lorem dolore enim mollit minim. Dolor aute labore nulla consectetur labore ullamco nisi exercitation velit aliqua commodo duis fugiat commodo. Deserunt eiusmod dolor esse nostrud ipsum qui proident consequat incididunt nostrud sit laboris tempor. Est est aliquip aliqua eu ad duis velit. Magna sunt do ullamco anim. Exercitation minim cupidatat adipisicing ad occaecat consequat duis cupidatat.",
      goals: prog.attributes.goals,
      strategies: prog.attributes.strategies,
      focusMonth: prog.attributes["focus-month"],
      imgUrl: prog.attributes["img-url"],
      isComplete: false,
    }))
    const programs = terrProgramsBrands.concat(natProgramsBrands)
    dispatch(getProgramsSuccess({programs: programs}))
  } catch (err) {
    dispatch(setFailure(err.toString()))
  }
}

export const fetchPrograms = (id) => async dispatch => {
  try {
    dispatch(setIsLoading())
    const progBrands = {};
    const programs = await fetchProgramsByTerritory(id);
    if (programs.data.data.length === 0) {
      dispatch(getProgramsSuccess({programs: []}))
    }
    programs.data.included.forEach((incBrand) => {
      progBrands[`${incBrand.id}`] = incBrand.attributes.name
    })
    const programsBrands = programs.data.data.map((prog) => ({
      id: prog.id,
      type: prog.attributes.type,
      name: `${prog.attributes.name}`,
      brand: prog.relationships.brands.data.map(brand => (progBrands[brand.id])),
      unit: "Compass",
      desc: "Aute id elit laborum anim reprehenderit commodo veniam aliqua ad sit nulla elit laboris id. Tempor excepteur duis do voluptate aliqua est id Lorem dolore enim mollit minim. Dolor aute labore nulla consectetur labore ullamco nisi exercitation velit aliqua commodo duis fugiat commodo. Deserunt eiusmod dolor esse nostrud ipsum qui proident consequat incididunt nostrud sit laboris tempor. Est est aliquip aliqua eu ad duis velit. Magna sunt do ullamco anim. Exercitation minim cupidatat adipisicing ad occaecat consequat duis cupidatat.",
      goals: prog.attributes.goals,
      strategies: prog.attributes.strategies,
      focusMonth: prog.attributes["focus-month"],
      imgUrl: prog.attributes["img-url"],
      isComplete: false,
      })
    )
    dispatch(getProgramsSuccess({programs: programsBrands}))
  }
  catch (err) {
    dispatch(setFailure(err.toString()))
  }
}