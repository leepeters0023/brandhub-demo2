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

const AreYouSure = ({ open, handleClose, handleRemove, itemNumber, type }) => {
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
              {type === "pendingCompliance"
                ? `Are you sure you want to cancel the selected order${
                    itemNumber.length > 1 ? "s" : ""
                  }?`
                : "Are you sure you want to remove this item?"}
            </Typography>
            <Button
              variant="contained"
              className={classes.largeButton}
              color="secondary"
              onClick={() => {
                handleRemove(itemNumber);
              }}
            >
              {type === "pendingCompliance"
                ? `CANCEL ORDER${itemNumber.length > 1 ? "S" : ""}`
                : "REMOVE ITEM"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

AreYouSure.propTypes = {
  open: PropTypes.bool.isRequired,
  handleRemove: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  itemNumber: PropTypes.any,
  type: PropTypes.string,
};

export default AreYouSure;
