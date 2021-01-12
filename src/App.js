import React, { useState, useEffect, useCallback } from "react";
import { Router, Redirect } from "@reach/router";
import axios from "axios";
import Helmet from 'react-helmet';
import { useDispatch, useSelector } from "react-redux";

import { logoutUser } from "./api/userApi";

import { fetchWarehouse, resetAddresses } from "./redux/slices/addressSlice";
import { removeUser, fetchUser } from "./redux/slices/userSlice";
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
import Loading from "./components/Utility/Loading";
import LogIn from "./components/Login";
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

const isProd = process.env.NODE_ENV === 'production';

const App = () => {
  const dispatch = useDispatch();
  const [currentUser, setCurrentUser] = useState(
    window.localStorage.getItem("brandhub-user")
  );
  const [role, setRole] = useState(
    window.localStorage.getItem("brandhub-role")
  );
  const [filtersOpen, setFiltersOpen] = useCallback(useState(false));
  const [couponsOpen, setCouponsOpen] = useCallback(useState(false));

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

  const handleFiltersClosed = () => {
    setFiltersOpen(false);
  };

  const handleCouponModal = () => {
    setCouponsOpen(!couponsOpen);
  };

  const handleLogout = () => {
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
  };

  useEffect(() => {
    const fetchCurrentUser = async (token) => {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await dispatch(fetchUser());
    };

    if (currentUser && currentRole.length > 0) {
      setRole(currentRole);
      if (currentRole !== "supplier") {
        dispatch(fetchInitialPrograms(currentTerritory.id));
        dispatch(fetchPreOrders(currentUserId, "initial", null, currentTerritory.id));
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
        <TopDrawerNav
          userType={role}
          handleLogout={handleLogout}
          handleCouponModal={handleCouponModal}
        />
        <Loading partial={true} />
      </MuiThemeProvider>
    );
  }

  return (
    <MuiThemeProvider theme={theme}>
      <Helmet>
        <meta charset="utf-8" />
        <title>Ready to Activate</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="logo192.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="insight-app-sec-validation" content="aced815d-d550-4d28-87ed-4b8d32c32430" />
        {isProd && (
            <script type="text/javascript">{`!function(e,t,n){function a(){var e=t.getElementsByTagName("script")[0],n=t.createElement("script");n.type="text/javascript",n.async=!0,n.src="https://beacon-v2.helpscout.net",e.parentNode.insertBefore(n,e)}if(e.Beacon=n=function(t,n,a){e.Beacon.readyQueue.push({method:t,options:n,data:a})},n.readyQueue=[],"complete"===t.readyState)return a();e.attachEvent?e.attachEvent("onload",a):e.addEventListener("load",a,!1)}(window,document,window.Beacon||function(){});window.Beacon('init', '521f5954-7022-46e2-9707-6a82501f23e7')`}</script>
        )}
      </Helmet>
      {loggedIn && (
        <TopDrawerNav
          userType={role}
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
        {window.location.pathname === "/login" && <Redirect noThrow to="/" />}

        <Router primary={false} style={{ backgroundColor: "#ffffff" }}>
          <Dashboard
            path="/"
            userType={role}
            handleFiltersClosed={handleFiltersClosed}
          />
          <SharedItems
            handleFiltersClosed={handleFiltersClosed}
            path="/shared/items/:itemIds"
          />
          {handleAuth(
            <Programs
              path="/programs"
              userType={role}
              handleFilterDrawer={setFiltersOpen}
              filtersOpen={filtersOpen}
            />,
            "/programs",
            ["field1", "field2", "purchaser", "super"],
            role
          )}
          {handleAuth(
            <ProgramNew
              path="/programs/new"
              userType={role}
              handleFilterDrawer={setFiltersOpen}
              filtersOpen={filtersOpen}
            />,
            "/programs",
            ["field1", "field2", "purchaser", "super"],
            role
          )}
          {handleAuth(
            <Program
              path="/program/:programId"
              userType={role}
              handleFiltersClosed={handleFiltersClosed}
            />,
            "/program",
            ["field1", "field2", "purchaser", "super"],
            role
          )}
          {handleAuth(
            <CurrentPreOrder
              path="/orders/open/preorder"
              handleFiltersClosed={handleFiltersClosed}
            />,
            "/orders/open/preorder",
            ["field1", "field2", "purchaser", "super"],
            role
          )}
          {handleAuth(
            <CurrentOrderDetail
              path="/orders/open/:orderId"
              userType={role}
              handleFiltersClosed={handleFiltersClosed}
            />,
            "/orders/open",
            ["field1", "field2", "purchaser", "super"],
            role
          )}
          {handleAuth(
            <PlaceInStockOrder
              path="/orders/items/inStock"
              userType={role}
              handleFilterDrawer={setFiltersOpen}
              filtersOpen={filtersOpen}
            />,
            "/orders/items/inStock",
            ["field1", "field2", "purchaser", "super"],
            role
          )}
          {handleAuth(
            <PlaceOnDemandOrder
              path="/orders/items/onDemand"
              userType={role}
              handleFilterDrawer={setFiltersOpen}
              filtersOpen={filtersOpen}
            />,
            "/orders/items/onDemand",
            ["field1", "field2", "purchaser", "super"],
            role
          )}
          {handleAuth(
            <RFQRollup
              path="/purchasing/rfqRollup"
              handleFilterDrawer={setFiltersOpen}
              filtersOpen={filtersOpen}
            />,
            "/purchasing/rfqRollup",
            ["field2", "purchaser", "super"],
            role
          )}
          {handleAuth(
            <RFQ
              path="/purchasing/rfq"
              handleFiltersClosed={handleFiltersClosed}
            />,
            "/purchasing/rfq",
            ["field2", "purchaser", "super", "supplier"],
            role
          )}
          {handleAuth(
            <RFQHistory
              path="/purchasing/rfqHistory/:filterOption"
              handleFilterDrawer={setFiltersOpen}
              filtersOpen={filtersOpen}
            />,
            "/purchasing/rfqHistory",
            ["field2", "purchaser", "super", "supplier"],
            role
          )}
          {handleAuth(
            <PurchaseOrderRollup
              path="/purchasing/poRollup"
              handleFilterDrawer={setFiltersOpen}
              filtersOpen={filtersOpen}
            />,
            "/purchasing/poRollup",
            ["field2", "purchaser", "super"],
            role
          )}
          {handleAuth(
            <PurchaseOrder
              path="/purchasing/purchaseOrder"
              handleFiltersClosed={handleFiltersClosed}
            />,
            "/purchasing/purchaseOrder",
            ["field2", "purchaser", "super", "supplier"],
            role
          )}
          {handleAuth(
            <PurchaseOrderHistory
              path="/purchasing/poHistory/:filterOption"
              handleFilterDrawer={setFiltersOpen}
              filtersOpen={filtersOpen}
            />,
            "/purchasing/poHistory",
            ["field2", "purchaser", "super", "supplier"],
            role
          )}
          {handleAuth(
            <SingleOrder
              path="/orders/history/:orderId"
              handleFiltersClosed={handleFiltersClosed}
            />,
            "/orders/history",
            ["field1", "field2", "purchaser", "super"],
            role
          )}
          {handleAuth(
            <OrderHistory
              path="/orders/history/group/:filterOption"
              userType={role}
              handleFilterDrawer={setFiltersOpen}
              filtersOpen={filtersOpen}
            />,
            "/orders/history",
            ["field1", "field2", "purchaser", "super"],
            role
          )}
          {handleAuth(
            <OrderApprovals
              path="/orders/approvals"
              userType={role}
              handleFilterDrawer={setFiltersOpen}
              filtersOpen={filtersOpen}
            />,
            "/orders/approvals",
            ["field2", "purchaser", "super"],
            role
          )}
          {handleAuth(
            <Rollup
              path="/rollup"
              handleFilterDrawer={setFiltersOpen}
              filtersOpen={filtersOpen}
            />,
            "/rollup",
            ["field2", "purchaser", "super"],
            role
          )}
          {handleAuth(
            <CurrentOrderDetail
              path="/rollup/detail/:orderId"
              handleFiltersClosed={handleFiltersClosed}
            />,
            "/rollup/detail",
            ["field2", "purchaser", "super"],
            role
          )}
          {handleAuth(
            <Coupons
              path="/coupons"
              handleFiltersClosed={handleFiltersClosed}
            />,
            "/coupons",
            ["field1", "field2", "purchaser", "super"],
            role
          )}
          {handleAuth(
            <ItemCatalog
              path="/items/:catalogType"
              userType={role}
              handleFilterDrawer={setFiltersOpen}
              filtersOpen={filtersOpen}
            />,
            "/items",
            ["field1", "field2", "compliance", "purchaser", "super"],
            role
          )}
          {handleAuth(
            <PendingCompliance
              path="/compliance/pending/:itemId"
              handleFiltersClosed={handleFiltersClosed}
            />,
            "/compliance/pending",
            ["field2", "compliance", "purchaser", "super"],
            role
          )}
          {handleAuth(
            <ComplianceContacts
              path="/compliance/contacts"
              userType={role}
              handleFiltersClosed={handleFiltersClosed}
            />,
            "/compliance/contacts",
            ["field2", "compliance", "purchaser", "super"],
            role
          )}
          {handleAuth(
            <ComplianceItems
              path="/compliance/items"
              handleFilterDrawer={setFiltersOpen}
              filtersOpen={filtersOpen}
            />,
            "/orders/items/onDemand",
            ["field1", "field2", "compliance", "super"],
            role
          )}
          {handleAuth(
            <ComplianceRules
              path="/compliance/rules"
              handleFilterDrawer={setFiltersOpen}
              filtersOpen={filtersOpen}
            />,
            "/orders/items/onDemand",
            ["field1", "field2", "compliance", "super"],
            role
          )}
          {handleAuth(
            <BudgetVsSpend
              path="/budgets/ytod"
              handleFilterDrawer={setFiltersOpen}
              filtersOpen={filtersOpen}
            />,
            "/budgets/ytod",
            ["field1", "field2", "purchaser", "super"],
            role
          )}
          {handleAuth(
            <Profile
              path="/profile"
              userType={role}
              handleFiltersClosed={handleFiltersClosed}
            />,
            "/profile",
            ["field1", "field2", "compliance", "purchaser", "super"],
            role
          )}
          {handleAuth(
            <Settings
              path="/settings"
              userType={role}
              handleFiltersClosed={handleFiltersClosed}
            />,
            "/settings",
            ["field1", "field2", "compliance", "purchaser", "super"],
            role
          )}
          {handleAuth(
            <ReportWrapUp
              path="/reports/wrap-up"
              handleFiltersClosed={handleFiltersClosed}
            />,
            "/reports/wrap-up",
            ["field1", "field2", "purchaser", "super"],
            role
          )}
          {handleAuth(
            <Help path="/help" handleFiltersClosed={handleFiltersClosed} />,
            "/help",
            [],
            role
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
