import React, { useState } from "react";

import { useInput } from "../hooks/UtilityHooks";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

import EditIcon from "@material-ui/icons/Edit";

const EditAccountModal = (props) => {
  const { onSubmit, currentFirst, currentLast, currentEmail, currentPhone } = props;

  const [modal, setModal] = useState(false);
  const { value: firstName, bind: bindFirstName } = useInput(
    currentFirst
  );
  const { value: lastName, bind: bindLastName } = useInput(currentLast);
  const { value: email, bind: bindEmail } = useInput(currentEmail);
  const { value: phone, bind: bindPhone } = useInput(currentPhone);

  const handleClose = () => {
    setModal(false);
  };

  return (
    <>
      <Tooltip title="Edit Info">
        <IconButton
          onClick={() => {
            setModal(true);
          }}
        >
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Dialog open={modal} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit User Info</DialogTitle>
        <DialogContent>
          <form>
            <TextField
              color="secondary"
              name="firstName"
              type="text"
              label="FirstName"
              {...bindFirstName}
              fullWidth
            />
            <TextField
              color="secondary"
              name="lastName"
              type="text"
              label="LastName"
              {...bindLastName}
              fullWidth
            />
            <TextField
              color="secondary"
              name="email"
              type="email"
              label="Email"
              {...bindEmail}
              fullWidth
            />
            <TextField
              color="secondary"
              name="phone"
              type="text"
              label="Phone"
              {...bindPhone}
              fullWidth
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              onSubmit(firstName, lastName, email, phone);
              handleClose()
            }}
            color="primary"
            variant="contained"
          >
            Submit
          </Button>
          <Button onClick={handleClose} color="secondary" variant="contained">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditAccountModal;