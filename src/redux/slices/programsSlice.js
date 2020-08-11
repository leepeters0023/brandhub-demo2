import { createSlice } from "@reduxjs/toolkit";

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
      state.programs = [...programs]
      state.isLoading = false
      state.error = null
    },
    setFailure: loadingFailed
  }
})

export const {
  setIsLoading,
  getProgramsSuccess,
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