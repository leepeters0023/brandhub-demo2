import { combineReducers } from '@reduxjs/toolkit'

import programCartReducer from "./slices/programCartSlice";

const rootReducer = combineReducers({
  programCart: programCartReducer
})

export default rootReducer