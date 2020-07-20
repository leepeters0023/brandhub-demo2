import React, { useState }from 'react'

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";

import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  relativeContainer: {
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: "0",
    right: "0",
  },
}))

const CartModal = () => {
  const classes = useStyles();

  const [modal, setModal] = useState(false);

  const handleClose = () => {
    setModal(false);
  }

  return (
    <div className={classes.relativeContainer}>
      <Tooltip title="View Cart">
        <IconButton onClick={()=>{setModal(true)}}>
          <ShoppingCartIcon fontSize="large" />
        </IconButton>
      </Tooltip>
      <Dialog open={modal} onClose={handleClose} fullWidth maxWidth="lg">
      <IconButton
          className={classes.closeButton}
          onClick={() => {
            handleClose(false);
          }}
        >
          <CancelIcon fontSize="large" color="secondary" />
        </IconButton>
        <DialogTitle>Your Cart</DialogTitle>
        <DialogContent>
          <h1>Cart here!</h1>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CartModal;
