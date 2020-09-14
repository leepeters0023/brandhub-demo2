import React, { useState, useEffect } from "react";
import { Router, Redirect } from "@reach/router";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";

import { logoutUser } from "./api/userApi";

import { removeUser, fetchUser } from "./redux/slices/userSlice";
import {
  fetchInitialPrograms,
  setIsLoading,
  clearPrograms,
} from "./redux/slices/programsSlice";
import {
  fetchPreOrders,
  resetState,
} from "./redux/slices/programTableSlice";

import Approvals from "./pages/Approvals";
import Budget from "./pages/Budget";
//import Calendar from "./pages/Calendar";
import ContactsByState from "./pages/ContactsByState";
import Coupons from "./pages/Coupons";
import CurrentInStockOrder from "./pages/CurrentInStockOrder";
import CurrentOnDemandOrder from "./pages/CurrentOnDemandOrder";
import CurrentPreOrder from "./pages/CurrentPreOrder";
import Dashboard from "./pages/Dashboard";
import FourOhFour from "./pages/FourOhFour";
import Help from "./pages/Help";
import ItemCatalog from "./pages/ItemCatalog";
import Loading from "./components/Utility/Loading";
import LogIn from "./components/Login";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderHistory from "./pages/OrderHistory";
import PlaceInStockOrder from "./pages/PlaceInStockOrder";
import PlaceOnDemandOrder from "./pages/PlaceOnDemandOrder";
import POSClassifications from "./pages/POSClassifications";
import Program from "./pages/Program";
import Programs from "./pages/Programs";
import Reports from "./pages/Reports";
import RulesByState from "./pages/RulesByState";
import ScrollNav from "./components/Navigation/ScrollNav";
import Settings from "./pages/Settings";
import SingleOrder from "./pages/SingleOrder";

import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import themeFile from "./utility/theme.js";

axios.defaults.headers.get["Cache-Control"] = "no-cache";
axios.defaults.timeout = 5000;

const theme = createMuiTheme(themeFile);

const App = () => {
  const dispatch = useDispatch();
  const [currentUser, setCurrentUser] = useState(
    window.localStorage.getItem("brandhub-user")
  );
  const [role, setRole] = useState(
    window.localStorage.getItem("brandhub-role")
  );

  const currentRole = useSelector((state) => state.user.role);
  const userError = useSelector((state) => state.user.error);
  const currentTerritory = useSelector((state) => state.user.territories[0]);
  const isLoading = useSelector((state) => state.user.isLoading);
  const isPreOrdersLoading = useSelector((state) => state.programTable.isPreOrdersLoading);
  const programsIsLoading = useSelector((state) => state.programs.isLoading);
  const loggedIn = useSelector((state) => state.user.loggedIn);

  const handleLogIn = (user) => {
    setRole(user);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    dispatch(removeUser());
    dispatch(clearPrograms());
    dispatch(resetState());
  };

  useEffect(() => {
    const fetchCurrentUser = async (token) => {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await dispatch(fetchUser());
    };

    if (currentUser && currentRole.length > 0) {
      setRole(currentRole);
      dispatch(fetchInitialPrograms(currentTerritory.id));
      dispatch(fetchPreOrders("initial"));
    } else if (currentUser && JSON.parse(currentUser).access_token) {
      dispatch(setIsLoading());
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

  if (userError) {
    handleLogout();
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

  if (isLoading || isPreOrdersLoading) {
    return (
      <MuiThemeProvider theme={theme}>
        <Loading partial={false} />;
      </MuiThemeProvider>
    );
  }

  if (programsIsLoading) {
    return (
      <MuiThemeProvider theme={theme}>
        <ScrollNav userType={role} handleLogout={handleLogout} />
        <Loading partial={true} />
      </MuiThemeProvider>
    );
  }

  return (
    <MuiThemeProvider theme={theme}>
      {loggedIn && <ScrollNav userType={role} handleLogout={handleLogout} />}
      <div id="main-container">
        {window.location.pathname === "/login" && <Redirect noThrow to="/" />}

        <Router primary={false} style={{ backgroundColor: "#ffffff" }}>
          <Dashboard path="/" />
          {handleAuth(
            <Programs path="/programs" userType={role} />,
            "/programs",
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
            <CurrentOnDemandOrder
              path="/orders/open/ondemand"
              userType={role}
            />,
            "/orders/open/ondemand",
            ["field1", "field2", "super"],
            role
          )}
          {handleAuth(
            <OrderConfirmation
              path="/orders/confirmation/:orderType"
              userType={role}
            />,
            "/orders/confirmation",
            ["field1", "field2", "super"],
            role
          )}
          {handleAuth(
            <PlaceInStockOrder path="/orders/items/instock" userType={role} />,
            "/orders/items/instock",
            ["field1", "field2", "super"],
            role
          )}
          {handleAuth(
            <PlaceOnDemandOrder
              path="/orders/items/ondemand"
              userType={role}
            />,
            "/orders/items/ondemand",
            ["field1", "field2", "super"],
            role
          )}
          {handleAuth(
            <SingleOrder path="/orders/history/:orderId" />,
            "/orders/history",
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
            <Coupons path="/coupons" />,
            "/coupons",
            ["field1", "field2", "super"],
            role
          )}
          {handleAuth(
            <ItemCatalog path="/items" userType={role} />,
            "/items",
            ["field1", "field2", "compliance", "super"],
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
