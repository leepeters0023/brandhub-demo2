import React, { useState } from "react";

import OrderPreOrderCart from "./OrderPreOrderCart";
import OrderCart from "./OrderCart";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { makeStyles } from "@material-ui/core/styles";

import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const CartModal = () => {
  const classes = useStyles();

  const [value, updateValue] = useState(1);
  const [modal, setModal] = useState(false);

  const handleClose = () => {
    setModal(false);
  };

  const handleChangeTab = (_evt, newValue) => {
    updateValue(newValue);
  };

  return (
    <div className={classes.relativeContainer}>
      <Tooltip title="View Cart">
        <IconButton
          onClick={() => {
            setModal(true);
          }}
        >
          <ShoppingCartIcon fontSize="large" />
        </IconButton>
      </Tooltip>
      <Dialog
        open={modal}
        onClose={handleClose}
        fullWidth
        maxWidth="xl"
      >
        <IconButton
          className={classes.closeButton}
          onClick={() => {
            handleClose(false);
          }}
        >
          <CancelIcon fontSize="large" color="secondary" />
        </IconButton>
        <DialogTitle>Your Cart</DialogTitle>
        <DialogContent style={{paddingTop: 0}}>
          <Tabs
            variant="fullWidth"
            value={value}
            onChange={handleChangeTab}
            indicatorColor="primary"
            centered
          >
            <Tab className={classes.headerText} label="Pre-Order" value={1} />
            <Tab className={classes.headerText} label="In-Stock" value={2} />
            <Tab className={classes.headerText} label="On-Demand" value={3} />
          </Tabs>
          <br />
          <br />
          {value === 1 && <OrderPreOrderCart />}
          {value === 2 && <OrderCart />}
          {value === 3 && <OrderCart />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CartModal;
