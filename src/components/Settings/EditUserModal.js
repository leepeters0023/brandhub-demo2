import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";

import { useInput } from "../../hooks/InputHooks";

import UserRoleSelect from "./UserRoleSelect";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";

import { regions } from "../../utility/constants";

const TerritorySelector = React.memo(
  ({ classes, handleTerritories }) => (
    <div className={classes.inputRow}>
      <Autocomplete
        multiple
        fullWidth
        id="tags-standard"
        options={regions}
        getOptionLabel={(option) => option.name}
        onChange={(_evt, value) => handleTerritories(value)}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Territory"
            size="small"
          />
        )}
      />
    </div>
  ),
  (prev, next) => {
    return (
      Object.keys(prev.classes).length === Object.keys(next.classes).length
    );
  }
);

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  settingsMargin: {
    marginBottom: "15px",
  },
}));

const EditUserModal = ({ modal, handleModalClose, currentUserId }) => {
  const classes = useStyles();

  const { value: firstName, bind: bindFirstName } = useInput("");
  const { value: lastName, bind: bindLastName } = useInput("");
  const { value: email, bind: bindEmail } = useInput("");
  const { value: phone, bind: bindPhone } = useInput("");
  const { value: password, bind: bindPassword } = useInput("");

  const [currentTerritories, setCurrentTerritories] = useCallback(useState([]));
  const [role, setRole] = useState("field1");

  const handleTerritories = useCallback(
    (value) => {
      setCurrentTerritories(value);
    },
    [setCurrentTerritories]
  );

  const handleFormSubmit = (evt) => {
    evt.preventDefault();
    //temporarily removing unused vars so build will work on netlify, not permenant
    console.log(
      firstName,
      lastName,
      email,
      phone,
      password,
      currentTerritories
    );
  };

  return (
    <div className={classes.relativeContainer}>
      <Dialog
        open={modal}
        onClose={handleModalClose}
        fullWidth
        maxWidth="lg"
        style={{ zIndex: "15000" }}
        disableScrollLock
      >
        <DialogTitle>
          <Typography className={classes.headerText}>
            {`User Id: ${currentUserId}`}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <IconButton
            className={classes.closeButton}
            onClick={() => {
              handleModalClose(false);
            }}
          >
            <CancelIcon fontSize="large" color="secondary" />
          </IconButton>
          <form>
            <TextField
              size="small"
              className={classes.settingsMargin}
              variant="outlined"
              color="secondary"
              name="firstName"
              type="text"
              label="FirstName"
              {...bindFirstName}
              fullWidth
            />
            <TextField
              size="small"
              className={classes.settingsMargin}
              variant="outlined"
              color="secondary"
              name="lastName"
              type="text"
              label="LastName"
              {...bindLastName}
              fullWidth
            />
            <TextField
              size="small"
              className={classes.settingsMargin}
              variant="outlined"
              color="secondary"
              name="email"
              type="email"
              label="Email"
              {...bindEmail}
              fullWidth
            />
            <TextField
              size="small"
              className={classes.settingsMargin}
              variant="outlined"
              color="secondary"
              name="phone"
              type="text"
              label="Phone"
              {...bindPhone}
              fullWidth
            />
            <TextField
              size="small"
              className={classes.settingsMargin}
              variant="outlined"
              color="secondary"
              name="password"
              type="text"
              label="Password"
              {...bindPassword}
              fullWidth
            />
            <br />
            <br />
            <Typography
              className={classes.headerText}
              style={{ marginBottom: "15px" }}
            >
              User Role
            </Typography>
            <UserRoleSelect role={role} setRole={setRole} />
          </form>
          <br />
          <br />
          <Typography
            className={classes.headerText}
            style={{ marginBottom: "15px" }}
          >
            Region / Key Acct. Assignment
          </Typography>
          <TerritorySelector
            classes={classes}
            handleTerritories={handleTerritories}
          />
          <br />
          <br />
          <Button
            className={classes.largeButton}
            variant="contained"
            color="secondary"
            id="profile"
            onClick={handleFormSubmit}
            style={{ float: "right", marginBottom: "20px" }}
          >
            SUBMIT
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

EditUserModal.propTypes = {
  handleModalClose: PropTypes.func.isRequired,
  currentUserId: PropTypes.string,
  modal: PropTypes.bool.isRequired,
};

export default EditUserModal;
