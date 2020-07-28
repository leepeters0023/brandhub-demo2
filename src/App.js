import React, { useState } from "react";
import { Router, Redirect } from "@reach/router";

import LogIn from "./components/Login";
import TopLeftNav from "./components/Navigation/TopLeftNav";
import Landing from "./pages/Landing";
import PlaceOrder from "./pages/PlaceOrder";
import Budget from "./pages/Budget";
import Reports from "./pages/Reports";
import Calendar from "./pages/Calendar";
import Compliance from "./pages/Compliance";
import Coupons from "./pages/Coupons";
import Help from "./pages/Help";
import Orders from "./pages/Orders";
import FourOhFour from "./pages/FourOhFour";

import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import themeFile from "./utility/theme.js";

import "./App.css";

const theme = createMuiTheme(themeFile);

const App = () => {
  const [loginPath, setLoginPath] = useState(null);
  const [notificationOpen, handleNotification] = useState(false);
  const [currentUser, setCurrentUser] = useState(window.localStorage.getItem("user"));

  const handleLogIn = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem("user")
  };

  return (
    <MuiThemeProvider theme={theme}>
      {currentUser && (
        <TopLeftNav
          userType={currentUser}
          notificationOpen={notificationOpen}
          handleLogout={handleLogout}
          handleNotification={handleNotification}
        />
      )}
      <div id="main-container">
        {!currentUser && <Redirect noThrow to="/login" />}
        {currentUser && window.location.pathname === "/login" && (
          <Redirect noThrow to={loginPath} />
        )}
        <Router primary={false}>
          {handleAuth(
           <Landing path="/" />,
            "/",
            ["field1", "field2", "super"],
            currentUser
          )}
          {handleAuth(
            <Orders path="/orders" />,
            "/orders",
            ["field1", "field2", "super"],
            currentUser
          )}
          {handleAuth(
            <PlaceOrder path="/order" userType={currentUser} />,
            "/order",
            ["field1", "field2", "super"],
            currentUser
          )}
          {handleAuth(
            <Coupons path="/coupons" />,
            "/coupons",
            ["field1", "field2", "super"],
            currentUser
          )}
          {handleAuth(
            <Reports path="/reports" />,
            "/reports",
            ["field1", "field2", "super", "compliance"],
            currentUser
          )}
          {handleAuth(
            <Budget path="/budget" />,
            "/budget",
            ["field1", "field2", "super"],
            currentUser
          )}
          {handleAuth(
            <Compliance path="/compliance" />,
            "/compliance",
            ["compliance", "super"],
            currentUser
          )}
          <Calendar path="/calendar" />
          <Help path="/help" />
          <FourOhFour default path="/whoops" />
          {!currentUser && (
            <LogIn
              setAuth={handleLogIn}
              setLoginPath={setLoginPath}
              path="/login"
            />
          )}
        </Router>
      </div>
    </MuiThemeProvider>
  );
};

export default App;

const handleAuth = (component, path, users, currentUser) => {
  if (users.includes(currentUser)) {
    return component;
  } else if (!currentUser) {
    return <Redirect noThrow from={path} to="/login" />
  } else return <Redirect noThrow from={path} to="/whoops" />;
};
