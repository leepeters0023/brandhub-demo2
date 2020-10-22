import { createSlice } from "@reduxjs/toolkit";

/*
* Coupon Model
notes: Still in the works, nothing set in stone

*/

let initialState = {
  isLoading: false,
  brandScope: "single",
  brand: null,
  bu: null,
  couponType: null,
  offerType: null,
  itemType: null,
  program: null,
  progressiveOffer: "yes",
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

const couponSlice = createSlice({
  name: "coupons",
  initialState,
  reducers: {
    setIsLoading: startLoading,
    updateCouponValue(state, action) {
      const { key, value } = action.payload;
      state[key] = value;
    },
    clearCoupon(state) {
      state.isLoading = false;
      state.brandScope = null;
      state.bu = null;
      state.couponType = null;
      state.offerType = null;
      state.itemType = null;
      state.program = null;
      state.error = null;
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  updateCouponValue,
  clearCoupon,
  setFailure,
} = couponSlice.actions;

export default couponSlice.reducer;
