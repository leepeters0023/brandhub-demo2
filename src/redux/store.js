import { configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import rootReducer from "./rootReducer";

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["user", "items", "reports", "currentOrder", "orderSet", "rfq", "purchaseOrder", "itemApprovedOrDenied"]
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middleware = [...getDefaultMiddleware({
  thunk: true,
  immutableCheck: false,
  serializableCheck: false,
})]

export const store = configureStore({
  reducer: persistedReducer,
  middleware
});

export const persistor = persistStore(store);

if (process.env.NODE_ENV === "development" && module.hot) {
  module.hot.accept("./rootReducer", () => {
    const newRootReducer = require("./rootReducer").default;
    store.replaceReducer(newRootReducer);
  });
}
