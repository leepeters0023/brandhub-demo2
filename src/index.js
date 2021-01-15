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

const isProd = process.env.NODE_ENV === "production";

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
            content="2d6c244f-f6f7-4359-b665-6afb1b69df4b"
          />
          {isProd && (
            <script type="text/javascript">{`!function(e,t,n){function a(){var e=t.getElementsByTagName("script")[0],n=t.createElement("script");n.type="text/javascript",n.async=!0,n.src="https://beacon-v2.helpscout.net",e.parentNode.insertBefore(n,e)}if(e.Beacon=n=function(t,n,a){e.Beacon.readyQueue.push({method:t,options:n,data:a})},n.readyQueue=[],"complete"===t.readyState)return a();e.attachEvent?e.attachEvent("onload",a):e.addEventListener("load",a,!1)}(window,document,window.Beacon||function(){});window.Beacon('init', '521f5954-7022-46e2-9707-6a82501f23e7')`}</script>
          )}
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
