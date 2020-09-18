import { combineReducers } from '@reduxjs/toolkit'
 
import userReducer from "./slices/userSlice";
import programTableReducer from "./slices/programTableSlice";
import programsReducer from "./slices/programsSlice";
import orderHistoryReducer from "./slices/orderHistorySlice";
import inStockOrderReducer from "./slices/inStockOrderSlice";
import onDemandOrderReducer from "./slices/onDemandOrderSlice";
import patchOrderReducer from "./slices/patchOrderSlice";
import itemReducer from "./slices/itemSlice";
import distributorReducer from "./slices/distributorSlice";
import rollupReducer from "./slices/rollupSlice";

const rootReducer = combineReducers({
  user: userReducer,
  orderHistory: orderHistoryReducer,
  inStockOrder: inStockOrderReducer,
  onDemandOrder: onDemandOrderReducer,
  programTable: programTableReducer,
  programs: programsReducer,
  patchOrder: patchOrderReducer,
  items: itemReducer,
  distributors: distributorReducer,
  rollup: rollupReducer,
})

export default rootReducer