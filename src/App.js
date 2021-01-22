import React, { useState, useEffect, useCallback } from "react";
import { Router, Redirect, navigate } from "@reach/router";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import { logoutUser } from "./api/userApi";

import { fetchWarehouse, resetAddresses } from "./redux/slices/addressSlice";
import {
  removeUser,
  fetchUser,
  setExpires,
  setTimeoutSet,
} from "./redux/slices/userSlice";
import {
  fetchInitialPrograms,
  setIsLoading,
  clearPrograms,
} from "./redux/slices/programsSlice";
import {
  fetchPreOrders,
  clearPreOrderDetail,
} from "./redux/slices/preOrderDetailSlice";
import { clearDistributors } from "./redux/slices/distributorSlice";
import {
  clearCurrentOrder,
  clearItemSelections,
  fetchCurrentOrderByType,
  clearOrderByType,
} from "./redux/slices/currentOrderSlice";
import { resetItems } from "./redux/slices/itemSlice";
import { resetOrderHistory } from "./redux/slices/orderHistorySlice";
import { resetPatchOrders } from "./redux/slices/patchOrderSlice";
import { resetOrderSetHistory } from "./redux/slices/orderSetHistorySlice";
import { fetchAllItemTypes } from "./redux/slices/itemTypeSlice";
import {
  fetchAllSuppliers,
  fetchInitialValues,
  clearSuppliers,
} from "./redux/slices/supplierSlice";
import { fetchBUs } from "./redux/slices/businessUnitSlice";
import { clearOrderSet } from "./redux/slices/orderSetSlice";
import { resetNewProgram } from "./redux/slices/newProgramSlice";
import {
  fetchTerritories,
  fetchStates,
  clearTerritories,
} from "./redux/slices/territorySlice";
import { resetRfqHistory } from "./redux/slices/rfqHistorySlice"
import { resetPoHistory } from "./redux/slices/purchaseOrderHistorySlice";
import { resetComplianceRules } from "./redux/slices/complianceRulesSlice";
import { resetComplianceItems } from "./redux/slices/complianceItemsSlice";
import { clearSharedItems } from "./redux/slices/sharedItemsSlice";

import AuthOLanding from "./pages/AuthOLanding";
import BudgetVsSpend from "./pages/BudgetVsSpend";
import ComplianceContacts from "./pages/ComplianceContacts";
import ComplianceItems from "./pages/ComplianceItems";
import ComplianceRules from "./pages/ComplianceRules";
import Coupons from "./pages/Coupons";
import CouponsModal from "./components/Coupons/CouponModal";
import CurrentOrderDetail from "./pages/CurrentOrderDetail";
import CurrentPreOrder from "./pages/CurrentPreOrder";
import Dashboard from "./pages/Dashboard";
import FilterDrawer from "./components/Filtering/FilterDrawer";
import FourOhFour from "./pages/FourOhFour";
import Help from "./pages/Help";
import ItemCatalog from "./pages/ItemCatalog";
import Landing from "./pages/Landing";
import Loading from "./components/Utility/Loading";
//import LogIn from "./components/Login";
import NewUser from "./pages/NewUser";
import OrderApprovals from "./pages/OrderApprovals";
import OrderHistory from "./pages/OrderHistory";
import PendingCompliance from "./pages/PendingCompliance";
import PlaceInStockOrder from "./pages/PlaceInStockOrder";
import PlaceOnDemandOrder from "./pages/PlaceOnDemandOrder";
import Profile from "./pages/Profile";
import Program from "./pages/Program";
import Programs from "./pages/Programs";
import ProgramNew from "./pages/ProgramNew";
import SharedItems from "./pages/SharedItems";
import PurchaseOrder from "./pages/PurchaseOrder";
import PurchaseOrderHistory from "./pages/PurchaseOrderHistory";
import PurchaseOrderRollup from "./pages/PurchaseOrderRollup";
import ReportWrapUp from "./pages/ReportWrapUp";
import RFQ from "./pages/RFQ";
import RFQHistory from "./pages/RFQHistory";
import RFQRollup from "./pages/RFQRollup";
import Rollup from "./pages/Rollup";
import Settings from "./pages/Settings";
import SingleOrder from "./pages/SingleOrder";
import TopDrawerNav from "./components/Navigation/TopDrawerNav";

import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import themeFile from "./utility/theme.js";

axios.defaults.headers.get["Cache-Control"] = "no-cache";
axios.defaults.timeout = 20000;

