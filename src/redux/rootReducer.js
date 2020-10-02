import { combineReducers } from "@reduxjs/toolkit";

import brandReducer from "./slices/brandSlice";
import currentOrderReducer from "./slices/currentOrderSlice";
import distributorReducer from "./slices/distributorSlice";
import filterReducer from "./slices/filterSlice";
import itemReducer from "./slices/itemSlice";
import orderHistoryReducer from "./slices/orderHistorySlice";
import orderSetHistoryReducer from "./slices/orderSetHistorySlice";
import orderSetReducer from "./slices/orderSetSlice";
import patchOrderReducer from "./slices/patchOrderSlice";
import preOrderDetailReducer from "./slices/preOrderDetailSlice";
import programsReducer from "./slices/programsSlice";
import userReducer from "./slices/userSlice";

const rootReducer = combineReducers({
  brands: brandReducer,
  currentOrder: currentOrderReducer,
  distributors: distributorReducer,
  filters: filterReducer,
  items: itemReducer,
  orderHistory: orderHistoryReducer,
  orderSet: orderSetReducer,
  orderSetHistory: orderSetHistoryReducer,
  patchOrder: patchOrderReducer,
  preOrderDetails: preOrderDetailReducer,
  programs: programsReducer,
  user: userReducer,
});

export default rootReducer;
