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
import { fetchPreOrders, resetState } from "./redux/slices/preOrderDetailSlice";
import { clearDistributors } from "./redux/slices/distributorSlice";
import {
  clearCurrentOrder,
  fetchCurrentOrderByType,
} from "./redux/slices/currentOrderSlice";
import { resetItems } from "./redux/slices/itemSlice";
import { resetOrderHistory } from "./redux/slices/orderHistorySlice";
import { resetPatchOrders } from "./redux/slices/patchOrderSlice";
import { resetOrderSetHistory } from "./redux/slices/orderSetHistorySlice";

import Coupons from "./pages/Coupons";
import CurrentOrderDetail from "./pages/CurrentOrderDetail";
import CurrentPreOrder from "./pages/CurrentPreOrder";
import Dashboard from "./pages/Dashboard";
import FilterDrawer from "./components/Utility/FilterDrawer";
import FourOhFour from "./pages/FourOhFour";
import Help from "./pages/Help";
import ItemCatalog from "./pages/ItemCatalog";
import Loading from "./components/Utility/Loading";
import LogIn from "./components/Login";
import OrderApprovals from "./pages/OrderApprovals";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderHistory from "./pages/OrderHistory";
import PlaceInStockOrder from "./pages/PlaceInStockOrder";
import PlaceOnDemandOrder from "./pages/PlaceOnDemandOrder";
import Program from "./pages/Program";
import Programs from "./pages/Programs";
import Reports from "./pages/Reports";
import Rollup from "./pages/Rollup";
// import ScrollNav from "./components/Navigation/ScrollNav";
import Settings from "./pages/Settings";
import SingleOrder from "./pages/SingleOrder";
import TopDrawerNav from "./components/Navigation/TopDrawerNav";

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
  const [filtersOpen, setFiltersOpen] = useState(true);

  const currentRole = useSelector((state) => state.user.role);
  const currentUserId = useSelector((state) => state.user.id);
  const userError = useSelector((state) => state.user.error);
  const currentTerritory = useSelector((state) => state.user.territories[0]);
  const isLoading = useSelector((state) => state.user.isLoading);
  const isPreOrdersLoading = useSelector(
    (state) => state.preOrderDetails.isPreOrdersLoading
  );
  const programsIsLoading = useSelector((state) => state.programs.isLoading);
  const loggedIn = useSelector((state) => state.user.loggedIn);

  const handleLogIn = (user) => {
    setRole(user);
  };

  const handleFiltersOpen = () => {
    setFiltersOpen(true);
  };

  const handleFiltersClosed = () => {
    setFiltersOpen(false);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    dispatch(removeUser());
    dispatch(clearPrograms());
    dispatch(resetState());
    dispatch(clearDistributors());
    dispatch(clearCurrentOrder());
    dispatch(resetItems());
    dispatch(resetOrderHistory());
    dispatch(resetPatchOrders());
    dispatch(resetOrderSetHistory());
  };

  useEffect(() => {
    const fetchCurrentUser = async (token) => {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await dispatch(fetchUser());
    };

    if (currentUser && currentRole.length > 0) {
      setRole(currentRole);
      dispatch(fetchInitialPrograms(currentTerritory.id));
      dispatch(fetchPreOrders(currentUserId, "initial"));
      dispatch(fetchCurrentOrderByType("inStock", currentUserId));
      dispatch(fetchCurrentOrderByType("onDemand", currentUserId));
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
        <TopDrawerNav userType={role} handleLogout={handleLogout} />
        <Loading partial={true} />
      </MuiThemeProvider>
    );
  }

  return (
    <MuiThemeProvider theme={theme}>
      {loggedIn && <TopDrawerNav userType={role} handleLogout={handleLogout} />}
      <FilterDrawer
        open={filtersOpen}
        handleDrawerClose={handleFiltersClosed}
      />
      <div
        id="main-container"
        style={{ marginLeft: filtersOpen ? "300px" : "0px" }}
      >
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
            <CurrentOrderDetail path="/orders/open/:orderId" userType={role} />,
            "/orders/open",
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
            <PlaceInStockOrder path="/orders/items/inStock" userType={role} />,
            "/orders/items/inStock",
            ["field1", "field2", "super"],
            role
          )}
          {handleAuth(
            <PlaceOnDemandOrder
              path="/orders/items/onDemand"
              userType={role}
            />,
            "/orders/items/onDemand",
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
            <OrderApprovals path="/orders/approvals" userType={role} />,
            "/orders/approvals",
            ["field2", "super"],
            role
          )}
          {handleAuth(
            <Rollup path="/rollup" />,
            "/rollup",
            ["field2", "super"],
            role
          )}
          {handleAuth(
            <CurrentOrderDetail path="/rollup/detail/:orderId" />,
            "/rollup/detail",
            ["field2", "super"],
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
