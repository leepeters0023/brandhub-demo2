import { createSlice } from "@reduxjs/toolkit";
import {
  addFavoriteItems,
  getUser,
  logInUser,
  getLoginURL,
  loginUserWithAuthO,
} from "../../api/userApi";
import { mapItems } from "../apiMaps";
import { setError } from "./errorSlice";

let initialState = {
  authIsLoading: false,
  loginIsLoading: false,
  isUpdateLoading: false,
  isLoading: false,
  loggedIn: false,
  id: "",
  supplierId: "",
  firstName: "",
  lastName: "",
  name: "",
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
  states: [],
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
};

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
      state.supplierId = user.supplierId;
      state.name = user.name;
      state.firstName = user.firstName;
      state.lastName = user.lastName;
      state.initials = user.initials;
      state.email = user.email;
      state.role = user.role;
      state.isOnPremise = user.isOnPremise;
      state.isRetail = user.isRetail;
      state.currentMarket = user.currentMarket;
      state.territories = [...user.territories];
      state.states = user.states.length > 0 ? [...user.states] : [];
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
    setExpires(state, action) {
      const { expires } = action.payload;
      state.sessionExpire = expires;
    },
    setTimeoutSet(state) {
      state.timeOutSet = !state.timeOutSet;
    },
    removeUser: (state) => {
      state.isLoading = false;
      state.id = "";
      state.supplierId = "";
      state.name = "";
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
      state.states = [];
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
  const handleTerritories = (terrArray) => {
    if (terrArray.length === 0) {
      return [];
    } else if (terrArray.length === 1) {
      return [
        {
          name: terrArray[0].name,
          id: terrArray[0].id,
          type: terrArray[0].type,
        },
      ];
    } else {
      let regional = [];
      let customer = [];
      terrArray.forEach((terr) => {
        if (terr.type === "Regional") {
          regional.push(terr);
        } else {
          customer.push(terr);
        }
      });
      regional = regional
        .map((terr) => ({
          name: terr.name,
          id: terr.id,
          type: terr.type,
        }))
        .sort((a, b) => {
          return a.name[0].toLowerCase() < b.name[0].toLowerCase()
            ? -1
            : a.name[0].toLowerCase() > b.name[0].toLowerCase()
            ? 1
            : 0;
        });
      customer = customer
        .map((terr) => ({
          name: terr.name,
          id: terr.id,
          type: terr.type,
        }))
        .sort((a, b) => {
          return a.name[0].toLowerCase() < b.name[0].toLowerCase()
            ? -1
            : a.name[0].toLowerCase() > b.name[0].toLowerCase()
            ? 1
            : 0;
        });
      return regional.concat(customer);
    }
  };
  try {
    dispatch(setIsLoading());
    const user = await getUser();
    if (user.error) {
      throw user.error;
    }
    window.localStorage.setItem("brandhub-role", user.data.role);
    let currentUser = {
      id: user.data.id,
      supplierId: user.data.supplier ? user.data.supplier.id : null,
      name: user.data.name.includes(",")
        ? user.data.name.split(", ")[1] + user.data.name.split(", ")[0]
        : user.data.name,
      firstName: user.data.name.includes(",")
        ? user.data.name.split(", ")[1]
        : user.data.name.split(" ")[0],
      lastName: user.data.name.includes(",")
        ? user.data.name.split(", ")[0]
        : user.data.name.split(" ")[user.data.name.split(" ").length - 1],
      initials: "",
      email: user.data.email,
      role: user.data.role,
      isOnPremise: user.data["is-on-premise"] ? true : false,
      //todo update when this is coming through
      isRetail: user.data["is-retail"]
        ? true
        : !user.data["is-on-premise"]
        ? true
        : false,
      currentMarket: user["is-retail"]
        ? "Retail"
        : user["is-on-premise"]
        ? "On Premise"
        : "Retail",
      territories: handleTerritories(user.data.territories),
      states:
        user.data.states.length > 0
          ? user.data.states.map((state) => ({
              id: state.id,
              code: state.code,
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
      currentTerritory: "",
      favoriteItems: mapItems(user.data["favorite-items"]),
    };
    currentUser.initials = `${currentUser.firstName[0]}${currentUser.lastName[0]}`;
    currentUser.currentTerritory =
      currentUser.territories.length > 0 ? currentUser.territories[0].id : null;
    dispatch(getUserSuccess({ user: currentUser }));
  } catch (err) {
    dispatch(setFailure({ error: err.toString }));
    dispatch(setError({ error: err.toString() }));
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
    dispatch(setError({ error: err.toString() }));
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
    dispatch(setError({ error: err.toString() }));
  }
};

export const loginWithCode = (code) => async (dispatch) => {
  try {
    dispatch(setLoginLoading());
    const res = await loginUserWithAuthO(code);
    if (res.error) {
      throw res.error;
    }
    dispatch(
      setLoginSuccess({
        refresh: res.data["refresh_token"],
        expires: res.data["expires_in"],
      })
    );
  } catch (err) {
    dispatch(setLogInFailure({ error: err.toString() }));
    dispatch(setError({ error: err.toString() }));
  }
};

export const getRedirect = () => async (dispatch) => {
  try {
    dispatch(setAuthLoading());
    const res = await getLoginURL();
    if (res.error) {
      throw res.error;
    }
    dispatch(setRedirectLink({ link: res.data["redirect_url"] }));
  } catch (err) {
    dispatch(setLogInFailure({ error: err.toString() }));
    dispatch(setError({ error: err.toString() }));
  }
};
