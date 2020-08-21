import { combineReducers } from '@reduxjs/toolkit'
 
import userReducer from "./slices/userSlice";
import programTableReducer from "./slices/programTableSlice";
import programsReducer from "./slices/programsSlice";
import ordersReducer from "./slices/ordersSlice";

const rootReducer = combineReducers({
  user: userReducer,
  orders: ordersReducer,
  programTable: programTableReducer,
  programs: programsReducer,
})

export default rootReducer