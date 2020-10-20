import React, { useState } from "react";

import { useSelector } from "react-redux";

import { useInput } from "../../hooks/InputHooks";

import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  settingsMargin: {
    marginBottom: "15px",
  }
}));

const General = () => {
  const classes = useStyles();

  const currentUser = useSelector((state) => state.user)
  
  const [info, setInfo] = useState({
    first: currentUser.firstName,
    last: currentUser.lastName,
    email: currentUser.email,
    phone: "999-999-9999",
  });

  const { value: firstName, bind: bindFirstName } = useInput(info.first);
  const { value: lastName, bind: bindLastName } = useInput(info.last);
  const { value: email, bind: bindEmail } = useInput(info.email);
  const { value: phone, bind: bindPhone } = useInput(info.phone);
  const { value: oldPassword, bind: bindOldPassword } = useInput("");
  const { value: updatePassword, bind: bindUpdatePassword } = useInput("");
  const { value: confirmPassword, bind: bindConfirmPassword } = useInput("");

  const handleFormSubmit = (evt) => {
    evt.preventDefault();
    console.log(evt.target.id);
    //temporarily removing unused vars so build will work on netlify, not permenant
    console.log(oldPassword, updatePassword, confirmPassword)
    if (evt.target.id==="profile") {
      setInfo({
        first: firstName,
        last: lastName,
        email: email,
        phone: phone
      })
    }
  };

  return (
    <>
      <Typography className={classes.titleText}>Profile Information</Typography>
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
        <Button
          className={classes.largeButton}
          variant="contained"
          color="secondary"
          id="profile"
          onClick={handleFormSubmit}
        >
          SUBMIT
        </Button>
      </form>
      <br />
      <Typography className={classes.titleText}>Account Security</Typography>
      <br />
      <Typography
        className={classes.headerText}
        style={{ marginBottom: "15px" }}
      >
        Update Password
      </Typography>
      <form>
        <TextField
          className={classes.settingsMargin}
          variant="outlined"
          color="secondary"
          name="oldPassword"
          type="password"
          label="Old Password"
          {...bindOldPassword}
          fullWidth
        />
        <TextField
          className={classes.settingsMargin}
          variant="outlined"
          color="secondary"
          name="updatePassword"
          type="password"
          label="Update Password"
          {...bindUpdatePassword}
          fullWidth
        />
        <TextField
          className={classes.settingsMargin}
          variant="outlined"
          color="secondary"
          name="confirmPassword"
          type="password"
          label="Confirm New Password"
          {...bindConfirmPassword}
          fullWidth
        />
        <Typography
          variant="body2"
          color="textSecondary"
          className={classes.settingsMargin}
        >
          Make sure your password is at least 15 characters long OR at least 8
          characters including a number and a special character.
        </Typography>
        <Button
          className={classes.largeButton}
          variant="contained"
          color="secondary"
          id="password"
          onClick={handleFormSubmit}
        >
          SUBMIT
        </Button>
      </form>
      <br />
      <Typography
        className={classes.headerText}
        style={{ marginBottom: "15px" }}
      >
        Two-factor Authentication
      </Typography>
      <Typography
        className={classes.bodyText}
        style={{ marginBottom: "15px" }}
        variant="body2"
      >
        You don't currently have two-factor authentication enabled.
      </Typography>
      <Button
        className={classes.largeButton}
        variant="contained"
        color="secondary"
        id="twoFactor"
      >
        ENABLE TWO-FACTOR AUTHENTICATION
      </Button>
    </>
  );
};

export default General;
