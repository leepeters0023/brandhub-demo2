import { createSlice } from "@reduxjs/toolkit";
import {
  getFilteredUsers,
  getNextFilteredUsers,
  getSingleUser,
  updateUserCreds,
} from "../../api/userApi";

let initialState = {
  isLoading: false,
  isNextLoading: false,
  isUpdateLoading: false,
  userList: [],
  nextPage: null,
  nextLink: null,
  currentUser: {
    id: null,
    role: null,
    name: null,
    email: null,
    isOnPremise: null,
    isRetail: null,
    states: [],
    territories: [],
  },
  error: null,
};

const startLoading = (state) => {
  state.isLoading = true;
};

const startNext = (state) => {
  state.isNextLoading = true;
};

const startUpdate = (state) => {
  state.isUpdateLoading = true;
};

const loadingFailed = (state, action) => {
  const { error } = action.payload;
  state.isLoading = false;
  state.isNextLoading = false;
  state.isUpdateLoading = false;
  state.error = error;
};

const userUpdateSlice = createSlice({
  name: "userUpdate",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    setIsNextLoading: startNext,
    setUpdateLoading: startUpdate,
    getUsersSuccess(state, action) {
      const { users, nextLink } = action.payload;
      state.nextPage = nextLink ? true : false;
      state.nextLink = nextLink;
      state.userList = [...users];
      state.isLoading = false;
      state.error = null;
    },
    getNextUsersSuccess(state, action) {
      const { users, nextLink } = action.payload;
      state.nextPage = nextLink ? true : false;
      state.nextLink = nextLink;
      state.userList = state.userList.concat(users);
      state.isNextLoading = false;
      state.error = null;
    },
    getSingleUserSuccess(state, action) {
      const { user } = action.payload;
      state.currentUser.id = user.id;
      state.currentUser.role = user.role;
      state.currentUser.name = user.name;
      state.currentUser.email = user.email;
      state.currentUser.isOnPremise = user.isOnPremise;
      state.currentUser.isRetail = user.isRetail;
      state.currentUser.states = [...user.states];
      state.currentUser.territories = [...user.territories];
      state.isLoading = false;
      state.isUpdateLoading = false;
      state.error = null;
    },
    clearUserUpdate(state) {
      state.isLoading = false;
      state.isNextLoading = false;
      state.isUpdateLoading = false;
      state.nextPage = null;
      state.nextLink = null;
      state.userList = [];
      state.currentUser.id = null;
      state.currentUser.role = null;
      state.currentUser.name = null;
      state.currentUser.email = null;
      state.currentUser.isOnPremise = null;
      state.currentUser.isRetail = null;
      state.currentUser.states = [];
      state.currentUser.territories = [];
      state.error = null;
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  setIsNextLoading,
  setUpdateLoading,
  getUsersSuccess,
  getNextUsersSuccess,
  getSingleUserSuccess,
  clearUserUpdate,
  setFailure,
} = userUpdateSlice.actions;

export default userUpdateSlice.reducer;

export const fetchFilteredUsers = (name) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    let users = await getFilteredUsers(name);
    if (users.error) {
      throw users.error;
    }
    let mappedUsers = users.data.users.map((user) => ({
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
      isOnPremise: user["is-on-premise"],
      isRetail: user["is-retail"],
      states: user.states,
      territories: user.territories,
    }));
    dispatch(
      getUsersSuccess({
        users: mappedUsers,
        nextLink: users.data.nextLink ? users.data.nextLink : null,
      })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const fetchNextFilteredUsers = (link) => async (dispatch) => {
  try {
    dispatch(setIsNextLoading());
    let users = await getNextFilteredUsers(link);
    if (users.error) {
      throw users.error;
    }
    let mappedUsers = users.data.users.map((user) => ({
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
      isOnPremise: user["is-on-premise"],
      isRetail: user["is-retail"],
      states: user.states,
      territories: user.territories,
    }));
    dispatch(
      getNextUsersSuccess({
        users: mappedUsers,
        nextLink: users.data.nextLink ? users.data.nextLink : null,
      })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const fetchSingleUser = (id) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    let user = await getSingleUser(id);
    if (user.error) {
      throw user.error;
    }
    let mappedUser = {
      id: user.data.id,
      role: user.data.role,
      name: user.data.name,
      email: user.data.email,
      isOnPremise: user.data["is-on-premise"],
      isRetail: user.data["is-retail"],
      states: user.data.states,
      territories: user.data.territories,
    };
    dispatch(getSingleUserSuccess({ user: mappedUser }));
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const updateUser = (userData) => async (dispatch) => {
  try {
    dispatch(setUpdateLoading());
    let user = await updateUserCreds(userData);
    if (user.error) {
      throw user.error;
    }
    let mappedUser = {
      id: user.data.id,
      role: user.data.role,
      name: user.data.name,
      email: user.data.email,
      isOnPremise: user.data["is-on-premise"],
      isRetail: user.data["is-retail"],
      states: user.data.states,
      territories: user.data.territories,
    };
    dispatch(getSingleUserSuccess({ user: mappedUser }));
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};
