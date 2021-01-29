import { createSlice } from "@reduxjs/toolkit";
import { fetchBusinessUnits } from "../../api/itemApi";
import { setError } from "./errorSlice";

let initialState = {
  isLoading: false,
  bus: [],
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

const businessUnitSlice = createSlice({
  name: "businessUnits",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    getBuSuccess(state, action) {
      const { bus } = action.payload;
      state.bus = bus;
      state.isLoading = false;
      state.error = null;
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  getBuSuccess,
  setFailure,
} = businessUnitSlice.actions;

export default businessUnitSlice.reducer;

export const fetchBUs = () => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    const bus = await fetchBusinessUnits();
    if (bus.error) {
      throw bus.error;
    }
    let mappedBus = bus.data.map((bu) => ({
      id: bu.id,
      name: bu.name,
    }));
    dispatch(getBuSuccess({ bus: mappedBus }));
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
    dispatch(setError({ error: err.toString() }));
  }
};
