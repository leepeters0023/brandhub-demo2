import { combineReducers } from '@reduxjs/toolkit'
 
import userReducer from "./slices/userSlice";
import programTableReducer from "./slices/programTableSlice";
import programsReducer from "./slices/programsSlice";
import orderHistoryReducer from "./slices/orderHistorySlice";
import currentOrderReducer from "./slices/currentOrderSlice";
import patchOrderReducer from "./slices/patchOrderSlice";
import itemReducer from "./slices/itemSlice";
import distributorReducer from "./slices/distributorSlice";
import brandReducer from "./slices/brandSlice";
import rollupReducer from "./slices/rollupSlice";

const rootReducer = combineReducers({
  user: userReducer,
  orderHistory: orderHistoryReducer,
  currentOrder: currentOrderReducer,
  programTable: programTableReducer,
  programs: programsReducer,
  patchOrder: patchOrderReducer,
  items: itemReducer,
  distributors: distributorReducer,
  brands: brandReducer,
  rollup: rollupReducer,
})

export default rootReducer