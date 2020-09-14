import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import Logo from "../../assets/RTA_Logo_Stacked.png";
import { Link } from "@reach/router";

import UserNav from "./UserNav";
import OrdersNav from "./OrdersNav";
import MoreNav from "./MoreNav";
import PreOrderNav from "./PreOrderNav";
import RegionSelector from "../Utility/RegionSelector";
import UserSelector from "../Utility/UserSelector";

import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";


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
    height: "58px",
    width: "auto",
    marginLeft: "20px",
    marginRight: "20px",
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
  const territories = useSelector((state) => state.user.territories)

  const handleNav = useCallback(() => {
    if (window.location.pathname === "/") {
      setSelected("home");
    } else if (window.location.pathname.includes("program") || window.location.pathname.includes("preorder")) {
      setSelected("preOrder");
    } else if (window.location.pathname.includes("orders")) {
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
                    src={Logo}
                    alt="Logo"
                    className={classes.logoLink}
                    style={{ filter: "brightness(0%)" }}
                    onClick={() => setSelected("home")}
                  />
                </Link>
              </Tooltip>
              <PreOrderNav setSelected={setSelected} selected={selected} />
              <OrdersNav setSelected={setSelected} selected={selected} />
              <MoreNav setSelected={setSelected} selected={selected} userType={role} />
            </div>
            <div className={classes.navBreak}>
              {role === "super" && <UserSelector />}
              {territories.length > 1 && <RegionSelector />}
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
