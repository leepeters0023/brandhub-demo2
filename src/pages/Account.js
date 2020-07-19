import React, { useState } from "react";
import AddressBook from "../components/AddressBook";
import AccountDetails from "../components/AccountDetails";

import GalloLogo from "../assets/gallologo.png";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const Account = () => {
  const classes = useStyles();
  const [value, updateValue] = useState(1);

  const handleChange = (evt, newValue) => {
    updateValue(newValue);
  };

  return (
    <div>
      <Paper className={classes.paperContainer}>
        <div className={classes.titleImage}>
          <img className={classes.logo} src={GalloLogo} alt="Gallo" />
          <Typography className={classes.titleText} variant="h5">
            My Account
          </Typography>
        </div>
        <Tabs
          variant="fullWidth"
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          centered
        >
          <Tab className={classes.headerText} label="Account Details" value={1} />
          <Tab className={classes.headerText} label="Address Book" value={2} />
        </Tabs>
      </Paper>
      {value === 1 && <AccountDetails />}
      {value === 2 && <AddressBook />}
    </div>
  );
};

export default Account;
