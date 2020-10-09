import { createSlice } from "@reduxjs/toolkit";
//import { fetchTerritories } from "../../api/territoryApi";


let initialState = {
  isLoading: false,
  territoryList: [],
  error: null,
};

const startLoading = (state) => {
  state.isLoading = true;
};

const loadingFailed = (state, action) => {
  const { error } = action.payload;
  state.isLoading = false;
  state.error = error;
};

const territorySlice = createSlice({
  name: "territories",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    getTerritoriesSuccess(state, action) {
      const { territories } = action.payload;
      state.territoryList = territories
      state.isLoading = false;
      state.error = null;
    },
    clearTerritories(state) {
      state.isLoading = false;
      state.territoryList = [];
      state.error = null;
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  getTerritoriesSuccess,
  clearTerritories,
  setFailure,
} = territorySlice.actions;

export default territorySlice.reducer;

// export const fetchUserTerritories = (name) => async (dispatch) => {
//   try {
//     dispatch(setIsLoading());
//     let territories = await fetchTerritories(name);
//     if (territories.error) {
//       throw territories.error;
//     }
//     dispatch(getTerritoriesSuccess({ territories: territories.data }));
//   } catch (err) {
//     dispatch(setFailure({ error: err.toString() }));
//   }
// };