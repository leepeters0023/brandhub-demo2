import React from "react";
import BrandHubLogo from "../assets/brandhub.svg";

import AppBar from "@material-ui/core/AppBar";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";

import NotificationsIcon from "@material-ui/icons/Notifications";
import SearchIcon from "@material-ui/icons/Search";
import MenuIcon from "@material-ui/icons/Menu";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
  },
  navBreak: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    margin: "0 20px 0 20px",
  },
  cart: {
    margin: "0 10px",
  },
  notification: {
    marginRight: "15px",
  },
  search: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  logo: {
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
}));

const TopNav = ({
  drawerOpen,
  notificationOpen,
  cartOpen,
  handleDrawer,
  handleNotification,
  handleCart,
}) => {
  const classes = useStyles();
  return (
    <div>
      <AppBar className={classes.appBar}>
        <div className={classes.navBreak}>
          <IconButton
            onClick={() => {
              handleDrawer(!drawerOpen);
            }}
          >
            <MenuIcon fontSize="large" color="primary" />
          </IconButton>
          <img src={BrandHubLogo} className={classes.logo} alt="Logo" />
        </div>
        <div className={classes.search}>
          <div className={classes.navBreak}>
            <IconButton>
              <SearchIcon fontSize="large" />
            </IconButton>
            <TextField
              color="primary"
              variant="outlined"
              margin="normal"
              required
              id="search"
              label="Search"
              name="search"
              autoFocus
            />
          </div>
        </div>
        <div className={classes.navBreak}>
          <Divider orientation="vertical" flexItem />
          <Tooltip title="View Cart">
            <IconButton className={classes.cart}>
              <ShoppingCartIcon fontSize="large" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Notifications">
            <IconButton className={classes.notification}>
              <NotificationsIcon fontSize="large" />
            </IconButton>
          </Tooltip>
          <Avatar className={classes.avatar}>JD</Avatar>
        </div>
      </AppBar>
    </div>
  );
};

export default TopNav;
