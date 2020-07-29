import React, { useState } from "react";
import BrandHubLogo from "../../assets/brandhub.svg";

import CartModal from "../CartModal";
import Notifications from "../Notifications";
import UserNavMenu from "./UserNavMenu";
import SideDrawer from "./SideDrawer";
import AddressBook from "../AddressBook";
import AccountDetails from "../AccountDetails";

import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Drawer from "@material-ui/core/Drawer";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  toolBar: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.palette.secondary.light
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
    backgroundColor: theme.palette.secondary.dark
  },
  navBreak: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    margin: "0",
  },
}));

const TopLeftNav = ({ handleLogout, userType }) => {
  const classes = useStyles();

  const [userModal, handleUserModal] = useState(false);
  const [userModalType, setUserModalType] = useState("Address Book");

  const handleModalOpen = (type) => {
    setUserModalType(type);
    handleUserModal(true);
  };

  return (
    <>
      <div className={classes.relativeContainer}>
        <Dialog
          open={userModal}
          onClose={() => handleUserModal(false)}
          fullWidth
          maxWidth="lg"
        >
          <IconButton
            className={classes.closeButton}
            onClick={() => {
              handleUserModal(false);
            }}
          >
            <CancelIcon fontSize="large" color="secondary" />
          </IconButton>
          <DialogTitle>
            <Typography className={classes.titleText}>
              {userModalType}
            </Typography>
          </DialogTitle>
          <DialogContent>
            {userModalType === "Address Book" && <AddressBook />}
            {userModalType === "Settings" && <AccountDetails />}
          </DialogContent>
        </Dialog>
      </div>
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.toolBar}>
          <div className={classes.navBreak}>
            <img src={BrandHubLogo} alt="Logo" style={{filter: "brightness(0%)"}} />
          </div>
          <div className={classes.navBreak}>
            <Divider orientation="vertical" flexItem />
            {userType !== "compliance" && <CartModal userType={userType} />}
            <Notifications />
            <UserNavMenu
              handleLogout={handleLogout}
              handleModalOpen={handleModalOpen}
            />
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <SideDrawer handleLogout={handleLogout} userType={userType} />
      </Drawer>
    </div>
    </>
  );
};

export default TopLeftNav;
