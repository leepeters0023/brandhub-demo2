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
  confirmDeletModal: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    height: "200px",
    textAlign: "center",
  },
}));

const ConfirmDeleteRollupItem = ({ open, handleClose, handleRemove, itemIds, type }) => {
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
          <div className={classes.confirmDeletModal}>
            <Typography className={classes.headerText}>
              {type === "po"
                ? "Deleting this Purchase Order Item will remove it from all approved orders that contain this item"
                : "Deleting this Quote Item will remove it from all approved orders that contain this item"}
            </Typography>
            <Typography className={classes.titleText}>
              This action cannot be undone.
            </Typography>
            <Button
              variant="contained"
              className={classes.largeButton}
              color="secondary"
              onClick={() => {
                handleRemove(itemIds);
              }}
            >
              REMOVE ITEM
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

ConfirmDeleteRollupItem.propTypes = {
  open: PropTypes.bool.isRequired,
  handleRemove: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  itemId: PropTypes.any,
  type: PropTypes.string,
};

export default ConfirmDeleteRollupItem;