import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { useDispatch, useSelector } from "react-redux";

import { setOrderDetails } from "../../redux/slices/patchOrderSlice";

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

const EditOrderDetailModal = ({ orderNumber, handleClose }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const currentOrder = useSelector((state) =>
    state.orderSet.orders.find((ord) => ord.id === orderNumber)
  );

  const [attn, setAttn] = useState(
    currentOrder && currentOrder.attn ? currentOrder.attn : ""
  );
  const [note, setNote] = useState(
    currentOrder && currentOrder.note ? currentOrder.note : ""
  );

  const handleChanges = (note, attn) => {
    dispatch(setOrderDetails(orderNumber, note, attn, "pre-order"));
    handleClose(false);
  };

  useEffect(() => {
    if (currentOrder && currentOrder.attn !== attn) {
      setAttn(currentOrder.attn);
    }
  }, [currentOrder, attn]);

  useEffect(() => {
    if (currentOrder && currentOrder.note !== note) {
      setNote(currentOrder.note);
    }
  }, [currentOrder, note]);

  if (!currentOrder) {
    return null;
  }

  return (
    <div className={classes.relativeContainer}>
      <Dialog
        open={orderNumber !== false}
        onClose={() => {
          handleClose(false);
        }}
        fullWidth
        maxWidth="md"
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
              {`${orderNumber} - ${
                currentOrder.distributorName
                  ? currentOrder.distributorName
                  : currentOrder.customAddressName
              } - ${
                currentOrder.distributorCity
                  ? currentOrder.distributorCity
                  : currentOrder.customAddressCity
              }, ${
                currentOrder.distributorState
                  ? currentOrder.distributorState
                  : currentOrder.customAddressState
              }`}
            </Typography>
            <br />
            <TextField
              fullWidth
              style={{ marginBottom: "15px" }}
              variant="outlined"
              color="secondary"
              name="attn"
              type="text"
              label="Attention"
              value={attn}
              onChange={(evt) => setAttn(evt.target.value)}
            />
            <TextField
              fullWidth
              multiline
              rows="4"
              style={{ marginBottom: "15px" }}
              variant="outlined"
              color="secondary"
              name="note"
              type="text"
              label="Order Notes"
              value={note}
              onChange={(evt) => setNote(evt.target.value)}
            />
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                className={classes.largeButton}
                variant="contained"
                color="secondary"
                onClick={() => handleChanges(note, attn)}
              >
                SAVE DETAILS
              </Button>
            </div>
          </div>
          <br />
        </DialogContent>
      </Dialog>
    </div>
  );
};

EditOrderDetailModal.propTypes = {
  orderNumber: PropTypes.any,
  handleClose: PropTypes.func.isRequired,
};

export default React.memo(EditOrderDetailModal);
