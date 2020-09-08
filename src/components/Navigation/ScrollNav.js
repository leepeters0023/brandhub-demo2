import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import BrandHubLogo from "../../assets/brandhub.svg";
import { Link } from "@reach/router";

import UserNav from "./UserNav";
import OrdersNav from "./OrdersNav";
import MoreNav from "./MoreNav";

import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";

import DashboardIcon from "@material-ui/icons/Dashboard";

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
  logoLink: {
    filter: "brightness(0%)",
    marginTop: "5px",
    "&&:hover": {
      cursor: "pointer",
    },
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
  const { handleLogout } = props;
  const classes = useStyles();

  //const [userModal, handleUserModal] = useCallback(useState(false));
  const [selected, setSelected] = useCallback(useState("home"));
  const initials = useSelector((state) => state.user.initials);
  const role = useSelector((state) => state.user.role);

  const handleNav = useCallback(() => {
    if (window.location.pathname === "/") {
      setSelected("home");
    } else if (window.location.pathname.includes("program")) {
      setSelected("programs");
    } else if (window.location.pathname.includes("order")) {
      setSelected("orders");
    } else {
      setSelected("other");
    }
  }, [setSelected]);

  useEffect(() => {
    handleNav();
  }, [handleNav]);

  useEffect(() => {
    window.addEventListener("popstate", handleNav);
    return () => window.removeEventListener("popstate", handleNav);
  }, [handleNav]);

  return (
    <>
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
              <Tooltip title="Home">
                <Link to="/">
                  <img
                    src={BrandHubLogo}
                    alt="Logo"
                    className={classes.logoLink}
                    style={{ filter: "brightness(0%)" }}
                    onClick={() => setSelected("home")}
                  />
                </Link>
              </Tooltip>
              <Tooltip title="Programs">
                <IconButton
                  component={Link}
                  to="/programs"
                  onClick={() => setSelected("programs")}
                >
                  <DashboardIcon
                    fontSize="large"
                    color={selected === "programs" ? "primary" : "inherit"}
                  />
                </IconButton>
              </Tooltip>
              <OrdersNav setSelected={setSelected} selected={selected} />
              <MoreNav setSelected={setSelected} selected={selected} userType={role} />
            </div>
            <div className={classes.navBreak}>
              <UserNav
                initials={initials}
                handleLogout={handleLogout}
                setSelected={setSelected}
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
