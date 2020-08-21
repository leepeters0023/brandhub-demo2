import React, { useState } from "react";
import PropTypes from "prop-types";
import BrandHubLogo from "../../assets/brandhub.svg";
//import { Link } from "@reach/router";

import Notifications from "../User/Notifications";
import UserNavMenu from "./UserNavMenu";
import NavMenu from "./NavMenu";
import AddressBook from "../User/AddressBook";

import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";

//import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  scrollNav: {
    backgroundColor: "rgb(255,255,255)",
  },
  navBreak: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    margin: "0",
  },
}));

function HideOnScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const ScrollNav = (props) => {
  const { handleLogout, userType } = props;
  const classes = useStyles();

  const [userModal, handleUserModal] = useState(false);

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
            <Typography className={classes.titleText}>Address Book</Typography>
          </DialogTitle>
          <DialogContent>
            <AddressBook />
          </DialogContent>
        </Dialog>
      </div>
      <CssBaseline />
      <HideOnScroll {...props}>
        <AppBar elevation={0} className={classes.scrollNav}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div className={classes.navBreak}>
              <NavMenu userType={userType} />
              <img
                src={BrandHubLogo}
                alt="Logo"
                style={{ filter: "brightness(0%)" }}
              />
            </div>
            <div className={classes.navBreak}>
              {/* {userType !== "compliance" && (
              <>
                <Tooltip title="View Cart">
                  <IconButton component={Link} to="/cart#preorder">
                    <ShoppingCartIcon fontSize="large" />
                  </IconButton>
                </Tooltip>{" "}
              </>
            )} */}
              <Notifications />
              <UserNavMenu
                handleLogout={handleLogout}
                handleUserModal={handleUserModal}
              />
            </div>
          </div>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
    </>
  );
};

ScrollNav.propTypes = {
  userType: PropTypes.string,
  handleLogout: PropTypes.func.isRequired,
};

export default ScrollNav;
