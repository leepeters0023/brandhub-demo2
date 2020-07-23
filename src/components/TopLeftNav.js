import React from "react";
import BrandHubLogo from "../assets/brandhub.svg";

import CartModal from "./CartModal";
import Notifications from "./Notifications";
import SideDrawer from "./Navigation/SideDrawer";

import AppBar from "@material-ui/core/AppBar";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Drawer from "@material-ui/core/Drawer";
import { makeStyles } from "@material-ui/core/styles";

import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex"
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  toolBar: {
    width: "100%",
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  drawer: {
    width: 75,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 75,
    padding: 5,
    display: "flex",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
    marginLeft: "15px",
  },
  navBreak: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    margin: "0",
  },
  search: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}));

const TopLeftNav = ({ handleLogout, userType }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.toolBar}>
        <div className={classes.navBreak}>
          <img src={BrandHubLogo} alt="Logo" />
        </div>
        <div className={classes.search}>
          <div className={classes.navBreak}>
            <IconButton>
              <SearchIcon fontSize="large" />
            </IconButton>
            <TextField
              size="small"
              color="primary"
              variant="outlined"
              margin="normal"
              id="search"
              label="Search"
              name="search"
            />
          </div>
        </div>
        <div className={classes.navBreak}>
          <Divider orientation="vertical" flexItem />
          {userType !== "compliance" && <CartModal />}
          <Notifications />
          <Avatar className={classes.avatar}>JD</Avatar>
        </div>
        </Toolbar>
      </AppBar>
      <Drawer 
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <SideDrawer handleLogout={handleLogout} userType={userType}  />
      </Drawer>
    </div>
  );
};

export default TopLeftNav;
