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
  needRushModal: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    height: "200px",
    textAlign: "center",
  },
}));

const NeedRushItemModal = ({ open, handleClose, rushItems }) => {
  const classes = useStyles();

  return (
    <div className={classes.relativeContainer}>
      <Dialog
        open={open}
        disableScrollLock
        onClose={() => handleClose(false)}
        fullWidth
        maxWidth="sm"
        style={{ zIndex: "15000" }}
      >
        <DialogContent>
          <IconButton
            className={classes.closeButton}
            onClick={() => handleClose(false)}
          >
            <CancelIcon fontSize="large" color="secondary" />
          </IconButton>
          <br />
          <div className={classes.needRushModal}>
            <Typography className={classes.headerText}>
              {`Rush status must be set on items with a Required Delivery Date earlier than the Standard Delivery Date, the following items must be updated: ${rushItems.join(
                ", "
              )}`}
            </Typography>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

NeedRushItemModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  rushItems: PropTypes.array.isRequired,
}

export default React.memo(NeedRushItemModal);
