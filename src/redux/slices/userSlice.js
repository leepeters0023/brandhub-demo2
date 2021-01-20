import { createSlice } from "@reduxjs/toolkit";
import { addFavoriteItems, getUser, logInUser, getLoginURL, loginUserWithAuthO } from "../../api/userApi";
import { mapItems } from "../apiMaps";

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
  authIsLoading: false,
  loginIsLoading: false,
  isUpdateLoading: false,
  isLoading: false,
  loggedIn: false,
  id: "",
  firstName: "",
  lastName: "",
  initials: "",
  email: "",
  role: "",
  isOnPremise: null,
  isRetail: null,
  currentMarket: null,
  redirectLink: null,
  sessionExpire: null,
  refreshToken: null,
  timeOutSet: false,
  territories: [],
  managedUsers: [],
  currentTerritory: "",
  favoriteItems: [],
  logInError: null,
  error: null,
};

const startLoading = (state) => {
  state.isLoading = true;
};

const startUpdate = (state) => {
  state.isUpdateLoading = true;
};

const startAuth = (state) => {
  state.authIsLoading = true;
}

const startLogin = (state) => {
  state.loginIsLoading = true;
};

const loadingFailed = (state, action) => {
  const { error } = action.payload;
  state.isLoading = false;
  state.loginIsLoading = false;
  state.authIsLoading = false;
  state.error = error;
};

const logInFailed = (state, action) => {
  const { error } = action.payload;
  state.loginIsLoading = false;
  state.authIsLoading = false;
  state.logInError = error;
};

const updateFailed = (state, action) => {
  const { error } = action.payload;
  state.isUpdateLoading = false;
  state.error = error;
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    setLoginLoading: startLogin,
    setUpdateLoading: startUpdate,
    setAuthLoading: startAuth,
    setLoginSuccess(state, action) {
      const { refresh, expires } = action.payload;
      state.refreshToken = refresh;
      state.sessionExpire = expires;
      state.loginIsLoading = false;
      state.loggedIn = true;
      state.error = null;
    },
    getUserSuccess(state, action) {
      const { user } = action.payload;
      state.id = user.id;
      state.firstName = user.firstName;
      state.lastName = user.lastName;
      state.initials = user.initials;
      state.email = user.email;
      state.role = user.role;
      state.isOnPremise = user.isOnPremise;
      state.isRetail = user.isRetail;
      state.currentMarket = user.currentMarket;
      state.territories = [...user.territories];
      state.managedUsers =
        user.managedUsers.length > 0 ? [...user.managedUsers] : [];
      state.currentTerritory = user.currentTerritory;
      state.favoriteItems = user.favoriteItems;
      state.isLoading = false;
      state.loggedIn = true;
      state.logInError = null;
      state.error = null;
    },
    updateFavoriteItems(state, action) {
      const { items } = action.payload;
      state.favoriteItems = [...items];
      state.isUpdateLoading = false;
    },
    updateCurrentTerritory(state, action) {
      const { territory } = action.payload;
      state.currentTerritory = territory;
    },
    updateCurrentMarket(state, action) {
      const { market } = action.payload;
      state.currentMarket = market;
    },
    setRedirectLink(state, action) {
      const { link } = action.payload;
      state.redirectLink = link;
      state.authIsLoading = false;
    },
    setExpires (state, action) {
      const { expires } = action.payload;
      state.sessionExpire = expires;
    },
    setTimeoutSet (state) {
      state.timeOutSet = !state.timeOutSet
    },
    removeUser: (state) => {
      state.isLoading = false;
      state.id = "";
      state.firstName = "";
      state.lastName = "";
      state.initials = "";
      state.email = "";
      state.role = "";
      state.isOnPremise = null;
      state.isRetail = null;
      state.currentMarket = null;
      state.redirectLink = null;
      state.refreshToken = null;
      state.sessionExpire = null;
      state.timeOutSet = false;
      state.territories = [];
      state.managedUsers = [];
      state.favoriteItems = [];
      state.error = null;
      state.logInError = null;
      state.loggedIn = false;
    },
    setLogInFailure: logInFailed,
    setUpdateFailure: updateFailed,
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  setLoginLoading,
  setUpdateLoading,
  setAuthLoading,
  getUserSuccess,
  setLoginSuccess,
  updateFavoriteItems,
  setRedirectLink,
  setExpires,
  setTimeoutSet,
  updateCurrentTerritory,
  updateCurrentMarket,
  removeUser,
  setLogInFailure,
  setUpdateFailure,
  setFailure,
} = userSlice.actions;

export default userSlice.reducer;

export const fetchUser = () => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const user = await getUser();
    if (user.error) {
      throw user.error;
    }
    window.localStorage.setItem("brandhub-role", user.data.role);
    let currentUser = {
      id: user.data.id,
      firstName: user.data.name.split(" ")[0],
      lastName: user.data.name.split(" ")[user.data.name.split(" ").length - 1],
      initials: `${user.data.name.split(" ")[0][0]}${
        user.data.name.split(" ")[user.data.name.split(" ").length - 1][0]
      }`,
      email: user.data.email,
      role: user.data.role,
      isOnPremise: user["is-on-premise"] ? true : false,
      //todo update when this is coming through
      isRetail: user["is-retail"] ? true : true,
      territories:
        user.data.territories.length > 0
          ? user.data.territories.map((terr) => ({
              name: terr.name,
              id: terr.id,
              type: terr.type,
            }))
          : [],
      managedUsers:
        user.data["managed-users"].length > 0
          ? user.data["managed-users"].map((u) => ({
              name: u.name,
              email: u.email,
              role: u.role,
              id: u.id,
            }))
          : [],
      currentTerritory:
        user.data.territories.length > 0 ? user.data.territories[0].id : null,
      favoriteItems: mapItems(user.data["favorite-items"]),
    };
    dispatch(getUserSuccess({ user: currentUser }));
  } catch (err) {
    dispatch(setFailure({ error: err.toString }));
  }
};

export const logIn = (email, password) => async (dispatch) => {
  try {
    dispatch(setLoginLoading());
    const res = await logInUser(email, password);
    if (res.error) {
      throw res.error;
    }
    dispatch(setLoginSuccess());
  } catch (err) {
    dispatch(setLogInFailure({ error: err.toString() }));
  }
};

export const addToFavoriteItems = (idArray) => async (dispatch) => {
  try {
    dispatch(setUpdateLoading());
    const res = await addFavoriteItems(idArray);
    if (res.error) {
      throw res.error;
    }
    const items = mapItems(res.data["favorite-items"]);
    dispatch(updateFavoriteItems({ items: items }));
  } catch (err) {
    dispatch(setUpdateFailure({ error: err.toString() }));
  }
};

export const loginWithCode = (code) => async (dispatch) => {
  try {
    dispatch(setLoginLoading());
    const res = await loginUserWithAuthO(code);
    if (res.error) {
      throw res.error;
    }
    console.log(res);
    dispatch(setLoginSuccess({refresh: res.data["refresh_token"], expires: res.data["expires_in"]}));
  } catch (err) {
    dispatch(setLogInFailure({ error: err.toString() }));
  }
};

export const getRedirect = () => async (dispatch) => {
  try {
    dispatch(setAuthLoading());
    console.log("getting url")
    const res = await getLoginURL()
    if (res.error) {
      throw res.error;
    }
    console.log(res);
    dispatch(setRedirectLink({link: res.data["redirect_url"]}));
  } catch (err) {
    dispatch(setLogInFailure({ error: err.toString() }));
  }
};
