import { combineReducers } from '@reduxjs/toolkit'
 
import userReducer from "./slices/userSlice";
import programTableReducer from "./slices/programTableSlice";
import programsReducer from "./slices/programsSlice";
import ordersReducer from "./slices/ordersSlice";
import inStockOrderReducer from "./slices/inStockOrderSlice";
import onDemandOrderReducer from "./slices/onDemandOrderSlice";
import patchOrderReducer from "./slices/patchOrderSlice";

const rootReducer = combineReducers({
  user: userReducer,
  orders: ordersReducer,
  inStockOrder: inStockOrderReducer,
  onDemandOrder: onDemandOrderReducer,
  programTable: programTableReducer,
  programs: programsReducer,
  patchOrder: patchOrderReducer
})

export default rootReducer