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

const VASubmitModal = ({ open, handleClose, handleSubmit }) => {
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
          <br />
          <div className={classes.confirmDeleteModal}>
            <Typography className={classes.headerText}>
              Note: This purchase order has an item shipping to VA, please
              ensure that the Permanent Material field is correctly set in Ready
              to Launch, or Gallo risks non compliance in this state. If this
              field is set correctly on the PO, please click SUBMIT. If not,
              please update Ready to Launch before submitting.
            </Typography>
            <br />
            <Button
              variant="contained"
              className={classes.largeButton}
              color="secondary"
              onClick={() => {
                handleSubmit(true);
                handleClose();
              }}
            >
              SUBMIT
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

VASubmitModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default VASubmitModal;
