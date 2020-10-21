import React, { useState, useCallback } from "react";

import { useInput } from "../../hooks/InputHooks";

import UserTable from "./UserTable";
import EditUserModal from "./EditUserModal";
import UserRoleSelect from "./UserRoleSelect";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";

import { regions } from "../../utility/constants";

const TerritorySelector = React.memo(({ classes, handleTerritories }) => (
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
), (prev, next) => {
  return (
    Object.keys(prev.classes).length === Object.keys(next.classes).length
  )
});

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  settingsMargin: {
    marginBottom: "15px",
  },
}));

const Users = () => {
  const classes = useStyles();

  const { value: firstName, bind: bindFirstName } = useInput("");
  const { value: lastName, bind: bindLastName } = useInput("");
  const { value: email, bind: bindEmail } = useInput("");
  const { value: phone, bind: bindPhone } = useInput("");
  const { value: password, bind: bindPassword } = useInput("");

  const [modal, handleModal] = useState(false);
  const [currentTerritories, setCurrentTerritories] = useCallback(useState([]));
  const [currentUserId, setCurrentUserId] = useState(null);
  const [role, setRole] = useState("field1");

  const handleFormSubmit = (evt) => {
    evt.preventDefault();
    console.log(evt.target.id);
    //temporarily removing unused vars so build will work on netlify, not permenant
    console.log(firstName, lastName, email, phone, password, currentTerritories);
  };

  const handleUserClick = (user) => {
    setCurrentUserId(user);
    handleModal(true);
  };

  const handleTerritories = useCallback((value, _type, _filter) => {
    setCurrentTerritories(value);
  }, [setCurrentTerritories]);

  const handleModalClose = () => {
    handleModal(false);
  };

  return (
    <>
      <div className={classes.relativeContainer}>
        <Dialog open={modal} onClose={handleModalClose} fullWidth maxWidth="lg">
          <DialogTitle>
            <Typography className={classes.headerText}>
              {`User Id: ${currentUserId}`}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <EditUserModal handleClose={handleModalClose} userId={currentUserId} />
          </DialogContent>
        </Dialog>
      </div>
      <Typography className={classes.titleText}>Add New User</Typography>
      <br />
      <form>
        <TextField
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
      <TerritorySelector classes={classes} handleTerritories={handleTerritories} />
      <br />
      <br />
      <Button
        className={classes.largeButton}
        variant="contained"
        color="secondary"
        id="profile"
        onClick={handleFormSubmit}
      >
        SUBMIT
      </Button>

      <br />
      <br />
      <Divider />
      <br />
      <br />
      <Typography className={classes.titleText}>Edit Users</Typography>
      <br />
      <UserTable handleUserClick={handleUserClick} />
    </>
  );
};

export default Users;
