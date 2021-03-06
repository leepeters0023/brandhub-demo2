import React from "react";
import Logo from "../../assets/brandhub.svg";
import PropTypes from "prop-types";
import { Link } from "@reach/router";

import { useSelector } from "react-redux";

import UserNav from "./UserNav";
import RegionSelector from "../Utility/RegionSelector";
import OnPremiseRetailSelector from "../Utility/OnPremiseRetailSelector";
import DrawerItemsNav from "./DrawerItemsNav";
import DrawerOrdersNav from "./DrawerOrdersNav";
import DrawerReportsNav from "./DrawerReportsNav";
import DrawerPONav from "./DrawerPONav";
import DrawerRFQNav from "./DrawerRFQNav";

import AppBar from "@material-ui/core/AppBar";
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
    zIndex: "2500",
  },
  title: {
    flexGrow: 1,
  },
  logoLink: {
    filter:  "invert(100%) contrast(200%)",
    height: "58px",
    width: "auto",
    marginLeft: "25px",
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
    marginRight: "10px",
  },
  navigationText: {
    fontWeight: 500,
    color: "white",
    margin: "0 10px",
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
      textDecoration: "underline",
    },
  },
  navList: {
    backgroundColor: "black",
    overFlow: "hidden",
  },
  regionText: {
    color: "black",
  },
  avatar: {
    backgroundColor: "white",
    color: "black",
    float: "right",
  },
  expandMoreIcon: {
    marginRight: "20px",
    color: "white",
    pointerEvents: "none",
    cursor: "none",
  },
  divider: {
    backgroundColor: "white",
  },
}));

const TopDrawerNav = ({ handleLogout, handleCouponModal, currentMonth }) => {
  const classes = useStyles();

  const initials = useSelector((state) => state.user.initials);
  const role = useSelector((state) => state.user.role);
  const territories = [1, 2]//useSelector((state) => state.user.territories);

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
            <Link to="/dashboard">
              <img src={Logo} alt="Logo" className={classes.logoLink} />
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
                  <DrawerItemsNav role={role} classes={classes} />
                  {role !== "compiance" && (
                    <DrawerOrdersNav
                      role={role}
                      classes={classes}
                      inStockOrderId={inStockOrderId}
                      onDemandOrderId={onDemandOrderId}
                      handleCouponModal={handleCouponModal}
                      currentMonth={currentMonth}
                    />
                  )}
                  <DrawerReportsNav role={role} classes={classes} />
                </>
              )}
              {/* {role !== "supplier" && (
                <OnPremiseRetailSelector classes={classes} />
              )} */}
              {territories && territories.length > 0 && (
                <RegionSelector classes={classes} />
              )}
              <UserNav
                role={role}
                classes={classes}
                initials={initials}
                handleLogout={handleLogout}
              />
            </div>
          </>
        </div>
      </AppBar>
    </>
  );
};

TopDrawerNav.propTypes = {
  handleCouponModal: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired,
  currentMonth: PropTypes.number,
};

export default React.memo(TopDrawerNav);
