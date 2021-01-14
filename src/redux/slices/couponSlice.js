import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';

import { getCouponUrl } from "../../api/couponApi";
/*
* Coupon Model
notes: Still in the works, nothing set in stone

*/

let initialState = {
  isLoading: false,
  isLinkLoading: false,
  iframeLink: null,
  iframeId: null,
  error: null,
};

const startLoading = (state) => {
  state.isLoading = true;
};

const startLinkLoading = (state) => {
  state.isLinkLoading = true;
}

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
    setLinkIsLoading: startLinkLoading,
    getIframeLinkSuccess(state, action) {
      const { link, id } = action.payload;
      state.iframeLink = link;
      state.iframeId = id;
      state.isLinkLoading = false;
      state.error = null;
    },
    clearCoupon(state) {
      state.isLoading = false;
      state.isLinkLoading = false;
      state.iframeLink = null;
      state.iframeId = null;
      state.error = null;
    },
    setFailure: loadingFailed,
  },
});

export const {
  setIsLoading,
  setLinkIsLoading,
  getIframeLinkSuccess,
  clearCoupon,
  setFailure,
} = couponSlice.actions;

export default couponSlice.reducer;

export const getIframeUrl = (email) => async (dispatch) => {
  try {
    dispatch(setIsLoading());
    dispatch(setLinkIsLoading());
    const id = uuidv4();
    const uniqueUrl = `${process.env.REACT_APP_COUPON_POSTBACK_URL}/${id}`
    const iframeUrl = await getCouponUrl(email, uniqueUrl)
    if (iframeUrl.error) {
      throw iframeUrl.error
    }
    dispatch(getIframeLinkSuccess({ link: iframeUrl, id: id }))
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
}
