import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import "./Index.css";
import App from "./App";
import ErrorBoundary from "./components/Utility/ErrorBoundary";
import store from "./redux/store";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <Provider store={store}>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
