import { createSlice } from "@reduxjs/toolkit";
import { fetchDistributors } from "../../api/distributorApi";

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
  distributorList: [],
  editAttnList: [],
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

const distributorSlice = createSlice({
  name: "distributors",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    getDistributorsSuccess(state, action) {
      const { distributors, attn } = action.payload;
      if (!attn) {
        state.distributorList = distributors
      } else {
        state.editAttnList = distributors
      }
      state.isLoading = false;
      state.error = null;
    },
    clearDistributors(state) {
      state.isLoading = false;
      state.distributorList = [];
      state.editAttnList = [];
      state.error = null;
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  getDistributorsSuccess,
  clearDistributors,
  setFailure,
} = distributorSlice.actions;

export default distributorSlice.reducer;

export const fetchUserDistributors = (name, attn = false) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    let distributors = await fetchDistributors(name);
    if (distributors.error) {
      throw distributors.error;
    }
    //for mock data, will update when fields are there
    let mappedDistributors = distributors.data.map((dist) => ({
      ...dist,
      attn: "Firstname Lastname"
    }))
    dispatch(getDistributorsSuccess({ distributors: mappedDistributors, attn: attn }));
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
};
