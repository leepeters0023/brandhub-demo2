import { createSlice } from "@reduxjs/toolkit";
import { getUser, logInUser } from "../../api/userApi";


/*
* DataFormat:
user: {
  loginIsLoading: bool,
  isLoading: bool,
  loggedIn: bool,
  firstName: string,
  lastName: string,
  email: string,
  roles: [ ...array of permissions as strings ],
  territories: [ ...array of regions and key accounts assigned to user ],
  currentTerritory: string
  error: null || string
}
*/

let initialState = {
  loginIsLoading: false,
  isLoading: false,
  loggedIn: false,
  firstName: "",
  lastName: "",
  initials: "",
  email: "",
  role: "",
  territories: [],
  currentTerritory: "",
  error: null
}

const startLoading = (state) => {
  state.isLoading = true;
}

const startLogin = (state) => {
  state.loginIsLoading = true;
}

const loadingFailed = (state, action) => {
  const { error } = action.payload;
  state.isLoading = false;
  state.loginIsLoading = false;
  state.error = error;
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    setLoginLoading: startLogin,
    setLoginSuccess(state) {
      state.loginIsLoading = false
      state.loggedIn = true
      state.error = null
    },
    getUserSuccess(state, action) {
      const { user} = action.payload;
      let userTerritories = user.included.map((data) => {
        return {name: data.attributes.name, id: data.id}
      })
      console.log(userTerritories)
      state.firstName = user.data.attributes.name.split(" ")[0]
      state.lastName = user.data.attributes.name.split(" ")[1]
      state.initials = `${user.data.attributes.name.split(" ")[0][0]}${user.data.attributes.name.split(" ")[1][0]}`
      state.email = user.data.attributes.email
      state.role = user.data.attributes.role
      state.territories = userTerritories
      state.currentTerritory = userTerritories[0].id
      state.isLoading = false
      state.loggedIn = true
      state.error = null
    },
    updateCurrentTerritory(state,action) {
      const { territory } = action.payload;
      state.currentTerritory = territory
    },
    removeUser: (state) => {
      state.isLoading = false
      state.firstName = ""
      state.lastName = ""
      state.initials = ""
      state.email = ""
      state.role = ""
      state.territories = []
      state.error = null
      state.loggedIn = false
    },
    setFailure: loadingFailed
  }
})

export const {
  setIsLoading,
  setLoginLoading,
  getUserSuccess,
  setLoginSuccess,
  updateCurrentTerritory,
  removeUser,
  setFailure,
} = userSlice.actions

export default userSlice.reducer

export const fetchUser = () => async dispatch => {
    dispatch(setIsLoading())
    const user = await getUser()
    if (user.status === "ok") {
      window.localStorage.setItem("brandhub-role", user.data.data.attributes.role)
      dispatch(getUserSuccess({user: user.data}))
    } else {
      dispatch(setFailure({error: user.error}))
    }
}

export const logIn = (email, password) => async dispatch => {
  dispatch(setLoginLoading())
  const res = await logInUser(email, password);
  if (res.status === "ok") {
    dispatch(setLoginSuccess());
  } else {
    dispatch(setFailure({error: res.error}))
  }
} 