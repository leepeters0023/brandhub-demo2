import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';

import { setIsLoading as setOrderLoading, buildTableFromOrders } from "./orderSetSlice"
import { getCouponUrl, getCouponOrderSet } from "../../api/couponApi";
import { mapOrderItems, mapOrderHistoryOrders } from "../apiMaps";
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

export const fetchCouponOrderSet = (code) => async (dispatch) => {
  try {
    dispatch(setOrderLoading());
    const currentOrders = await getCouponOrderSet(code);
    if (currentOrders.error) {
      throw currentOrders.error;
    }
    let currentItems = mapOrderItems(
      currentOrders.data["order-set-items"],
      "order-set-item"
    );
    let orders = mapOrderHistoryOrders(currentOrders.data.orders);
    orders.sort((a, b) => {
      let aName = a.distributorName ? a.distributorName : a.customAddressName;
      let bName = b.distributorName ? b.distributorName : b.customAddressName;
      return aName < bName ? -1 : aName > bName ? 1 : 0;
    });

    let type = currentOrders.data.type;
    let orderId = currentOrders.data.id;
    let orderStatus = currentOrders.data.status;
    let complete = currentOrders.data["is-work-complete"];
    let note = currentOrders.data.notes ? currentOrders.data.notes : "";

    dispatch(
      buildTableFromOrders({
        orderId: orderId,
        type: type,
        orders: orders,
        items: currentItems,
        status: orderStatus,
        isComplete: complete,
        note: note,
      })
    );
    dispatch(clearCoupon());
  } catch (err) {
    dispatch(setFailure({ error: err.toString() }));
  }
}
