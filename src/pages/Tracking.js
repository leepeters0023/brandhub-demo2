import React from "react";

import TrackingTable from "../components/TrackingTable";

import GalloLogo from "../assets/gallologo.png";

import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const Tracking = () => {
  const classes = useStyles();
  return (
    <>
      <Paper className={classes.paperContainer}>
        <div className={classes.titleImage}>
          <img className={classes.logo} src={GalloLogo} alt="Gallo" />
          <Typography className={classes.titleText} variant="h5">
            Tracking
          </Typography>
        </div>
        <br/>
        <br/>
        <TrackingTable />
      </Paper>
    </>
  );
};

export default Tracking;
