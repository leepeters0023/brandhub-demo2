import React from "react";
import PropTypes from "prop-types";

import { useSelector } from "react-redux"

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

const AreYouSure = ({ open, handleClose }) => {
  const classes = useStyles();

  const error = useSelector((state) => state.error.currentError);

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
              It looks like something went wrong, the following error has occured:
            </Typography>
            <br />
            <Typography className={classes.bodyText}>
              {error}
            </Typography>
            <br />
            <Button
              onClick={handleClose}
              href="/dashboard"
              color="secondary"
              variant="contained"
              className={classes.largeButton}
            >
              GO BACK HOME
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

AreYouSure.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  store: PropTypes.string.isRequired,
};

export default AreYouSure;