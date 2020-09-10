import React from "react";
import PropTypes from "prop-types";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const OrderComplete = ({ open, handleClose }) => {
  const classes = useStyles();
  return (
    <div className={classes.relativeContainer}>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogContent>
          <IconButton className={classes.closeButton} onClick={handleClose}>
            <CancelIcon fontSize="large" color="secondary" />
          </IconButton>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <br />
            <br />
            <Typography className={classes.headerText}>
              Thank you for your Order!
            </Typography>
            <br />
            <br />
            <Button
              className={classes.largeButton}
              variant="contained"
              color="secondary"
              onClick={handleClose}
            >
              Return to Pre-Order
            </Button>
            <br />
            <br />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

OrderComplete.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
}

export default OrderComplete;
