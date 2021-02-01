import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import "./Index.css";
import App from "./App";
import ErrorBoundary from "./components/Utility/ErrorBoundary";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import * as serviceWorker from "./serviceWorker";
import Helmet from "react-helmet";

const isProd = true //process.env.NODE_ENV === "production";


ReactDOM.render(
  <Provider store={store}>
    <ErrorBoundary>
      <PersistGate loading={null} persistor={persistor}>
        <Helmet>
          <meta charset="utf-8" />
          <title>Ready to Activate</title>
          <link rel="icon" href="/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#000000" />
          <link rel="apple-touch-icon" href="logo192.png" />
          <link rel="manifest" href="/manifest.json" />
          <meta
            name="insight-app-sec-validation"
            content="b0e47055-1c1d-42af-ac4c-c21e7b18370e"
          />
        </Helmet>
        <App />

      </PersistGate>
    </ErrorBoundary>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
