import { combineReducers } from '@reduxjs/toolkit'

import { reducer as beesReducer } from "redux-bees";
 
import userReducer from "./slices/userSlice";
import programTableReducer from "./slices/programTableSlice";
import programsReducer from "./slices/programsSlice";
import ordersReducer from "./slices/ordersSlice";

const rootReducer = combineReducers({
  bees: beesReducer,
  user: userReducer,
  orders: ordersReducer,
  programTable: programTableReducer,
  programs: programsReducer,
})

export default rootReducer