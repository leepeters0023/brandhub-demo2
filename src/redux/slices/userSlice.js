import { createSlice } from "@reduxjs/toolkit";
import { getUser } from "../../api/userApi";

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
  roles: "",
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
      const { user: { firstName, lastName, email, role}} = action.payload;
      state.firstName = firstName
      state.lastName = lastName
      state.email = email
      state.role = role
      state.territories = ["North East", "Walmart"]
    },
    removeUser: (state) => {
      state = { ...initialState}
    },
    setFailure: loadingFailed
  }
})

export const {
  setIsLoading,
  getUserSuccess,
  removeUser,
  setFailure,
} = userSlice.actions

export default userSlice.reducer

export const fetchUser = (email, password) => async dispatch => {
    dispatch(setIsLoading())
    const user = await getUser(email, password)
    if (user.status === "ok") {
      dispatch(getUserSuccess({user: user.data}))
    } else {
      dispatch(setFailure({error: user.error}))
    }
}