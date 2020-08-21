import React, { useState, useEffect } from "react";
import { Router, Redirect } from "@reach/router";

import { useDispatch, useSelector } from "react-redux";
import { getProgramsSuccess } from "./redux/slices/programsSlice";

import { logoutUser } from "./api/userApi"

import { removeUser, setIsLoading, fetchUser } from "./redux/slices/userSlice"

import LogIn from "./components/Login";
import ScrollNav from "./components/Navigation/ScrollNav";
import Dashboard from "./pages/Dashboard";
import Programs from "./pages/Programs";
import PlaceOrder from "./pages/PlaceOrder";
import Budget from "./pages/Budget";
import Reports from "./pages/Reports";
//import Calendar from "./pages/Calendar";
import Approvals from "./pages/Approvals";
import Coupons from "./pages/Coupons";
import Help from "./pages/Help";
import CurrentOrders from "./pages/CurrentOrders";
import PastOrders from "./pages/PastOrders";
import Program from "./pages/Program";
import RulesByState from "./pages/RulesByState";
import ContactsByState from "./pages/ContactsByState";
import POSClassifications from "./pages/POSClassifications";
import Settings from "./pages/Settings";
import FourOhFour from "./pages/FourOhFour";

import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import themeFile from "./utility/theme.js";

import "./App.css";

//mock data
import programs from "./assets/mockdata/Programs";

const theme = createMuiTheme(themeFile);

const App = () => {
  const dispatch = useDispatch();
  const [currentUser, setCurrentUser] = useState(window.localStorage.getItem("user"));
  const [role, setRole] = useState(undefined)

  const currentRole = useSelector((state) => state.user.role)
  console.log(currentRole)
  console.log(role)
  const handleLogIn = (user) => {
    setRole(user);
  };

  const handleLogout = () => {
    setCurrentUser(null)
    dispatch(removeUser())
    logoutUser();
  };

  useEffect(()=>{
    if (currentUser && currentRole.length > 0) {
      //dispatch(setInitialTableData({ programs, distributors }));
      setRole(currentRole)
      dispatch(getProgramsSuccess({ programs }));
    } else if (currentUser && currentUser.access_token) {
      dispatch(setIsLoading())
      dispatch(fetchUser())
    } else {
      setCurrentUser(null)
    }
  },[dispatch, currentUser, currentRole])

  return (
    <MuiThemeProvider theme={theme}>
      {currentUser && (
        <ScrollNav
          userType={role}
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
            role
          )}
          {handleAuth(
            <Programs path="/programs" />,
            "/programs",
            ["field1", "field2", "super"],
            role
          )}
          {handleAuth(
            <PastOrders path="/orders/past" />,
            "/orders/past",
            ["field1", "field2", "super"],
            role
          )}
          {handleAuth(
            <CurrentOrders path="/orders/open" userType={role}/>,
            "/orders/open",
            ["field1", "field2", "super"],
            role
          )}
          {handleAuth(
            <PlaceOrder path="/order" userType={role} />,
            "/order",
            ["field1", "field2", "super"],
            role
          )}
          {handleAuth(
            <Program path="/program/:programId" userType={role} />,
            "/program",
            ["field1", "field2", "super"],
            role
          )}
          {handleAuth(
            <Coupons path="/coupons" />,
            "/coupons",
            ["field1", "field2", "super"],
            role
          )}
          {handleAuth(
            <Reports path="/reports" />,
            "/reports",
            ["super"],
            role
          )}
          {handleAuth(
            <Budget path="/budget" />,
            "/budget",
            ["field1", "field2", "super"],
            role
          )}
          {handleAuth(
            <Approvals path="/approval" />,
            "/approval",
            ["compliance", "super"],
            role
          )}
          {handleAuth(
            <RulesByState path="/rules" />,
            "/rules",
            ["compliance", "super"],
            role
          )}
          {handleAuth(
            <ContactsByState path="/compliance-contacts" />,
            "/compliance-contacts",
            ["compliance", "super"],
            role
          )}
          {handleAuth(
            <POSClassifications path="/classifications" />,
            "/classifications",
            ["compliance", "super"],
            role
          )}
          {handleAuth(
            <Settings path="/settings" userType={role} />,
            "/settings",
            ["field1", "field2", "compliance", "super"],
            role
          )}
          {/* <Calendar path="/calendar" /> */}
          {handleAuth(
            <Help path="/help" />,
            "/help",
            ["field1", "field2", "compliance", "super"],
            role
          )}
          <FourOhFour default path="/whoops" />
          {!role && (
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

const handleAuth = (component, path, users, role) => {
  if (users.includes(role)) {
    return component;
  } else if (!role) {
    return <Redirect noThrow from={path} to="/login" />
  } else return <Redirect noThrow from={path} to="/whoops" />;
};
