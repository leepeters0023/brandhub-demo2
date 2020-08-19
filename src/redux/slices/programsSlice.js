import { createSlice } from "@reduxjs/toolkit";

/*
* DataFormat
programs: {
  isLoading: bool,
  programs: [...{ programObj }],
  error: null || string
}

programObj: {
  id: string,
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
      const programArray = [...programs];
      programArray.sort((a, b) => {
        return a.name.toLowerCase()[0] < b.name.toLowerCase()[0]
          ? -1
          : a.name.toLowerCase()[0] > b.name.toLowerCase()[0]
          ? 1
          : 0;
      });
      state.programs = [...programArray]
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
    setFailure: loadingFailed
  }
})

export const {
  setIsLoading,
  getProgramsSuccess,
  setProgramComplete,
  setFailure
} = programsSlice.actions

export default programsSlice.reducer

// export const fetchPrograms = (user) => async dispatch => {
//   try {
//     dispatch(setIsLoading())
//     const programs = await getProgramsSuccess(user)
//     dispatch(getProgramsSuccess({programs}))
//   } catch (err) {
//     dispatch(setFailure(err.toString()))
//   }
// }