import { createSlice } from "@reduxjs/toolkit";
//import { fetchTags } from "../../api/complianceApi"

let initialState = {
  isLoading: false,
  tagList: [],
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

const tagSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    getTagsSuccess(state, action) {
      const { tags } = action.payload;
      state.tagList = tags;
      state.isLoading = false;
      state.error = null;
    },
    clearTags(state) {
      state.isLoading = false;
      state.tagList = [];
      state.error = false;
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  getTagsSuccess,
  clearTags,
  setFailure,
} = tagSlice.actions;

export default tagSlice.reducer;

// export const fetchTagsByName = (name) => async (dispatch) => {
//   try {
//     dispatch(setIsLoading());
//     let tags = await fetchTags(name);
//     if (tags.error) {
//       throw tags.error;
//     }
//     dispatch(getTagsSuccess({ tags: tags.data }));
//   } catch (err) {
//     dispatch(setFailure({ error: err.toString() }));
//   }
// };
