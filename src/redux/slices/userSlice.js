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
  role: "",
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
      const { user: { name, email, role}} = action.payload;
      state.firstName = name.split(" ")[0]
      state.lastName = name.split(" ")[1]
      state.email = email
      state.role = role
      state.territories = ["North East", "Walmart"]
    },
    setUserFetched: (state) => {
      state.isLoading = false
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
  setUserFetched,
  removeUser,
  setFailure,
} = userSlice.actions

export default userSlice.reducer

export const fetchUser = () => async dispatch => {
    dispatch(setIsLoading())
    const user = await getUser("1")
    console.log(user)
    if (user.status === "ok") {
      dispatch(getUserSuccess({user: user.data.data.attributes}))
    } else {
      dispatch(setFailure({error: user.error}))
    }
}