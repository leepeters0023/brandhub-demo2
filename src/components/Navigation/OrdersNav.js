import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";

import Menu from "@material-ui/core/Menu";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";
import { makeStyles } from "@material-ui/core/styles";

import StoreIcon from "@material-ui/icons/Store";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const OrdersNav = ({ setSelected, selected }) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useCallback(useState(null));
  const [placeOrderOpen, setPlaceOrderOpen] = useCallback(useState(false));
  const [openOrdersOpen, setOpenOrdersOpen] = useCallback(useState(false));

  const handleOpen = (evt) => {
    setAnchorEl(evt.target);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePlaceOrder = () => {
    setPlaceOrderOpen(!placeOrderOpen);
  };

  const handleOpenOrders = () => {
    setOpenOrdersOpen(!openOrdersOpen);
  };

  return (
    <>
      <Tooltip title="Orders">
        <IconButton
          aria-owns={anchorEl ? "orders" : undefined}
          aria-haspopup="true"
          onClick={handleOpen}
        >
          <StoreIcon
            fontSize="large"
            color={selected === "orders" ? "primary" : "inherit"}
          />
        </IconButton>
      </Tooltip>
      <Menu
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        style={{ marginTop: "10px" }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <List style={{ width: "200px" }}>
          <ListItem button onClick={handlePlaceOrder}>
            <ListItemText primary="Place an Order" />
            {placeOrderOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={placeOrderOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                onClick={() => {
                  setSelected("orders");
                  handleClose();
                  handlePlaceOrder();
                  if (openOrdersOpen) {
                    handleOpenOrders();
                  }
                }}
                component={Link}
                to="/orders/items/instock"
                className={classes.nested}
              >
                <ListItemText primary="In-Stock" />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  setSelected("orders");
                  handleClose();
                  handlePlaceOrder();
                  if (openOrdersOpen) {
                    handleOpenOrders();
                  }
                }}
                component={Link}
                to="/orders/items/ondemand"
                className={classes.nested}
              >
                <ListItemText primary="On-Demand" />
              </ListItem>
            </List>
          </Collapse>
          <ListItem button onClick={handleOpenOrders}>
            <ListItemText primary="Open Orders" />
            {openOrdersOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openOrdersOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                onClick={() => {
                  setSelected("orders");
                  handleClose();
                  handleOpenOrders();
                  if (placeOrderOpen) {
                    handlePlaceOrder();
                  }
                }}
                component={Link}
                to="/orders/open/instock"
                className={classes.nested}
              >
                <ListItemText primary="In-Stock" />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  setSelected("orders");
                  handleClose();
                  handleOpenOrders();
                  if (placeOrderOpen) {
                    handlePlaceOrder();
                  }
                }}
                component={Link}
                to="/orders/open/ondemand"
                className={classes.nested}
              >
                <ListItemText primary="On-Demand" />
              </ListItem>
            </List>
          </Collapse>
          <ListItem
            button
            onClick={() => {
              setSelected("orders");
              handleClose();
              if (placeOrderOpen) {
                handlePlaceOrder();
              }
              if (openOrdersOpen) {
                handleOpenOrders();
              }
            }}
            component={Link}
            to="/orders/history"
          >
            <ListItemText primary="Order History" />
          </ListItem>
        </List>
      </Menu>
    </>
  );
};

OrdersNav.propTypes = {
  setSelected: PropTypes.func.isRequired,
  selected: PropTypes.string.isRequired,
};

export default OrdersNav;
