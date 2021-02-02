import { createSlice } from "@reduxjs/toolkit";
import {
  deleteFavDistList,
  fetchDistributors,
  getFavDistributors,
  newFavDistList,
  updateFavDistList,
  editCustomAttentionLine,
} from "../../api/distributorApi";
import {
  setIsLoading as patchLoading,
  patchSuccess,
  setFailure as patchFailure,
} from "./patchOrderSlice";
import { setError } from "./errorSlice";

let initialState = {
  isLoading: false,
  distListIsLoading: false,
  attnIsLoading: false,
  isUpdateLoading: false,
  distributorList: [],
  favoriteDistributors: [],
  editAttnList: [],
  error: null,
};

const startLoading = (state) => {
  state.isLoading = true;
};

const startDist = (state) => {
  state.distListIsLoading = true;
};

const startAttn = (state) => {
  state.attnIsLoading = true;
};

const startUpdate = (state) => {
  state.isUpdateLoading = true;
};

const loadingFailed = (state, action) => {
  const { error } = action.payload;
  state.isLoading = false;
  state.distListIsLoading = false;
  state.attnIsLoading = false;
  state.error = error;
};

const distributorSlice = createSlice({
  name: "distributors",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    setDistLoading: startDist,
    setAttnisLoading: startAttn,
    setisUpdateLoading: startUpdate,
    getDistributorsSuccess(state, action) {
      const { distributors, attn } = action.payload;
      if (!attn) {
        state.distributorList = distributors;
      } else {
        state.editAttnList = distributors;
      }
      state.isLoading = false;
      state.attnIsLoading = false;
      state.error = null;
    },
    getFavDistributorsSuccess(state, action) {
      const { distLists } = action.payload;
      state.distListIsLoading = false;
      state.favoriteDistributors = [...distLists];
    },
    createNewFavoriteDistList(state, action) {
      const { id, name } = action.payload;
      let newDistributorList = {
        id: id,
        name: name,
        distributors: [],
      };
      let updatedLists = state.favoriteDistributors.concat([
        newDistributorList,
      ]);
      state.favoriteDistributors = updatedLists;
      state.isUpdateLoading = false;
    },
    updateDistributorList(state, action) {
      const { id, list } = action.payload;
      let updatedDistributors = state.favoriteDistributors.map((distList) => {
        if (distList.id === id) {
          return {
            ...list,
          };
        } else return { ...distList };
      });
      state.favoriteDistributors = updatedDistributors;
    },
    deleteSingleDistributor(state, action) {
      const { id, distId } = action.payload;
      let updatedDistributors = state.favoriteDistributors.map((distList) => {
        if (distList.id === id) {
          return {
            ...distList,
            distributors: distList.distributors.filter(
              (dist) => dist.id !== distId
            ),
          };
        } else return { ...distList };
      });
      state.favoriteDistributors = updatedDistributors;
    },
    deleteDistributorList(state, action) {
      const { id } = action.payload;
      let updatedDistributors = state.favoriteDistributors.filter(
        (distList) => distList.id !== id
      );
      state.favoriteDistributors = updatedDistributors;
      state.isUpdateLoading = false;
    },
    updateAttnSuccess(state, action) {
      const { id, attn } = action.payload;
      let updatedDistributors = state.editAttnList.map((dist) => {
        if (dist.id === id) {
          return {
            ...dist,
            attn: attn,
          };
        } else return { ...dist };
      });
      state.editAttnList = updatedDistributors;
      state.isLoading = false;
      state.error = null;
    },
    clearDistributors(state) {
      state.isLoading = false;
      state.distListIsLoading = false;
      state.isUpdateLoading = false;
      state.distributorList = [];
      state.favoriteDistributors = [];
      state.editAttnList = [];
      state.error = null;
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  setDistLoading,
  setAttnisLoading,
  setisUpdateLoading,
  getDistributorsSuccess,
  getFavDistributorsSuccess,
  updateCurrentTerritory,
  createNewFavoriteDistList,
  updateDistributorList,
  deleteSingleDistributor,
  deleteDistributorList,
  updateAttnSuccess,
  clearDistributors,
  setFailure,
} = distributorSlice.actions;

export default distributorSlice.reducer;

export const fetchUserDistributors = (name, territoryId, stateIds, attn = false) => async (
  dispatch
) => {
  try {
    if (attn) {
      dispatch(setAttnisLoading());
    } else {
      dispatch(setIsLoading());
    }
    let distributors = await fetchDistributors(name, territoryId, stateIds);
    if (distributors.error) {
      throw distributors.error;
    }
    let mappedDistributors = distributors.data.map((dist) => ({
      ...dist,
      attn: dist["current-user-attn"]
        ? dist["current-user-attn"]
        : dist["default-attn"]
        ? dist["default-attn"]
        : "---",
    }));
    dispatch(
      getDistributorsSuccess({ distributors: mappedDistributors, attn: attn })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(setError({ error: err.toString() }));
  }
};

export const fetchFavDistributors = (territoryId) => async (dispatch) => {
  try {
    dispatch(setDistLoading());
    const distLists = await getFavDistributors(territoryId);
    if (distLists.error) {
      throw distLists.error;
    }
    const mappedDistList = distLists.data.map((favList) => ({
      id: favList.id,
      name: favList.name,
      distributors: [...favList.distributors],
    }));
    dispatch(getFavDistributorsSuccess({ distLists: mappedDistList }));
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(setError({ error: err.toString() }));
  }
};

export const newFavoriteDistList = (index) => async (dispatch) => {
  try {
    dispatch(setisUpdateLoading());
    dispatch(patchLoading());
    const newList = await newFavDistList(index + 1);
    if (newList.error) {
      throw newList.error;
    }
    dispatch(
      createNewFavoriteDistList({
        id: newList.data.id,
        name: newList.data.name,
      })
    );
    dispatch(patchSuccess());
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(patchFailure({ error: err.toString() }));
  }
};

export const updateFavoriteDistributorList = (id, name, distArray) => async (
  dispatch
) => {
  try {
    dispatch(setisUpdateLoading());
    dispatch(patchLoading());
    const formattedDistArray = distArray.map((list) => ({
      id: list.id,
      type: "distributor",
    }));
    const updatedList = await updateFavDistList(id, name, formattedDistArray);
    if (updatedList.error) {
      throw updatedList.error;
    }
    const formattedList = {
      id: id,
      distributors: updatedList.data.distributors,
      name: updatedList.data.name,
    };
    dispatch(updateDistributorList({ id: id, list: formattedList }));
    dispatch(patchSuccess());
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(patchFailure({ error: err.toString() }));
  }
};

export const deleteFavoriteDistributorList = (id) => async (dispatch) => {
  try {
    dispatch(setisUpdateLoading());
    dispatch(patchLoading());
    const deleteStatus = await deleteFavDistList(id);
    if (deleteStatus.error) {
      throw deleteStatus.error;
    }
    dispatch(deleteDistributorList({ id: id }));
    dispatch(patchSuccess());
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(patchFailure({ error: err.toString() }));
  }
};

export const setCustomAttention = (id, attn) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    dispatch(patchLoading());
    const updatedDist = await editCustomAttentionLine(id, attn);
    if (updatedDist.error) {
      throw updatedDist.error;
    }
    dispatch(updateAttnSuccess({ id, attn }));
    dispatch(patchSuccess());
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(patchFailure({ error: err.toString() }));
  }
};
