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
import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
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
  },
  headerListItem: {
    color: "#4C4C4C",
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
                  <Typography variant="h5" className={classes.navigationText}>
                    Quotes
                </Typography>
                  <DrawerRFQNav
                    userType={role}
                    classes={classes}
                  />
                  <Typography variant="h5" className={classes.navigationText}>
                    Purchase Orders
                </Typography>
                  <DrawerPONav
                    userType={role}
                    classes={classes}
                  />
                </>
              )}
              {role !== "supplier" && (
                <>
                  <Typography variant="h5" className={classes.navigationText}>
                    Items
               </Typography>
                  <DrawerItemsNav
                    userType={role}
                    classes={classes}
                  />
                  <Typography variant="h5" className={classes.navigationText}>
                    Order
                  </Typography>
                  <DrawerOrdersNav                    
                    classes={classes}
                    inStockOrderId={inStockOrderId}
                    onDemandOrderId={onDemandOrderId}
                    userType={role}
                    handleCouponModal={handleCouponModal}
                  />
                </>
              )}
              {role !== "purchasing" && (
                <>
                  <Typography variant="h5" className={classes.navigationText}>
                    Reports
                  </Typography>
                  <DrawerReportsNav
                    userType={role}
                    classes={classes}
                  />
                </>
              )}
              {territories && territories.length > 0 && <RegionSelector classes={classes} />}
              <UserNav
                initials={initials}
                handleLogout={handleLogout}
                userType={role}
              />
            </div>
          </>
        </div>
      </AppBar>
    </>
  );
};

export default React.memo(TopDrawerNav);
