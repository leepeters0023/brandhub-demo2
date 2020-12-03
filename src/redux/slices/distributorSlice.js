import { createSlice } from "@reduxjs/toolkit";
import {
  deleteFavDistList,
  fetchDistributors,
  getFavDistributors,
  newFavDistList,
  updateFavDistList,
} from "../../api/distributorApi";

/*
* Distributor Model
notes: notes: This slice is users soley to build the distributor auto complete fields

{
  type: string (read),
  id: string (read),
  state: string (read),
  name: string (read),
  city: string (read),
  links: object (read),
}

*/

let initialState = {
  isLoading: false,
  distListIsLoading: false,
  attnIsLoading: false,
  updateIsLoading: false,
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
  state.updateIsLoading = true;
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
    setUpdateIsLoading: startUpdate,
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
      state.updateIsLoading = false;
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
      state.updateIsLoading = false;
    },
    clearDistributors(state) {
      state.isLoading = false;
      state.distListIsLoading = false;
      state.updateIsLoading = false;
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
  setUpdateIsLoading,
  getDistributorsSuccess,
  getFavDistributorsSuccess,
  updateCurrentTerritory,
  createNewFavoriteDistList,
  updateDistributorList,
  deleteSingleDistributor,
  deleteDistributorList,
  clearDistributors,
  setFailure,
} = distributorSlice.actions;

export default distributorSlice.reducer;

export const fetchUserDistributors = (name, attn = false) => async (
  dispatch
) => {
  try {
    if (attn) {
      dispatch(setAttnisLoading());
    } else {
      dispatch(setIsLoading());
    }
    let distributors = await fetchDistributors(name);
    if (distributors.error) {
      throw distributors.error;
    }
    //for mock data, will update when fields are there
    let mappedDistributors = distributors.data.map((dist) => ({
      ...dist,
      attn: "Firstname Lastname",
    }));
    dispatch(
      getDistributorsSuccess({ distributors: mappedDistributors, attn: attn })
    );
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const fetchFavDistributors = () => async (dispatch) => {
  try {
    dispatch(setDistLoading());
    const distLists = await getFavDistributors();
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
  }
};

export const newFavoriteDistList = (index) => async (dispatch) => {
  try {
    dispatch(setUpdateIsLoading());
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
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const updateFavoriteDistributorList = (id, name, distArray) => async (
  dispatch
) => {
  try {
    dispatch(setUpdateIsLoading());
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
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};

export const deleteFavoriteDistributorList = (id) => async (dispatch) => {
  try {
    dispatch(setUpdateIsLoading());
    const deleteStatus = await deleteFavDistList(id);
    if (deleteStatus.error) {
      throw deleteStatus.error;
    }
    dispatch(deleteDistributorList({ id: id }));
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};
