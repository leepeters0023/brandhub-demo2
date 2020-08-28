import React, { useState, useEffect } from "react";
import { Router, Redirect } from "@reach/router";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";

import { logoutUser } from "./api/userApi";

import { removeUser, fetchUser } from "./redux/slices/userSlice";
import { fetchInitialPrograms, setIsLoading } from "./redux/slices/programsSlice";

import LogIn from "./components/Login";
import ScrollNav from "./components/Navigation/ScrollNav";
import Dashboard from "./pages/Dashboard";
import Programs from "./pages/Programs";
//import PlaceOrder from "./pages/PlaceOrder";
import PlaceInStockOrder from "./pages/PlaceInStockOrder";
import PlaceOnDemandOrder from "./pages/PlaceOnDemandOrder";
import Budget from "./pages/Budget";
import Reports from "./pages/Reports";
//import Calendar from "./pages/Calendar";
import Approvals from "./pages/Approvals";
import Coupons from "./pages/Coupons";
import Help from "./pages/Help";
//import CurrentOrders from "./pages/CurrentOrders";
import CurrentPreOrder from "./pages/CurrentPreOrder";
import CurrentInStockOrder from "./pages/CurrentInStockOrder";
import CurrentOnDemandOrder from "./pages/CurrentOnDemandOrder";
//import PastOrders from "./pages/PastOrders";
import OrderHistory from "./pages/OrderHistory";
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

axios.defaults.headers.get["Cache-Control"] = "no-cache";

const theme = createMuiTheme(themeFile);

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const App = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [currentUser, setCurrentUser] = useState(
    window.localStorage.getItem("brandhub-user")
  );
  const [role, setRole] = useState(
    window.localStorage.getItem("brandhub-role")
  );

  const currentRole = useSelector((state) => state.user.role);
  const currentTerritory = useSelector((state) => state.user.territories[0])
  const isLoading = useSelector((state) => state.user.isLoading);
  const programsIsLoading = useSelector((state) => state.programs.isLoading);
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
      setRole(currentRole);
      dispatch(fetchInitialPrograms(currentTerritory.id))
    } else if (currentUser && JSON.parse(currentUser).access_token) {
      dispatch(setIsLoading())
      fetchCurrentUser(JSON.parse(currentUser).access_token);
    } else {
      setCurrentUser(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, currentUser, currentRole, loggedIn]);

  useEffect(() => {
    if (loggedIn && !currentUser) {
      setCurrentUser(window.localStorage.getItem("brandhub-user"));
    }
  }, [loggedIn, currentUser]);

  if (isLoading || programsIsLoading) {
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
            <Programs path="/programs" userType={role} />,
            "/programs",
            ["field1", "field2", "super"],
            role
          )}
          {/* {handleAuth(
            <PastOrders path="/orders/past" />,
            "/orders/past",
            ["field1", "field2", "super"],
            role
          )} */}
          {/* {handleAuth(
            <CurrentOrders path="/orders/open" userType={role} />,
            "/orders/open",
            ["field1", "field2", "super"],
            role
          )} */}
          {handleAuth(
            <CurrentPreOrder path="/orders/open/preorder" userType={role} />,
            "/orders/open/preorder",
            ["field1", "field2", "super"],
            role
          )}
          {handleAuth(
            <CurrentInStockOrder path="/orders/open/instock" userType={role} />,
            "/orders/open/instock",
            ["field1", "field2", "super"],
            role
          )}
          {handleAuth(
            <CurrentOnDemandOrder path="/orders/open/ondemand" userType={role} />,
            "/orders/open/ondemand",
            ["field1", "field2", "super"],
            role
          )}
          {/* {handleAuth(
            <PlaceOrder path="/order" userType={role} />,
            "/order",
            ["field1", "field2", "super"],
            role
          )} */}
          {handleAuth(
            <PlaceInStockOrder path="/orders/items/instock" userType={role} />,
            "/orders/items/instock",
            ["field1", "field2", "super"],
            role
          )}
          {handleAuth(
            <PlaceOnDemandOrder path="/orders/items/ondemand" userType={role} />,
            "/orders/items/ondemand",
            ["field1", "field2", "super"],
            role
          )}
          {handleAuth(
            <OrderHistory path="/orders/history" userType={role} />,
            "/orders/history",
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
  );
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
