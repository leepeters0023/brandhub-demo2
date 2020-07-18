import React from "react";

import GalloLogo from "../assets/gallologo.png";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const Compliance = () => {
  const classes = useStyles();

  return (
    <div>
      <Paper className={classes.paperContainer}>
        <div className={classes.titleImage}>
          <img className={classes.logo} src={GalloLogo} alt="Gallo" />
          <Typography className={classes.titleText} variant="h5">
            Compliance
          </Typography>
        </div>
      </Paper>
    </div>
  );
};

export default Compliance;