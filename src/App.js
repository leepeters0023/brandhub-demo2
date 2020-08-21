import React, { useState, useEffect } from "react";
import { Router, Redirect } from "@reach/router";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import { getProgramsSuccess } from "./redux/slices/programsSlice";

import { logoutUser } from "./api/userApi";

import { removeUser, fetchUser } from "./redux/slices/userSlice";

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

import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";
import { makeStyles } from "@material-ui/core/styles";

import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import themeFile from "./utility/theme.js";

import "./App.css";

//mock data
import programs from "./assets/mockdata/Programs";

const theme = createMuiTheme(themeFile);

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const App = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [currentUser, setCurrentUser] = useState(
    window.localStorage.getItem("user")
  );
  const [role, setRole] = useState(window.localStorage.getItem("role"));

  const currentRole = useSelector((state) => state.user.role);
  const isLoading = useSelector((state) => state.user.isLoading);
  const loggedIn = useSelector((state) => state.user.loggedIn);

  const handleLogIn = (user) => {
    setRole(user);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    dispatch(removeUser());
  };

  useEffect(() => {
    const fetchCurrentUser = async (token) => {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      await dispatch(fetchUser());
    };

    if (currentUser && currentRole.length > 0) {
      //dispatch(setInitialTableData({ programs, distributors }));
      setRole(currentRole);
      dispatch(getProgramsSuccess({ programs }));
    } else if (currentUser && JSON.parse(currentUser).access_token) {
      fetchCurrentUser(JSON.parse(currentUser).access_token);
    } else {
      setCurrentUser(null);
    }
  }, [dispatch, currentUser, currentRole, loggedIn]);

  useEffect(()=>{
    if (loggedIn && !currentUser) {
      setCurrentUser(window.localStorage.getItem("user"))
    }
  },[loggedIn, currentUser])

  if (isLoading) {
    return (
      <Backdrop className={classes.backdrop} open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (!loggedIn && !currentUser) {
    return (
      <MuiThemeProvider theme={theme}>
        <Redirect noThrow to="/login" />
        <Router>
          <LogIn setAuth={handleLogIn} path="/login" />
        </Router>
      </MuiThemeProvider>
    );
  } 
  return (
    <MuiThemeProvider theme={theme}>
      {loggedIn && <ScrollNav userType={role} handleLogout={handleLogout} />}
      <div id="main-container">
        {window.location.pathname === "/login" && <Redirect noThrow to="/" />}
        <Router primary={false}>
          <Dashboard path="/" />
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
            <CurrentOrders path="/orders/open" userType={role} />,
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
          {handleAuth(<Reports path="/reports" />, "/reports", ["super"], role)}
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
          {handleAuth(<Help path="/help" />, "/help", [], role)}
          <FourOhFour default path="/whoops" />
        </Router>
      </div>
    </MuiThemeProvider>
  )

};

export default App;

const handleAuth = (component, path, users, role) => {
  if (users.length === 0) {
    return component;
  } else if (users.includes(role)) {
    return component;
  } else if (!role) {
    return <Redirect noThrow from={path} to="/whoops" />;
  } else return <Redirect noThrow from={path} to="/whoops" />;
};
