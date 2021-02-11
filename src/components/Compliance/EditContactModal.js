import React from "react";
import PropTypes from "prop-types";

import { useInput } from "../../hooks/InputHooks";

import { useSelector, useDispatch } from "react-redux";

import { updateContact } from "../../redux/slices/complianceContactSlice";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const EditContactModal = ({ id, open, handleClose }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const contact = useSelector((state) => state.complianceContacts.contacts.find((cont) => cont.id === id))

  const { value: name, bind: bindName, reset: resetName } = useInput(contact.name)
  const { value: email, bind: bindEmail, reset: resetEmail } = useInput(contact.email)

  const handleChanges = (id, name, email) => {
    dispatch(updateContact({id, name, email}))
    resetName();
    resetEmail();
    handleClose();
  }

  return (
    <div className={classes.relativeContainer}>
      <Dialog
        open={open}
        onClose={handleClose}
        disableScrollLock
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
              {`${contact.state} - ${contact.brandGroup}`}
            </Typography>
            <br />
            <TextField
              fullWidth
              style={{ marginBottom: "15px" }}
              variant="outlined"
              color="secondary"
              name="attn"
              type="text"
              label="Name"
              {...bindName}
            />
            <TextField
              fullWidth
              style={{ marginBottom: "15px" }}
              variant="outlined"
              color="secondary"
              name="attn"
              type="text"
              label="Email"
              {...bindEmail}
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
                onClick={() => handleChanges(contact.id, name, email)}
              >
                SAVE DETAILS
              </Button>
            </div>
          </div>
          <br />
        </DialogContent>
      </Dialog>
    </div>
  )
};

EditContactModal.propTypes = {
  id: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default EditContactModal;

