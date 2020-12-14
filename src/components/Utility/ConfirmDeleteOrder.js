import React from "react";
import PropTypes from "prop-types";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  confirmDeleteModal: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    height: "200px",
    textAlign: "center",
  },
}));

const ConfirmDeleteOrder = ({ open, handleClose, handleRemove, orderId }) => {
  const classes = useStyles();

  return (
    <div className={classes.relativeContainer}>
      <Dialog
        open={open}
        disableScrollLock
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        style={{ zIndex: "15000" }}
      >
        <DialogContent>
          <IconButton className={classes.closeButton} onClick={handleClose}>
            <CancelIcon fontSize="large" color="secondary" />
          </IconButton>
          <br />
          <div className={classes.confirmDeleteModal}>
            <Typography className={classes.headerText}>
              Are you sure you want to delete this order?
            </Typography>
            <Button
              variant="contained"
              className={classes.largeButton}
              color="secondary"
              onClick={() => {
                handleRemove(orderId);
              }}
            >
              DELETE ORDER
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

ConfirmDeleteOrder.propTypes = {
  open: PropTypes.bool.isRequired,
  handleRemove: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  orderId: PropTypes.string,
};

export default ConfirmDeleteOrder;