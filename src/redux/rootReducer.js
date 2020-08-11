import { combineReducers } from '@reduxjs/toolkit'

import programTableReducer from "./slices/programTableSlice";
import programsReducer from "./slices/programsSlice";
import ordersReducer from "./slices/ordersSlice";

const rootReducer = combineReducers({
  orders: ordersReducer,
  programTable: programTableReducer,
  programs: programsReducer,
})

export default rootReducer