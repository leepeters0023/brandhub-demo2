import React from "react";

import GalloLogo from "../assets/gallologo.png";

import ContactsByStateTable from "../components/ContactsByStateTable";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

//mockdata
import { contacts } from "../assets/mockdata/stateContacts";


const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const ContactsByState = () => {
  const classes = useStyles();

  return (
    <>
      <Paper className={classes.paperContainer}>
        <div className={classes.titleImage}>
          <img className={classes.logo} src={GalloLogo} alt="Gallo" />
          <Typography className={classes.titleText} variant="h5">
            Contacts By State
          </Typography>
        </div>
        <br />
        <ContactsByStateTable data={contacts} />
      </Paper>
    </>
  );
};

export default ContactsByState;