import React from "react";
import Logo from "../../assets/RTA_Logo_Stacked_White.png";
import { Link } from "@reach/router";

import { useSelector } from "react-redux";

import UserNav from "./UserNav";
import RegionSelector from "../Utility/RegionSelector";
import DrawerItemsNav from "./DrawerItemsNav";
import DrawerOrdersNav from "./DrawerOrdersNav";
import DrawerReportsNav from "./DrawerReportsNav";
import DrawerPONav from "./DrawerPONav";
import DrawerRFQNav from "./DrawerRFQNav";

import AppBar from '@material-ui/core/AppBar';
import Tooltip from "@material-ui/core/Tooltip";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  menuBackground: {
    backgroundColor: theme.palette.secondary.dark,
  },
  appBar: {
    height: "87px",
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "flex-end",
    zIndex: "1300",
  },
  title: {
    flexGrow: 1,
  },
  logoLink: {
    filter: "brightness(100%)",
    height: "58px",
    width: "auto",
    marginLeft: "120px",
    "&&:hover": {
      cursor: "pointer",
    },
  },
  selectedNavigationText: {
    textDecoration: "underline",
    textDecorationColor: theme.palette.primary.light,
  },
  nav: {
    float: "right",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginRight: "120px"
  },
  navigationText: {
    fontWeight: 500,
    color: "white",
    margin: "0 20px",
    pointerEvents: "none",
    cursor: "none",
  },
  navTextContainer: {
    display: "flex",
    flexDirection: "row",
    "&&:hover": {
      cursor: "pointer",
    },
  },
  navBreak: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "fit-content",
    margin: "0",
  },
  headerListItem: {
    color: "white",
    "&:hover": {
      textDecoration: "underline"
    }
  },
  navList: {
    backgroundColor: "black",
    overFlow: "hidden"
  },
  regionText: {
    color: "black"
  },
  avatar: {
    backgroundColor: "white",
    color: "black",
  },
  expandMoreIcon: {
    marginRight: "20px",
    color: "white",
    pointerEvents: "none",
    cursor: "none",
  },
  divider: {
    marginTop: "10px",
    marginBottom: "10px",
    backgroundColor: "white"
  }
}));

const TopDrawerNav = ({ handleLogout, handleCouponModal }) => {
  const classes = useStyles();

  const initials = useSelector((state) => state.user.initials);
  const role = useSelector((state) => state.user.role);
  const territories = useSelector((state) => state.user.territories);

  const inStockOrderId = useSelector(
    (state) => state.currentOrder.inStockOrderNumber
  );
  const onDemandOrderId = useSelector(
    (state) => state.currentOrder.onDemandOrderNumber
  );

  return (
    <>
      <AppBar className={classes.appBar} position="fixed">
        <div style={{ display: "static", width: "100%" }}>
          <Tooltip style={{ float: "left" }} title="Home">
            <Link to="/">
              <img
                src={Logo}
                alt="Logo"
                className={classes.logoLink}
              />
            </Link>
          </Tooltip>
          <>
            <div className={classes.nav}>
              {role === "supplier" && (
                <>
                  <DrawerRFQNav classes={classes} />
                  <DrawerPONav classes={classes} />
                </>
              )}
              {role !== "supplier" && (
                <>
                  <DrawerItemsNav
                    role={role}
                    classes={classes}
                  />
                  {role !=="compiance" && (
                     <DrawerOrdersNav
                     role={role}
                     classes={classes}
                     inStockOrderId={inStockOrderId}
                     onDemandOrderId={onDemandOrderId}
                     handleCouponModal={handleCouponModal}
                   />
                  )}
                </>
              )}
              {role !== "purchasing" && (
                <>
                  <DrawerReportsNav
                    role={role}
                    classes={classes}
                  />
                </>
              )}
              {territories && territories.length > 0 && <RegionSelector classes={classes} />}
              <UserNav
                role={role}
                classes={classes}
                initials={initials}
                handleLogout={handleLogout}
              />
            </div>
          </>
        </div>
      </AppBar >
    </>
  );
};

export default React.memo(TopDrawerNav);
