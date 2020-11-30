import React from "react";
import PropTypes from "prop-types";

import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  warningModal: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "200px",
    textAlign: "center",
  },
}));

const WarningModal = ({ open, handleClose, message }) => {
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
          <div className={classes.warningModal}>
            <Typography className={classes.headerText}>
              {message}
            </Typography>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

WarningModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};

export default WarningModal;