import React from "react";
import BrandHubLogo from "../assets/brandhub.svg";

import CartModal from "./CartModal";
import Notifications from "./Notifications";

import AppBar from "@material-ui/core/AppBar";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";

import SearchIcon from "@material-ui/icons/Search";
import MenuIcon from "@material-ui/icons/Menu";

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
    marginLeft: "15px",
  },
  navBreak: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    margin: "0 20px 0 20px",
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

const TopNav = ({ drawerOpen, handleDrawer, userType }) => {
  const classes = useStyles();
  return (
    <>
      <AppBar className={classes.appBar}>
        <div className={classes.navBreak}>
          <Tooltip title="Navigate">
            <IconButton
              onClick={() => {
                handleDrawer(!drawerOpen);
              }}
            >
              <MenuIcon fontSize="large" color="primary" />
            </IconButton>
          </Tooltip>
          <img src={BrandHubLogo} className={classes.logo} alt="Logo" />
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
      </AppBar>
    </>
  );
};

export default TopNav;
