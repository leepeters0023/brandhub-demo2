import React, { useState } from "react";
import Logo from "../../assets/RTA_Logo_Stacked.png";
import { Link } from "@reach/router";
import { useSelector } from "react-redux";

import UserNav from "./UserNav";
import RegionSelector from "../Utility/RegionSelector";

import Drawer from "@material-ui/core/Drawer";
import Tooltip from "@material-ui/core/Tooltip";
import Backdrop from "@material-ui/core/Backdrop";
import Typography from "@material-ui/core/Typography";

import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  drawer: {
    height: "300px",
    flexShrink: 0,
    whiteSpace: "nowrap",
    position: "fixed",
    top: "0",
    zIndex: "10000",
  },
  drawerOpen: {
    transition: theme.transitions.create("height", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    height: "300px",
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
    margin: "0 20px",
    "&&:hover": {
      cursor: "pointer",
    },
  },
  selectedNavigationText: {
    textDecoration: "underline",
    textDecorationColor: theme.palette.primary.dark,
  },
  navBreak: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    margin: "0",
  },
}));

const TopDrawerNav = ({ handleLogout }) => {
  const classes = useStyles();

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

  const handleDrawerClose = () => {
    setOpen(false);
    setDrawerContent(null);
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
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
        onMouseLeave={handleDrawerClose}
      >
        <div
          style={{
            display: "flex",
            width: "Calc(100% - 50px)",
            padding: "10px 25px",
            justifyContent: "space-between",
            alignItems: "center",
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
                />
              </Link>
            </Tooltip>
            <Typography
              className={clsx(classes.titleText, classes.navigationText, {
                [classes.selectedNavigationText]: drawerContent === "assets",
              })}
              onMouseEnter={() => {
                handleDrawerOpen();
                setDrawerContent("assets");
              }}
            >
              Assets
            </Typography>
            <Typography
              className={clsx(classes.titleText, classes.navigationText, {
                [classes.selectedNavigationText]: drawerContent === "orders",
              })}
              onMouseEnter={() => {
                handleDrawerOpen();
                setDrawerContent("orders");
              }}
            >
              Orders
            </Typography>
            {role !== "field1" && (
              <Typography
                className={clsx(classes.titleText, classes.navigationText, {
                  [classes.selectedNavigationText]:
                    drawerContent === "fulfillment",
                })}
                onMouseEnter={() => {
                  handleDrawerOpen();
                  setDrawerContent("fulfillment");
                }}
              >
                Fulfillment
              </Typography>
            )}
          </div>
          <div className={classes.navBreak}>
            {/* {(role === "super" || role === "field2") && <UserSelector />} */}
            {territories.length > 1 && <RegionSelector />}
            <UserNav initials={initials} handleLogout={handleLogout} />
          </div>
        </div>
        <br />
        <div className={classes.drawerContent}>
          {drawerContent === "orders" && (
            <Grid container spacing={2}>
              <Grid
                item
                sm={3}
                xs={12}
                style={{ borderRight: "1px solid #737373" }}
              >
                <List>
                  <ListItem
                    button
                    onClick={handleDrawerClose}
                    component={Link}
                    to="/orders/open/preorder"
                  >
                    <ListItemText primary="Quarterly Pre-Order" />
                  </ListItem>
                  <ListItem
                    button
                    onClick={handleDrawerClose}
                    component={Link}
                    to="/orders/items/inStock"
                  >
                    <ListItemText primary="In-Stock" />
                  </ListItem>
                  <ListItem
                    button
                    onClick={handleDrawerClose}
                    component={Link}
                    to="/orders/items/onDemand"
                  >
                    <ListItemText primary="On-Demand" />
                  </ListItem>
                </List>
              </Grid>
              <Grid item sm={1} xs={12} />
              <Grid item sm={4} xs={12}>
                <List>
                  <ListItem>
                    <ListItemText
                      primaryTypographyProps={{ className: classes.headerText }}
                      primary="Open Orders:"
                    />
                  </ListItem>
                  <ListItem
                    button
                    onClick={handleDrawerClose}
                    component={Link}
                    to={
                      inStockOrderId
                        ? `/orders/open/${inStockOrderId}`
                        : "/orders/open/inStock"
                    }
                  >
                    <ListItemText primary="In-Stock" />
                  </ListItem>
                  <ListItem
                    button
                    onClick={handleDrawerClose}
                    component={Link}
                    to={
                      onDemandOrderId
                        ? `/orders/open/${onDemandOrderId}`
                        : "/orders/open/onDemand"
                    }
                  >
                    <ListItemText primary="On-Demand" />
                  </ListItem>
                </List>
              </Grid>
              <Grid item sm={4} xs={12}>
                <List>
                  <ListItem
                    button
                    onClick={handleDrawerClose}
                    component={Link}
                    to="/orders/history"
                  >
                    <ListItemText primary="Order History" />
                  </ListItem>
                  {role !== "field1" && (
                    <>
                      <ListItem
                        button
                        onClick={handleDrawerClose}
                        component={Link}
                        to="/rollup"
                      >
                        <ListItemText primary="Quarterly Rollup" />
                      </ListItem>
                      <ListItem
                        button
                        onClick={handleDrawerClose}
                        component={Link}
                        to="/orders/approvals"
                      >
                        <ListItemText primary="Approvals" />
                      </ListItem>
                    </>
                  )}
                </List>
              </Grid>
            </Grid>
          )}
        </div>
      </Drawer>
    </>
  );
};

export default TopDrawerNav;
