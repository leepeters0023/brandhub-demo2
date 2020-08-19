import { createSlice } from "@reduxjs/toolkit";

/*
* DataFormat
user: {
  firstName: string,
  lastName: string,
  email: string,
  roles: [ ...array of permissions as strings ],
  territories: [ ...array of regions and key accounts assigned to user ],
}
*/

let initialState = {
  firstName: "",
  lastName: "",
  email: "",
  roles: [],
  territories: [],
}

const startLoading = (state) => {
  state.isLoading = true;
}

const loadingFailed = (state, action) => {
  const { error } = action.payload;
  state.isLoading = false;
  state.error = error;
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    getUserSuccess(state, action) {
      const { user: { firstName, lastName, email, roles, territories}} = action.payload;
      state.firstName = firstName
      state.lastName = lastName
      state.email = email
      state.roles = [...roles]
      state.territories = [...territories]
    },
    setFailure: loadingFailed
  }
})

export const {
  setIsLoading,
  getUserSuccess,
  setFailure,
} = userSlice.actions

export default userSlice.reducer

// export const fetchUser = (email, password) => async dispatch => {
//   try {
//     dispatch(setIsLoading())
//     const user = await getUser(email, password)
//     dispatch(getUserSuccess(user))
//   } catch (err) {
//     dispatch(setFailure({error: err.toString()}))
//   }
// }