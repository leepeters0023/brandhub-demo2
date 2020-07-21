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
import AddBoxIcon from "@material-ui/icons/AddBox";

const AddressModal = (props) => {
  const { type, onSubmit, id } = props;

  const [modal, setModal] = useState(false);
  const { value: company, bind: bindCompany, reset: resetCompany } = useInput(
    ""
  );
  const { value: code, bind: bindCode, reset: resetCode } = useInput("");
  const { value: city, bind: bindCity, reset: resetCity } = useInput("");
  const { value: state, bind: bindState, reset: resetState } = useInput("");

  const handleClose = () => {
    resetCompany();
    resetCode();
    resetCity();
    resetState();
    setModal(false);
  };

  return (
    <>
      <Tooltip title={type[0].toUpperCase() + type.slice(1)}>
        <IconButton
          onClick={() => {
            setModal(true);
          }}
        >
          {type === "edit" ? <EditIcon /> : <AddBoxIcon />}
        </IconButton>
      </Tooltip>
      <Dialog open={modal} onClose={handleClose} fullWidth maxWidth="sm">
        {type === "edit" ? (
          <DialogTitle>Edit Address</DialogTitle>
        ) : (
          <DialogTitle>Add New Address</DialogTitle>
        )}
        <DialogContent>
          <form>
            <TextField
              name="company"
              type="text"
              label="Company"
              {...bindCompany}
              fullWidth
            />
            <TextField
              name="code"
              type="text"
              label="Code"
              {...bindCode}
              fullWidth
            />
            <TextField
              name="city"
              type="text"
              label="City"
              {...bindCity}
              fullWidth
            />
            <TextField
              name="state"
              type="text"
              label="State"
              {...bindState}
              fullWidth
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              onSubmit(company, code, city, state, id);
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

export default AddressModal;