const theme = createMuiTheme(themeFile);



const App = () => {
  const dispatch = useDispatch();
  const [currentUser, setCurrentUser] = useState(
    window.localStorage.getItem("brandhub-user")
  );
  const [filtersOpen, setFiltersOpen] = useCallback(useState(false));
  const [couponsOpen, setCouponsOpen] = useCallback(useState(false));
  const [logoutTimeout, setLogoutTimeout] = useCallback(useState(null));

  const currentRole = useSelector((state) => state.user.role);
  const currentUserId = useSelector((state) => state.user.id);
  const reduxExpiresIn = useSelector((state) => state.user.sessionExpire);
  const timeOutSet = useSelector((state) => state.user.timeOutSet);
  const userError = useSelector((state) => state.user.error);
  const territories = useSelector((state) => state.user.territories);
  const currentTerritory = useSelector((state) => state.user.territories[0]);
  const currentMarket = useSelector((state) => state.user.currentMarket);
  const isLoading = useSelector((state) => state.user.isLoading);
  const isPreOrdersLoading = useSelector(
    (state) => state.preOrderDetails.isPreOrdersLoading
  );
  const programsIsLoading = useSelector((state) => state.programs.isLoading);
  const loggedIn = useSelector((state) => state.user.loggedIn);

  const handleFiltersClosed = () => {
    setFiltersOpen(false);
  };

  const handleCouponModal = () => {
    setCouponsOpen(!couponsOpen);
  };

  const handleLogout = useCallback(() => {
    logoutUser();
    setCurrentUser(null);
    dispatch(removeUser());
    dispatch(clearPrograms());
    dispatch(clearPreOrderDetail());
    dispatch(clearDistributors());
    dispatch(clearCurrentOrder());
    dispatch(clearOrderByType({ type: "inStock" }));
    dispatch(clearOrderByType({ type: "onDemand" }));
    dispatch(clearItemSelections());
    dispatch(resetItems());
    dispatch(resetOrderHistory());
    dispatch(resetPatchOrders());
    dispatch(resetOrderSetHistory());
    dispatch(clearOrderSet());
    dispatch(resetNewProgram());
    dispatch(clearTerritories());
    dispatch(clearSuppliers());
    dispatch(resetComplianceItems());
    dispatch(resetComplianceRules());
    dispatch(clearSharedItems());
    dispatch(resetAddresses());
    dispatch(resetRfqHistory());
    dispatch(resetPoHistory());
    navigate("/");
  }, [dispatch]);

  const handleTimeout = useCallback(() => {
    handleLogout();
    navigate("/");
  }, [handleLogout]);

  useEffect(() => {
    const fetchCurrentUser = async (token) => {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await dispatch(fetchUser());
    };

    if (currentUser && currentRole.length > 0) {
      if (currentRole !== "supplier") {
        if (territories.length > 0) {
          let marketBool = currentMarket === "On Premise" ? true : false;
          dispatch(fetchInitialPrograms(currentTerritory.id, marketBool));
          if (currentRole !== "read-only") {
            dispatch(
              fetchPreOrders(
                currentUserId,
                "initial",
                null,
                currentTerritory.id
              )
            );
            dispatch(fetchCurrentOrderByType("inStock", currentUserId));
            dispatch(fetchCurrentOrderByType("onDemand", currentUserId));
          }
          dispatch(fetchAllItemTypes());
          dispatch(fetchAllSuppliers());
          dispatch(fetchTerritories());
          dispatch(fetchStates());
          dispatch(fetchBUs());
          dispatch(fetchWarehouse());
        } else {
          dispatch(clearPrograms());
        }
      } else {
        dispatch(fetchInitialValues());
        dispatch(clearPrograms());
      }
    } else if (currentUser && JSON.parse(currentUser).access_token) {
      if (new Date(JSON.parse(currentUser).expires_in) < new Date()) {
        handleLogout();
        navigate("/login");
      } else {
        dispatch(setIsLoading());
        fetchCurrentUser(JSON.parse(currentUser).access_token);
      }
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

  useEffect(() => {
    if (currentUser && JSON.parse(currentUser).expires_in) {
      if (reduxExpiresIn !== JSON.parse(currentUser).expires_in) {
        dispatch(
          setExpires({
            expires: JSON.parse(currentUser).expires_in,
          })
        );
      }
    }
  }, [reduxExpiresIn, currentUser, dispatch, handleLogout]);

  useEffect(() => {
    if (reduxExpiresIn && !timeOutSet) {
      //TODO handle refresh or ask user to stay logged in??
      dispatch(setTimeoutSet());
      let msToLogout = new Date(reduxExpiresIn) - new Date();
      setLogoutTimeout(setTimeout(handleTimeout, msToLogout));
    }

    return () => {
      clearTimeout(logoutTimeout);
    };
  }, [
    reduxExpiresIn,
    timeOutSet,
    dispatch,
    setLogoutTimeout,
    handleTimeout,
    logoutTimeout,
  ]);

  if (userError) {
    navigate("/whoops");
  }

  if (!loggedIn && !currentUser) {
    return (
      <MuiThemeProvider theme={theme}>
        {!window.location.pathname.includes("/login") && (
          <Redirect noThrow to="/" />
        )}
        {/* {!link && <Redirect noThrow to="/login/initial" />} */}
        <Router>
          {/* <LogIn setAuth={handleLogIn} path="/login" /> */}
          <Landing path="/" />
          <AuthOLanding path="/login" />
          <AuthOLanding path="/login/:code" />
          <FourOhFour default path="/whoops" />
        </Router>
      </MuiThemeProvider>
    );
  } else if (currentUser && (isLoading || isPreOrdersLoading)) {
    return (
      <MuiThemeProvider theme={theme}>
        <Loading partial={false} />;
      </MuiThemeProvider>
    );
  } else if (currentUser && programsIsLoading) {
    return (
      <MuiThemeProvider theme={theme}>
        <TopDrawerNav
          userType={currentRole}
          handleLogout={handleLogout}
          handleCouponModal={handleCouponModal}
        />
        <Loading partial={true} />
      </MuiThemeProvider>
    );
  } else if (
    currentUser &&
    currentRole === "read-only" &&
    territories.length === 0
  ) {
    return (
      <MuiThemeProvider theme={theme}>
        {currentRole === "read-only" && territories.length === 0 && (
          <Redirect noThrow to="/newUser" />
        )}
        <Router>
          <NewUser
            handleFiltersClosed={handleFiltersClosed}
            handleLogout={handleLogout}
            path="/newUser"
          />
          <FourOhFour default path="/whoops" />
        </Router>
      </MuiThemeProvider>
    );
  } else if (currentRole) {
    return (
      <MuiThemeProvider theme={theme}>
        {loggedIn && (
          <TopDrawerNav
            userType={currentRole}
            handleLogout={handleLogout}
            handleCouponModal={handleCouponModal}
          />
        )}
        <FilterDrawer
          open={filtersOpen}
          handleDrawerClose={handleFiltersClosed}
        />
        {couponsOpen && (
          <CouponsModal
            handleCouponModal={handleCouponModal}
            couponsOpen={couponsOpen}
          />
        )}
        <div
          id="main-container"
          style={{ marginLeft: filtersOpen ? "300px" : "0px" }}
        >
          {currentRole === "read-only" && territories.length === 0 && (
            <Redirect noThrow to="/newUser" />
          )}
          {(window.location.pathname === "/" ||
            window.location.pathname.includes("/login")) && (
              <Redirect noThrow to="/dashboard" />
            )}

          <Router primary={false} style={{ backgroundColor: "#ffffff" }}>
            <Landing path="/" />
            {handleAuth(
              <Dashboard
                path="/dashboard"
                userType={currentRole}
                handleFiltersClosed={handleFiltersClosed}
              />,
              "/dashboard",
              ["field1", "field2", "purchaser", "super", "supplier", "read-only"],
              currentRole,
              territories
            )}
            <SharedItems
              handleFiltersClosed={handleFiltersClosed}
              path="/shared/items/:itemIds"
            />
            <NewUser
              handleFiltersClosed={handleFiltersClosed}
              handleLogout={handleLogout}
              path="/newUser"
            />
            {handleAuth(
              <Programs
                path="/programs"
                userType={currentRole}
                handleFilterDrawer={setFiltersOpen}
                filtersOpen={filtersOpen}
              />,
              "/programs",
              ["field1", "field2", "purchaser", "super", "read-only"],
              currentRole,
              territories
            )}
            {handleAuth(
              <ProgramNew
                path="/programs/new"
                userType={currentRole}
                handleFilterDrawer={setFiltersOpen}
                filtersOpen={filtersOpen}
              />,
              "/programs",
              ["field1", "field2", "purchaser", "super"],
              currentRole,
              territories
            )}
            {handleAuth(
              <Program
                path="/program/:programId"
                userType={currentRole}
                handleFiltersClosed={handleFiltersClosed}
              />,
              "/program",
              ["field1", "field2", "purchaser", "super", "read-only"],
              currentRole,
              territories
            )}
            {handleAuth(
              <CurrentPreOrder
                path="/orders/open/preorder"
                handleFiltersClosed={handleFiltersClosed}
              />,
              "/orders/open/preorder",
              ["field1", "field2", "purchaser", "super"],
              currentRole,
              territories
            )}
            {handleAuth(
              <CurrentOrderDetail
                path="/orders/open/:orderId"
                userType={currentRole}
                handleFiltersClosed={handleFiltersClosed}
              />,
              "/orders/open",
              ["field1", "field2", "purchaser", "super"],
              currentRole,
              territories
            )}
            {handleAuth(
              <PlaceInStockOrder
                path="/orders/items/inStock"
                userType={currentRole}
                handleFilterDrawer={setFiltersOpen}
                filtersOpen={filtersOpen}
              />,
              "/orders/items/inStock",
              ["field1", "field2", "purchaser", "super", "read-only"],
              currentRole,
              territories
            )}
            {handleAuth(
              <PlaceOnDemandOrder
                path="/orders/items/onDemand"
                userType={currentRole}
                handleFilterDrawer={setFiltersOpen}
                filtersOpen={filtersOpen}
              />,
              "/orders/items/onDemand",
              ["field1", "field2", "purchaser", "super", "read-only"],
              currentRole,
              territories
            )}
            {handleAuth(
              <RFQRollup
                path="/purchasing/rfqRollup"
                handleFilterDrawer={setFiltersOpen}
                filtersOpen={filtersOpen}
              />,
              "/purchasing/rfqRollup",
              ["field2", "purchaser", "super", "read-only"],
              currentRole,
              territories
            )}
            {handleAuth(
              <RFQ
                path="/purchasing/rfq"
                handleFiltersClosed={handleFiltersClosed}
              />,
              "/purchasing/rfq",
              ["field2", "purchaser", "super", "supplier"],
              currentRole,
              territories
            )}
            {handleAuth(
              <RFQHistory
                path="/purchasing/rfqHistory/:filterOption"
                handleFilterDrawer={setFiltersOpen}
                filtersOpen={filtersOpen}
              />,
              "/purchasing/rfqHistory",
              ["field2", "purchaser", "super", "supplier"],
              currentRole,
              territories
            )}
            {handleAuth(
              <PurchaseOrderRollup
                path="/purchasing/poRollup"
                handleFilterDrawer={setFiltersOpen}
                filtersOpen={filtersOpen}
              />,
              "/purchasing/poRollup",
              ["field2", "purchaser", "super"],
              currentRole,
              territories
            )}
            {handleAuth(
              <PurchaseOrder
                path="/purchasing/purchaseOrder"
                handleFiltersClosed={handleFiltersClosed}
              />,
              "/purchasing/purchaseOrder",
              ["field2", "purchaser", "super", "supplier"],
              currentRole,
              territories
            )}
            {handleAuth(
              <PurchaseOrderHistory
                path="/purchasing/poHistory/:filterOption"
                handleFilterDrawer={setFiltersOpen}
                filtersOpen={filtersOpen}
              />,
              "/purchasing/poHistory",
              ["field2", "purchaser", "super", "supplier"],
              currentRole,
              territories
            )}
            {handleAuth(
              <SingleOrder
                path="/orders/history/:orderId"
                handleFiltersClosed={handleFiltersClosed}
              />,
              "/orders/history",
              ["field1", "field2", "purchaser", "super", "read-only"],
              currentRole,
              territories
            )}
            {handleAuth(
              <OrderHistory
                path="/orders/history/group/:filterOption"
                userType={currentRole}
                handleFilterDrawer={setFiltersOpen}
                filtersOpen={filtersOpen}
              />,
              "/orders/history",
              ["field1", "field2", "purchaser", "super", "read-only"],
              currentRole,
              territories
            )}
            {handleAuth(
              <OrderApprovals
                path="/orders/approvals"
                userType={currentRole}
                handleFilterDrawer={setFiltersOpen}
                filtersOpen={filtersOpen}
              />,
              "/orders/approvals",
              ["field2", "purchaser", "super", "read-only"],
              currentRole,
              territories
            )}
            {handleAuth(
              <Rollup
                path="/rollup"
                handleFilterDrawer={setFiltersOpen}
                filtersOpen={filtersOpen}
              />,
              "/rollup",
              ["field2", "purchaser", "super", "read-only"],
              currentRole,
              territories
            )}
            {handleAuth(
              <CurrentOrderDetail
                path="/rollup/detail/:orderId"
                handleFiltersClosed={handleFiltersClosed}
              />,
              "/rollup/detail",
              ["field2", "purchaser", "super"],
              currentRole,
              territories
            )}
            {handleAuth(
              <Coupons
                path="/coupons"
                handleFiltersClosed={handleFiltersClosed}
              />,
              "/coupons",
              ["field1", "field2", "purchaser", "super"],
              currentRole,
              territories
            )}
            {handleAuth(
              <ItemCatalog
                path="/items/:catalogType"
                userType={currentRole}
                handleFilterDrawer={setFiltersOpen}
                filtersOpen={filtersOpen}
              />,
              "/items",
              [
                "field1",
                "field2",
                "compliance",
                "purchaser",
                "super",
                "read-only",
              ],
              currentRole,
              territories
            )}
            {handleAuth(
              <PendingCompliance
                path="/compliance/pending/:itemId"
                handleFiltersClosed={handleFiltersClosed}
              />,
              "/compliance/pending",
              ["field2", "compliance", "purchaser", "super", "read-only"],
              currentRole,
              territories
            )}
            {handleAuth(
              <ComplianceContacts
                path="/compliance/contacts"
                userType={currentRole}
                handleFiltersClosed={handleFiltersClosed}
              />,
              "/compliance/contacts",
              ["field2", "compliance", "purchaser", "super", "read-only"],
              currentRole,
              territories
            )}
            {handleAuth(
              <ComplianceItems
                path="/compliance/items"
                handleFilterDrawer={setFiltersOpen}
                filtersOpen={filtersOpen}
              />,
              "/orders/items/onDemand",
              ["field1", "field2", "compliance", "super", "read-only", "purchaser"],
              currentRole,
              territories
            )}
            {handleAuth(
              <ComplianceRules
                path="/compliance/rules"
                handleFilterDrawer={setFiltersOpen}
                filtersOpen={filtersOpen}
              />,
              "/orders/items/onDemand",
              ["field1", "field2", "compliance", "super", "read-only"],
              currentRole,
              territories
            )}
            {handleAuth(
              <BudgetVsSpend
                path="/budgets/ytod"
                handleFilterDrawer={setFiltersOpen}
                filtersOpen={filtersOpen}
              />,
              "/budgets/ytod",
              ["field1", "field2", "purchaser", "super", "read-only"],
              currentRole,
              territories
            )}
            {handleAuth(
              <Profile
                path="/profile"
                userType={currentRole}
                handleFiltersClosed={handleFiltersClosed}
              />,
              "/profile",
              ["field1", "field2", "compliance", "purchaser", "super"],
              currentRole,
              territories
            )}
            {handleAuth(
              <Settings
                path="/settings"
                userType={currentRole}
                handleFiltersClosed={handleFiltersClosed}
              />,
              "/settings",
              ["field1", "field2", "compliance", "purchaser", "super"],
              currentRole,
              territories
            )}
            {handleAuth(
              <ReportWrapUp
                path="/reports/wrap-up"
                handleFiltersClosed={handleFiltersClosed}
              />,
              "/reports/wrap-up",
              ["field1", "field2", "purchaser", "super", "read-only"],
              currentRole,
              territories
            )}
            {handleAuth(
              <Help path="/help" handleFiltersClosed={handleFiltersClosed} />,
              "/help",
              [],
              currentRole,
              territories
            )}
            <FourOhFour default path="/whoops" />
          </Router>
        </div>
      </MuiThemeProvider>
    );
  } else
    return (
      <MuiThemeProvider theme={theme}>
        <Loading partial={false} />;
      </MuiThemeProvider>
    );
};

export default App;

const handleAuth = (component, path, users, role, territories) => {
  if (role === "read-only" && territories.length === 0) {
    return <Redirect noThrow from={path} to="/newUser" />;
  }
  if (users.length === 0) {
    return component;
  } else if (users.includes(role)) {
    return component;
  } else if (!role) {
    return <Redirect noThrow from={path} to="/whoops" />;
  } else return <Redirect noThrow from={path} to="/whoops" />;
};
