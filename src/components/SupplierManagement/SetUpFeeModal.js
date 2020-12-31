import React from "react";
import PropTypes from "prop-types";

import { useDispatch } from "react-redux";

import { addSetUpFee } from "../../redux/slices/purchaseOrderSlice";

import { useMoneyInput, useInput } from "../../hooks/InputHooks";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const SetUpFeeModal = ({ id, open, handleClose }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { value: desc, bind: bindDesc, reset: resetDesc } = useInput("");
  const { value: cost, bind: bindCost, reset: resetCost } = useMoneyInput(
    "$0.0000",
    undefined,
    undefined,
    true
  );

  const handleSubmit = () => {
    dispatch(addSetUpFee(id, desc, cost.split("$").join("")));
    resetDesc();
    resetCost();
    handleClose();
  };

  if (!id) {
    return null;
  }

  return (
    <div className={classes.relativeContainer}>
      <Dialog
        open={open}
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <Typography className={classes.headerText}>
              {`Set Up Fee for PO #${id}`}
            </Typography>
            <br />
            <TextField
              fullWidth
              multiline
              rows={3}
              style={{ marginBottom: "15px" }}
              variant="outlined"
              color="secondary"
              name="desc"
              type="text"
              label="Description"
              {...bindDesc}
            />
            <TextField
              fullWidth
              style={{ marginBottom: "15px" }}
              variant="outlined"
              color="secondary"
              name="cost"
              type="text"
              label="Cost"
              {...bindCost}
            />
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                className={classes.largeButton}
                variant="contained"
                color="secondary"
                onClick={() => handleSubmit()}
              >
                ADD TO PO
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

SetUpFeeModal.propTypes = {
  id: PropTypes.string,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default React.memo(SetUpFeeModal);
