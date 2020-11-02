import { configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";

import rootReducer from "./rootReducer";

const middleware = [...getDefaultMiddleware({
  thunk: true,
  immutableCheck: false,
  serializableCheck: false,
})]

const store = configureStore({
  reducer: rootReducer,
  middleware
});

if (process.env.NODE_ENV === "development" && module.hot) {
  module.hot.accept("./rootReducer", () => {
    const newRootReducer = require("./rootReducer").default;
    store.replaceReducer(newRootReducer);
  });
}

export default store;
