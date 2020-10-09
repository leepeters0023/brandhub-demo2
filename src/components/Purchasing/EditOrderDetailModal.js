import React from "react";
import PropTypes from "prop-types";

import { useDispatch, useSelector } from "react-redux";

import { setOrderDetails } from "../../redux/slices/patchOrderSlice";

import { useInput } from "../../hooks/UtilityHooks";

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
    state.orderSet.orders.find((ord) => ord.orderNumber === orderNumber)
  );

  const { value: attn, bind: bindAttn } = useInput(
    currentOrder ? currentOrder.attn : ""
  );
  const { value: note, bind: bindNote } = useInput(
    currentOrder ? currentOrder.note : ""
  );

  const handleChanges = (note, attn) => {
    dispatch(setOrderDetails(orderNumber, note, attn, "pre-order"));
    handleClose(false);
  };

  if (!currentOrder) {
    return null;
  }

  return (
    <div className={classes.relativeContainer}>
      <Dialog
        open={orderNumber !== false}
        onClose={() => handleClose(false)}
        fullWidth
        maxWidth="md"
        style={{zIndex: "15000"}}
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
              {`${orderNumber} - ${currentOrder.distributorName} - ${currentOrder.distributorCity}, ${currentOrder.distributorState}`}
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
              {...bindAttn}
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
              {...bindNote}
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
