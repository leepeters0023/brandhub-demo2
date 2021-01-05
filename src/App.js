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
axios.defaults.timeout = 10000;

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
  const currentTerritory = useSelector((state) => state.user.territories[0]);
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
  }, [dispatch]);

  const handleTimeout = useCallback(() => {
    handleLogout();
    navigate("/");
  }, [handleLogout])

  useEffect(() => {
    const fetchCurrentUser = async (token) => {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await dispatch(fetchUser());
    };

    if (currentUser && currentRole.length > 0) {
      //setRole(currentRole);
      if (currentRole !== "supplier") {
        dispatch(fetchInitialPrograms(currentTerritory.id));
        dispatch(
          fetchPreOrders(currentUserId, "initial", null, currentTerritory.id)
        );
        dispatch(fetchCurrentOrderByType("inStock", currentUserId));
        dispatch(fetchCurrentOrderByType("onDemand", currentUserId));
        dispatch(fetchAllItemTypes());
        dispatch(fetchAllSuppliers());
        dispatch(fetchTerritories());
        dispatch(fetchStates());
        dispatch(fetchBUs());
        dispatch(fetchWarehouse());
      } else {
        dispatch(clearPrograms());
      }
    } else if (currentUser && JSON.parse(currentUser).access_token) {
      console.log(new Date(JSON.parse(currentUser).expires_in).toDateString());
      if (new Date(JSON.parse(currentUser).expires_in) < new Date()) {
        handleLogout();
        navigate("/oauth");
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
      console.log("clearing");
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
    handleLogout();
  }

  if (!loggedIn && !currentUser) {
    return (
      <MuiThemeProvider theme={theme}>
        {/* <Redirect noThrow to="/login" /> */}
        {/* {!link && <Redirect noThrow to="/oauth/initial" />} */}
        <Router>
          {/* <LogIn setAuth={handleLogIn} path="/login" /> */}
          <Landing path="/" />
          <AuthOLanding path="/oauth" />
          <AuthOLanding path="/oauth/:code" />
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
        <TopDrawerNav
          userType={currentRole}
          handleLogout={handleLogout}
          handleCouponModal={handleCouponModal}
        />
        <Loading partial={true} />
      </MuiThemeProvider>
    );
  }

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
      <CouponsModal
        handleCouponModal={handleCouponModal}
        couponsOpen={couponsOpen}
      />
      <div
        id="main-container"
        style={{ marginLeft: filtersOpen ? "300px" : "0px" }}
      >
        {window.location.pathname.includes("/oauth") && (
          <Redirect noThrow to="/dashboard" />
        )}

        <Router primary={false} style={{ backgroundColor: "#ffffff" }}>
          <Landing path="/" />
          <Dashboard
            path="/dashboard"
            userType={currentRole}
            handleFiltersClosed={handleFiltersClosed}
          />
          <SharedItems
            handleFiltersClosed={handleFiltersClosed}
            path="/shared/items/:itemIds"
          />
          {handleAuth(
            <Programs
              path="/programs"
              userType={currentRole}
              handleFilterDrawer={setFiltersOpen}
              filtersOpen={filtersOpen}
            />,
            "/programs",
            ["field1", "field2", "purchaser", "super"],
            currentRole
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
            currentRole
          )}
          {handleAuth(
            <Program
              path="/program/:programId"
              userType={currentRole}
              handleFiltersClosed={handleFiltersClosed}
            />,
            "/program",
            ["field1", "field2", "purchaser", "super"],
            currentRole
          )}
          {handleAuth(
            <CurrentPreOrder
              path="/orders/open/preorder"
              handleFiltersClosed={handleFiltersClosed}
            />,
            "/orders/open/preorder",
            ["field1", "field2", "purchaser", "super"],
            currentRole
          )}
          {handleAuth(
            <CurrentOrderDetail
              path="/orders/open/:orderId"
              userType={currentRole}
              handleFiltersClosed={handleFiltersClosed}
            />,
            "/orders/open",
            ["field1", "field2", "purchaser", "super"],
            currentRole
          )}
          {handleAuth(
            <PlaceInStockOrder
              path="/orders/items/inStock"
              userType={currentRole}
              handleFilterDrawer={setFiltersOpen}
              filtersOpen={filtersOpen}
            />,
            "/orders/items/inStock",
            ["field1", "field2", "purchaser", "super"],
            currentRole
          )}
          {handleAuth(
            <PlaceOnDemandOrder
              path="/orders/items/onDemand"
              userType={currentRole}
              handleFilterDrawer={setFiltersOpen}
              filtersOpen={filtersOpen}
            />,
            "/orders/items/onDemand",
            ["field1", "field2", "purchaser", "super"],
            currentRole
          )}
          {handleAuth(
            <RFQRollup
              path="/purchasing/rfqRollup"
              handleFilterDrawer={setFiltersOpen}
              filtersOpen={filtersOpen}
            />,
            "/purchasing/rfqRollup",
            ["field2", "purchaser", "super"],
            currentRole
          )}
          {handleAuth(
            <RFQ
              path="/purchasing/rfq"
              handleFiltersClosed={handleFiltersClosed}
            />,
            "/purchasing/rfq",
            ["field2", "purchaser", "super", "supplier"],
            currentRole
          )}
          {handleAuth(
            <RFQHistory
              path="/purchasing/rfqHistory/:filterOption"
              handleFilterDrawer={setFiltersOpen}
              filtersOpen={filtersOpen}
            />,
            "/purchasing/rfqHistory",
            ["field2", "purchaser", "super", "supplier"],
            currentRole
          )}
          {handleAuth(
            <PurchaseOrderRollup
              path="/purchasing/poRollup"
              handleFilterDrawer={setFiltersOpen}
              filtersOpen={filtersOpen}
            />,
            "/purchasing/poRollup",
            ["field2", "purchaser", "super"],
            currentRole
          )}
          {handleAuth(
            <PurchaseOrder
              path="/purchasing/purchaseOrder"
              handleFiltersClosed={handleFiltersClosed}
            />,
            "/purchasing/purchaseOrder",
            ["field2", "purchaser", "super", "supplier"],
            currentRole
          )}
          {handleAuth(
            <PurchaseOrderHistory
              path="/purchasing/poHistory/:filterOption"
              handleFilterDrawer={setFiltersOpen}
              filtersOpen={filtersOpen}
            />,
            "/purchasing/poHistory",
            ["field2", "purchaser", "super", "supplier"],
            currentRole
          )}
          {handleAuth(
            <SingleOrder
              path="/orders/history/:orderId"
              handleFiltersClosed={handleFiltersClosed}
            />,
            "/orders/history",
            ["field1", "field2", "purchaser", "super"],
            currentRole
          )}
          {handleAuth(
            <OrderHistory
              path="/orders/history/group/:filterOption"
              userType={currentRole}
              handleFilterDrawer={setFiltersOpen}
              filtersOpen={filtersOpen}
            />,
            "/orders/history",
            ["field1", "field2", "purchaser", "super"],
            currentRole
          )}
          {handleAuth(
            <OrderApprovals
              path="/orders/approvals"
              userType={currentRole}
              handleFilterDrawer={setFiltersOpen}
              filtersOpen={filtersOpen}
            />,
            "/orders/approvals",
            ["field2", "purchaser", "super"],
            currentRole
          )}
          {handleAuth(
            <Rollup
              path="/rollup"
              handleFilterDrawer={setFiltersOpen}
              filtersOpen={filtersOpen}
            />,
            "/rollup",
            ["field2", "purchaser", "super"],
            currentRole
          )}
          {handleAuth(
            <CurrentOrderDetail
              path="/rollup/detail/:orderId"
              handleFiltersClosed={handleFiltersClosed}
            />,
            "/rollup/detail",
            ["field2", "purchaser", "super"],
            currentRole
          )}
          {handleAuth(
            <Coupons
              path="/coupons"
              handleFiltersClosed={handleFiltersClosed}
            />,
            "/coupons",
            ["field1", "field2", "purchaser", "super"],
            currentRole
          )}
          {handleAuth(
            <ItemCatalog
              path="/items/:catalogType"
              userType={currentRole}
              handleFilterDrawer={setFiltersOpen}
              filtersOpen={filtersOpen}
            />,
            "/items",
            ["field1", "field2", "compliance", "purchaser", "super"],
            currentRole
          )}
          {handleAuth(
            <PendingCompliance
              path="/compliance/pending/:itemId"
              handleFiltersClosed={handleFiltersClosed}
            />,
            "/compliance/pending",
            ["field2", "compliance", "purchaser", "super"],
            currentRole
          )}
          {handleAuth(
            <ComplianceContacts
              path="/compliance/contacts"
              userType={currentRole}
              handleFiltersClosed={handleFiltersClosed}
            />,
            "/compliance/contacts",
            ["field2", "compliance", "purchaser", "super"],
            currentRole
          )}
          {handleAuth(
            <ComplianceItems
              path="/compliance/items"
              handleFilterDrawer={setFiltersOpen}
              filtersOpen={filtersOpen}
            />,
            "/orders/items/onDemand",
            ["field1", "field2", "compliance", "super"],
            currentRole
          )}
          {handleAuth(
            <ComplianceRules
              path="/compliance/rules"
              handleFilterDrawer={setFiltersOpen}
              filtersOpen={filtersOpen}
            />,
            "/orders/items/onDemand",
            ["field1", "field2", "compliance", "super"],
            currentRole
          )}
          {handleAuth(
            <BudgetVsSpend
              path="/budgets/ytod"
              handleFilterDrawer={setFiltersOpen}
              filtersOpen={filtersOpen}
            />,
            "/budgets/ytod",
            ["field2", "purchaser", "super"],
            currentRole
          )}
          {handleAuth(
            <Profile
              path="/profile"
              userType={currentRole}
              handleFiltersClosed={handleFiltersClosed}
            />,
            "/profile",
            ["field1", "field2", "compliance", "purchaser", "super"],
            currentRole
          )}
          {handleAuth(
            <Settings
              path="/settings"
              userType={currentRole}
              handleFiltersClosed={handleFiltersClosed}
            />,
            "/settings",
            ["field1", "field2", "compliance", "purchaser", "super"],
            currentRole
          )}
          {handleAuth(
            <ReportWrapUp
              path="/reports/wrap-up"
              handleFiltersClosed={handleFiltersClosed}
            />,
            "/reports/wrap-up",
            ["field1", "field2", "purchaser", "super"],
            currentRole
          )}
          {handleAuth(
            <Help path="/help" handleFiltersClosed={handleFiltersClosed} />,
            "/help",
            [],
            currentRole
          )}
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
