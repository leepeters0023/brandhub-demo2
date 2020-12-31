import React, { useState } from "react";
import Logo from "../../assets/RTA_Logo_Stacked.png";
import { Link } from "@reach/router";

import { useSelector, useDispatch } from "react-redux";

import { setRetain } from "../../redux/slices/filterSlice";

import UserNav from "./UserNav";
import RegionSelector from "../Utility/RegionSelector";
import DrawerItemsNav from "./DrawerItemsNav";
import DrawerOrdersNav from "./DrawerOrdersNav";
import DrawerReportsNav from "./DrawerReportsNav";
import DrawerPONav from "./DrawerPONav";
import DrawerRFQNav from "./DrawerRFQNav";

import Drawer from "@material-ui/core/Drawer";
import Tooltip from "@material-ui/core/Tooltip";
import Backdrop from "@material-ui/core/Backdrop";
import Typography from "@material-ui/core/Typography";

import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  drawer: {
    height: "350px",
    flexShrink: 0,
    whiteSpace: "nowrap",
    position: "fixed",
    top: "0",
    zIndex: "10000",
  },
  drawerOpen: {
    backgroundColor: "black",
    transition: theme.transitions.create("height", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    height: "365px",
    overflowY: "hidden",
  },
  drawerSupplierOpen: {
    backgroundColor: "black",
    transition: theme.transitions.create("height", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    height: "175px",
    overflowY: "hidden",
  },
  drawerClose: {
    transition: theme.transitions.create("height", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowY: "hidden",
    height: "87px",
  },
  drawerContent: {
    width: "Calc(100% - 50px)",
    padding: "5px 25px",
    display: "flex",
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
    fontWeight: 500,
    color: "white",
    margin: "0 20px",
    "&&:hover": {
      cursor: "pointer",
    },
  },
  selectedNavigationText: {
    textDecoration: "underline",
    textDecorationColor: theme.palette.primary.light,
  },
  navBreak: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "fit-content",
    margin: "0",
  },
  navList: {
    paddingLeft: "20px",
    marginTop: "-20px",
    color: "white",
  },
  regionText: {
    color: "white"
  },
  regionTextOpen: {
    color: "black"
  }
}));

const TopDrawerNav = ({ handleLogout, handleCouponModal }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState(null);
  const initials = useSelector((state) => state.user.initials);
  const role = useSelector((state) => state.user.role);
  const territories = useSelector((state) => state.user.territories);

  const inStockOrderId = useSelector(
    (state) => state.currentOrder.inStockOrderNumber
  );
  const onDemandOrderId = useSelector(
    (state) => state.currentOrder.onDemandOrderNumber
  );

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = (mouseEvent) => {
    setOpen(false);
    setDrawerContent(null);
    if (!mouseEvent) {
      dispatch(setRetain({ value: false }));
    }
  };

  return (
    <>
      {open && <Backdrop style={{ zIndex: "9999" }} open={true} />}
      <Drawer
        variant="permanent"
        anchor="top"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open && role !== "supplier",
            [classes.drawerSupplierOpen]: open && role === "supplier",
            [classes.drawerClose]: !open,
          }),
        }}
        onMouseLeave={() => handleDrawerClose(true)}
      >
        <div
          style={{
            display: "inline",
            width: "Calc(100% - 50px)",
            padding: "10px 25px",
            alignItems: "center",
            backgroundColor: "black",
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
                  onClick={handleDrawerClose}
                />
              </Link>
            </Tooltip>
            {role === "supplier" && (
              <>
                <Typography
                  variant="h5"
                  className={clsx(classes.titleText, classes.navigationText, {
                    [classes.selectedNavigationText]: drawerContent === "rfq",
                  })}
                  onMouseEnter={() => {
                    handleDrawerOpen();
                    setDrawerContent("rfq");
                  }}
                >
                  Quotes
                </Typography>
                <Typography
                  variant="h5"
                  className={clsx(classes.titleText, classes.navigationText, {
                    [classes.selectedNavigationText]: drawerContent === "po",
                  })}
                  onMouseEnter={() => {
                    handleDrawerOpen();
                    setDrawerContent("po");
                  }}
                >
                  Purchase Orders
                </Typography>
              </>
            )}
            {role !== "supplier" && (
              <>
                <Typography
                  variant="h5"
                  className={clsx(classes.titleText, classes.navigationText, {
                    [classes.selectedNavigationText]:
                      drawerContent === "assets",
                  })}
                  onMouseEnter={() => {
                    handleDrawerOpen();
                    setDrawerContent("assets");
                  }}
                >
                  Items
                </Typography>
                <Typography
                  variant="h5"
                  className={clsx(classes.titleText, classes.navigationText, {
                    [classes.selectedNavigationText]:
                      drawerContent === "orders",
                  })}
                  onMouseEnter={() => {
                    handleDrawerOpen();
                    setDrawerContent("orders");
                  }}
                >
                  Order
                </Typography>
                {role !== "purchasing" && (
                  <Typography
                    variant="h5"
                    className={clsx(classes.titleText, classes.navigationText, {
                      [classes.selectedNavigationText]:
                        drawerContent === "purchasing",
                      //TODO figure out drawerContent and change to Reports
                    })}
                    onMouseEnter={() => {
                      handleDrawerOpen();
                      setDrawerContent("purchasing");
                      //TODO figure out drawerContent and change to Reports
                    }}
                  >
                    Reports
                  </Typography>
                )}
              </>
            )}
          </div>
          <div
            className={classes.navBreak}
            style={{ float: "right", marginTop: "-67px" }}
          >
            {territories && territories.length > 0 && <RegionSelector classes={classes}/>}
            <UserNav
              initials={initials}
              handleLogout={handleLogout}
              handleDrawerClose={handleDrawerClose}
              userType={role}
            />
          </div>
        </div>
        <br />
        <div className={classes.drawerContent}>
          {drawerContent === "assets" && (
            <DrawerItemsNav
              userType={role}
              handleDrawerClose={handleDrawerClose}
              classes={classes}
            />
          )}
          {drawerContent === "orders" && (
            <DrawerOrdersNav
              handleDrawerClose={handleDrawerClose}
              classes={classes}
              inStockOrderId={inStockOrderId}
              onDemandOrderId={onDemandOrderId}
              role={role}
              handleCouponModal={handleCouponModal}
            />
          )}
          {drawerContent === "purchasing" && (
            <DrawerReportsNav
              handleDrawerClose={handleDrawerClose}
              classes={classes}
            />
          )}
          {drawerContent === "rfq" && (
            <DrawerRFQNav
              handleDrawerClose={handleDrawerClose}
              classes={classes}
            />
          )}
          {drawerContent === "po" && (
            <DrawerPONav
              handleDrawerClose={handleDrawerClose}
              classes={classes}
            />
          )}
        </div>
      </Drawer>
    </>
  );
};

export default React.memo(TopDrawerNav);
