import React, { useState, useEffect } from "react";
import { Router, Redirect } from "@reach/router";

import { useDispatch } from "react-redux";
import {
  setInitialTableData,
} from "./redux/slices/programTableSlice";
import { getProgramsSuccess } from "./redux/slices/programsSlice";

import LogIn from "./components/Login";
import ScrollNav from "./components/Navigation/ScrollNav";
import Dashboard from "./pages/Dashboard";
import PlaceOrder from "./pages/PlaceOrder";
import Budget from "./pages/Budget";
import Reports from "./pages/Reports";
import Calendar from "./pages/Calendar";
import Approvals from "./pages/Approvals";
import Coupons from "./pages/Coupons";
import Help from "./pages/Help";
import Orders from "./pages/Orders";
import Program from "./pages/Program";
import RulesByState from "./pages/RulesByState";
import ContactsByState from "./pages/ContactsByState";
import POSClassifications from "./pages/POSClassifications";
import Settings from "./pages/Settings";
import Cart from "./pages/Cart";
import FourOhFour from "./pages/FourOhFour";

import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import themeFile from "./utility/theme.js";

import "./App.css";

//mock data
import programs from "./assets/mockdata/Programs";
import distributors from "./assets/mockdata/distributors";

const theme = createMuiTheme(themeFile);

const App = () => {
  const dispatch = useDispatch();
  const [currentUser, setCurrentUser] = useState(window.localStorage.getItem("user"));

  const handleLogIn = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem("user")
  };

  useEffect(()=>{
    if (currentUser) {
      dispatch(setInitialTableData({ programs, distributors }));
      dispatch(getProgramsSuccess({ programs }));
    }
  },[dispatch, currentUser])

  return (
    <MuiThemeProvider theme={theme}>
      {currentUser && (
        <ScrollNav
          userType={currentUser}
          handleLogout={handleLogout}
        />
      )}
      <div id="main-container">
        {!currentUser && <Redirect noThrow to="/login" />}
        {currentUser && window.location.pathname === "/login" && (
          <Redirect noThrow to="/" />
        )}
        <Router primary={false}>
          {handleAuth(
           <Dashboard path="/" />,
            "/",
            ["field1", "field2", "compliance", "super"],
            currentUser
          )}
          {handleAuth(
            <Orders path="/orders/:reportType" />,
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
            <Program path="/program/:programId" userType={currentUser} />,
            "/program",
            ["field1", "field2", "super"],
            currentUser
          )}
          {handleAuth(
            <Cart path="/cart" userType={currentUser} />,
            "/cart",
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
            ["super"],
            currentUser
          )}
          {handleAuth(
            <Budget path="/budget" />,
            "/budget",
            ["field1", "field2", "super"],
            currentUser
          )}
          {handleAuth(
            <Approvals path="/approval" />,
            "/approval",
            ["compliance", "super"],
            currentUser
          )}
          {handleAuth(
            <RulesByState path="/rules" />,
            "/rules",
            ["compliance", "super"],
            currentUser
          )}
          {handleAuth(
            <ContactsByState path="/compliance-contacts" />,
            "/compliance-contacts",
            ["compliance", "super"],
            currentUser
          )}
          {handleAuth(
            <POSClassifications path="/classifications" />,
            "/classifications",
            ["compliance", "super"],
            currentUser
          )}
          {handleAuth(
            <Settings path="/settings" userType={currentUser} />,
            "/settings",
            ["field1", "field2", "compliance", "super"],
            currentUser
          )}
          <Calendar path="/calendar" />
          <Help path="/help" />
          <FourOhFour default path="/whoops" />
          {!currentUser && (
            <LogIn
              setAuth={handleLogIn}
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
