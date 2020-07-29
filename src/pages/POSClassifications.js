import React from "react";

import GalloLogo from "../assets/gallologo.png";


import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const POSClassifications = () => {
  const classes = useStyles();

  return (
    <>
      <Container className={classes.mainWrapper}>
        <div className={classes.titleImage}>
          <img className={classes.logo} src={GalloLogo} alt="Gallo" />
          <Typography className={classes.titleText} variant="h5">
            POS Classifications
          </Typography>
        </div>
      </Container>
    </>
  );
};

export default POSClassifications;
