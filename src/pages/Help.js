import React from "react";

import GalloLogo from "../assets/gallologo.png";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const Help = () => {
  const classes = useStyles();

  return (
    <div>
      <Paper className={classes.paperContainer}>
        <div className={classes.titleImage}>
          <img className={classes.logo} src={GalloLogo} alt="Gallo" />
          <Typography className={classes.titleText} variant="h5">
            Help
          </Typography>
        </div>
        <br />
        <br />
        <hr />
        <br />
        <br />
        <Grid container>
          <Grid item sm={2} xs={1} />
          <Grid item sm={8} xs={10}>
            <Typography className={classes.titleText} variant="h5">
              Brandhub Help
            </Typography>
            <br/>
            <Typography className={classes.bodyText}>
              If you have any immediate questions, please contact Select Design. We are happy to help!
            </Typography>
            <br/>
            <Typography className={classes.headerText}>
              General Contact Information
            </Typography>
            <Typography className={classes.bodyText}>
              Phone: 802-864-9075
            </Typography>
            <Typography className={classes.bodyText}>
              Email: help@brandhub.com
            </Typography>
            <Typography className={classes.bodyText}>
              Please allow up to 12 hours to receive a response from us.
            </Typography>
          </Grid>
          <Grid item sm={2} xs={1} />
        </Grid>
        <br/>
        <br/>
      </Paper>
    </div>
  );
};

export default Help;
