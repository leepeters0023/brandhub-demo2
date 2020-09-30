import React, { useState } from "react";
import Logo from "../../assets/RTA_Logo_Stacked.png";
import { Link } from "@reach/router";
import { useSelector } from "react-redux";

import UserNav from "./UserNav";
import RegionSelector from "../Utility/RegionSelector";

import Drawer from "@material-ui/core/Drawer";
import Tooltip from "@material-ui/core/Tooltip";
import Backdrop from "@material-ui/core/Backdrop";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  drawer: {
    height: "300px",
    flexShrink: 0,
    whiteSpace: "nowrap",
    width: "100vw",
    position: "fixed",
    top: "0",
    zIndex: "10000"
  },
  drawerOpen: {
    transition: theme.transitions.create("height", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    height: "300px"
  },
  drawerClose: {
    transition: theme.transitions.create("height", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowY: "hidden",
    height: "87px",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  logoLink: {
    filter: "brightness(0%)",
    height: "58px",
    width: "auto",
    marginLeft: "20px",
    marginRight: "20px",
    marginTop: "5px",
    "&&:hover": {
      cursor: "pointer",
    },
  },
  navigationText: {
    margin: "0 20px",
    "&&:hover": {
      textDecoration: "underline",
      textDecorationColor: theme.palette.primary.dark,
      cursor: "pointer",
    }
  },
  navBreak: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    margin: "0",
  },
}));

const TopDrawerNav = ({handleLogout}) => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const initials = useSelector((state) => state.user.initials);
  const role = useSelector((state) => state.user.role);
  const territories = useSelector((state) => state.user.territories)

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
      {open && <Backdrop style={{zIndex: "9999"}} open={true} />}
      <Drawer
        variant="permanent"
        anchor="top"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
        onMouseLeave={handleDrawerClose}
      >
        <div
          style={{
            display: "flex",
            width: "Calc(100% - 50px)",
            padding: "10px 25px",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div className={classes.navBreak}>
            <Tooltip title="Home">
              <Link to="/">
                <img
                  src={Logo}
                  alt="Logo"
                  className={classes.logoLink}
                  style={{ filter: "brightness(0%)" }}
                />
              </Link>
            </Tooltip>
            <Typography className={clsx(classes.titleText, classes.navigationText)} onMouseEnter={handleDrawerOpen}>
              Assets
            </Typography>
            <Typography className={clsx(classes.titleText, classes.navigationText)} onMouseEnter={handleDrawerOpen}>
              Orders
            </Typography>
            <Typography className={clsx(classes.titleText, classes.navigationText)} onMouseEnter={handleDrawerOpen}>
              Fulfillment
            </Typography>
          </div>
          <div className={classes.navBreak}>
              {/* {(role === "super" || role === "field2") && <UserSelector />} */}
              {territories.length > 1 && <RegionSelector />}
              <UserNav
                initials={initials}
                handleLogout={handleLogout}
              />
            </div>
        </div>
      </Drawer>
    </>
  );
};

export default TopDrawerNav;
