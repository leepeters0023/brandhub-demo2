import React from "react";

import GalloLogo from "../assets/gallologo.png";

import ContactsByStateTable from "../components/ContactsByStateTable";

import Container from "@material-ui/core/Container";
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
      <Container className={classes.mainWrapper}>
        <div className={classes.titleImage}>
          <img className={classes.logo} src={GalloLogo} alt="Gallo" />
          <Typography className={classes.titleText} variant="h5">
            Contacts By State
          </Typography>
        </div>
        <br />
        <ContactsByStateTable data={contacts} />
      </Container>
    </>
  );
};

export default ContactsByState;