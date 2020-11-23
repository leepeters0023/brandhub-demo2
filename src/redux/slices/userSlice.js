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

//mock favorites
let favoriteItems = [
  {
    id: "1",
    imgUrl:
      "https://res.cloudinary.com/joshdowns-dev/image/upload/v1600100945/Select/110011067_Large_1-Case_Talker_vbfgnx.jpg",
    itemNumber: "0110006615",
    itemType: "Digital Banner",
    program: "Apothic Winter 2021",
    estCost: 299,
  },
  {
    id: "2",
    imgUrl:
      "https://res.cloudinary.com/joshdowns-dev/image/upload/v1600100945/Select/110008964_Large_1-carton_rider_p7c8oo.jpg",
    itemNumber: "0110006617",
    itemType: "Case Sleeves",
    program: "Apothic General",
    estCost: 599,
  },
  {
    id: "3",
    imgUrl:
      "https://res.cloudinary.com/joshdowns-dev/image/upload/v1595013432/Select/bh_newamsterdam_glorifier_g7orb2.jpg",
    itemNumber: "0110004612",
    itemType: "Advertising Specialties",
    program: "New Amsterdam Fall 2021",
    estCost: 550,
  },
];

let initialState = {
  loginIsLoading: false,
  isLoading: false,
  loggedIn: false,
  id: "",
  firstName: "",
  lastName: "",
  initials: "",
  email: "",
  role: "",
  territories: [],
  managedUsers: [],
  currentTerritory: "",
  favoriteItems: favoriteItems,
  logInError: null,
  error: null,
};

const startLoading = (state) => {
  state.isLoading = true;
};

const startLogin = (state) => {
  state.loginIsLoading = true;
};

const loadingFailed = (state, action) => {
  const { error } = action.payload;
  state.isLoading = false;
  state.loginIsLoading = false;
  state.error = error;
};

const logInFailed = (state, action) => {
  const { error } = action.payload;
  state.isLoading = false;
  state.loginIsLoading = false;
  state.logInError = error;
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    setLoginLoading: startLogin,
    setLoginSuccess(state) {
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
      state.territories = [...user.territories];
      state.managedUsers =
        user.managedUsers.length > 0 ? [...user.managedUsers] : [];
      state.currentTerritory = user.currentTerritory;
      state.isLoading = false;
      state.loggedIn = true;
      state.logInError = null;
      state.error = null;
    },
    updateCurrentTerritory(state, action) {
      const { territory } = action.payload;
      state.currentTerritory = territory;
    },
    updateAttentionLine(state, action) {
      const { id, attn } = action.payload
      //TODO
      console.log(id, attn);
    },
    removeUser: (state) => {
      state.isLoading = false;
      state.id = "";
      state.firstName = "";
      state.lastName = "";
      state.initials = "";
      state.email = "";
      state.role = "";
      state.territories = [];
      state.managedUsers = [];
      state.error = null;
      state.logInError = null;
      state.loggedIn = false;
    },
    setLogInFailure: logInFailed,
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  setLoginLoading,
  getUserSuccess,
  setLoginSuccess,
  updateAttentionLine,
  updateCurrentTerritory,
  removeUser,
  setLogInFailure,
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
      territories:
        user.data.territories.length > 0
          ? user.data.territories.map((terr) => ({
              name: terr.name,
              id: terr.id,
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
    };
    dispatch(getUserSuccess({ user: currentUser }));
  } catch (err) {
    dispatch(setFailure({ error: err.toString }));
    console.log(err);
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
