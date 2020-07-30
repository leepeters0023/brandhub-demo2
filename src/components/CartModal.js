import React, { useState } from "react";

import OrderPreOrderCart from "./OrderPreOrderCart";
import OrderCart from "./OrderCart";
import SelectorMenus from "./SelectorMenus";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  formControl: {
    position: "absolute",
    top: "15px",
    right: "60px",
  },
}));

const CartModal = ({ userType }) => {
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
          <ShoppingCartIcon color="#404040" fontSize="large" />
        </IconButton>
      </Tooltip>
      <Dialog open={modal} onClose={handleClose} fullWidth maxWidth="xl">
        <IconButton
          className={classes.closeButton}
          onClick={() => {
            handleClose(false);
          }}
        >
          <CancelIcon fontSize="large" color="secondary" />
        </IconButton>
        {userType !== "field1" && (
          <div className={classes.formControl}>
            <SelectorMenus type="bdms" />
          </div>
        )}
        <DialogTitle>
          <Typography className={classes.titleText}>Your Cart</Typography>
        </DialogTitle>
        <DialogContent style={{ paddingTop: 0 }}>
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
          {value === 1 && <OrderPreOrderCart userType={userType} />}
          {value === 2 && <OrderCart userType={userType} />}
          {value === 3 && <OrderCart userType={userType} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CartModal;
