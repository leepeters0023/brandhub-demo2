import React, { useState } from "react";
import { Router } from "@reach/router";

import LogIn from "./components/Login";
import TopNav from "./components/TopNav";
import SideDrawer from "./components/SideDrawer";
import Landing from "./pages/Landing";
import Order from "./pages/Order";
import Account from "./pages/Account";
import Budget from "./pages/Budget";
import Reports from "./pages/Reports";
import Calendar from "./pages/Calendar";
import Compliance from "./pages/Compliance";
import Coupons from "./pages/Coupons";
import Help from "./pages/Help";
import OrderPre from "./pages/OrderPre";

import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import Drawer from "@material-ui/core/Drawer";
import themeFile from "./utility/theme.js";

import "./App.css";
import OrderHistory from "./pages/OrderHistory";

const theme = createMuiTheme(themeFile);

const App = () => {
  const [auth, setAuth] = useState(true);
  const [drawerOpen, handleDrawer] = useState(false);
  const [notificationOpen, handleNotification] = useState(false);

  if (!auth) {
    return (
      <MuiThemeProvider theme={theme}>
        <LogIn setAuth={setAuth} />;
      </MuiThemeProvider>
    );
  } else {
    return (
      <MuiThemeProvider theme={theme}>
        <TopNav
          drawerOpen={drawerOpen}
          notificationOpen={notificationOpen}
          handleDrawer={handleDrawer}
          handleNotification={handleNotification}
        />
        <Drawer anchor="left" open={drawerOpen} onClose={() => {handleDrawer(false)}}>
          <SideDrawer handleDrawer={handleDrawer} />
        </Drawer>
        <Router>
          <Landing path="/" />
          <OrderHistory path="/order-history" />
          <Order path="/order" />
          <OrderPre path="/order/pre-order" />
          <Coupons path="/coupons" />
          <Account path="/account" />
          <Budget path="/budget" />
          <Reports path="/reports" />
          <Calendar path="/calendar" />
          <Compliance path="/compliance" />
          <Help path="/help" />
        </Router>
      </MuiThemeProvider>
    )
  }
}

export default App;
