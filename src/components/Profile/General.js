import React from "react";

import { useSelector } from "react-redux";

import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  profileText: {
    
  }
}));

const General = () => {
  const classes = useStyles();

  const currentUser = useSelector((state) => state.user)
  console.log(currentUser)
  // const [info, setInfo] = useState({
  //   first: currentUser.firstName,
  //   last: currentUser.lastName,
  //   email: currentUser.email,
  //   role: currentUser.role,
  // });

  // const { value: firstName, bind: bindFirstName } = useInput(info.first);
  // const { value: lastName, bind: bindLastName } = useInput(info.last);
  // const { value: email, bind: bindEmail } = useInput(info.email);
  // const { value: role, bind: bindRole } = useInput(info.role);
  // const { value: oldPassword, bind: bindOldPassword } = useInput("");
  // const { value: updatePassword, bind: bindUpdatePassword } = useInput("");
  // const { value: confirmPassword, bind: bindConfirmPassword } = useInput("");

  // const handleFormSubmit = (evt) => {
  //   evt.preventDefault();
  //   //temporarily removing unused vars so build will work on netlify, not permenant
  //   console.log(oldPassword, updatePassword, confirmPassword)
  //   if (evt.target.id==="profile") {
  //     setInfo({
  //       first: firstName,
  //       last: lastName,
  //       email: email,
  //       role: role,
  //     })
  //   }
  // };

  return (
    <>
      <Typography className={classes.titleText}>Profile Information</Typography>
      <br />
      <Typography>First Name: {currentUser.firstName} </Typography>
      <Typography>Last Name: {currentUser.lastName}</Typography>
      <Typography>Email: {currentUser.email}</Typography>
      <Typography>Role:{currentUser.role}</Typography>
      <div style={{ display: "flex", flexDirection: "row", alignContent: "center" }}>
        <Typography>On Premise:<Checkbox disabled checked={currentUser.isOnPremise ? true : false} />
        </Typography>
        <Typography>Retail:<Checkbox disabled checked={currentUser.isRetail ? true : false} />
        </Typography>
      </div>
      <Typography>Territory: {currentUser.territories.map((item) => item.name)} </Typography>
      <Typography>State:{currentUser.state}</Typography>
      {/* <Button
          className={classes.largeButton}
          variant="contained"
          color="secondary"
          id="profile"
          onClick={handleFormSubmit}
        >
          SUBMIT
        </Button>
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
      */}
    </>
  );
};

export default General;
