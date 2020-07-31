import React from "react";

import GalloLogo from "../assets/gallologo.png";

import RulesByStateTable from "../components/RulesByStateTable";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

//mockdata
import { rules } from "../assets/mockdata/stateRules";


const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const RulesByState = () => {
  const classes = useStyles();

  return (
    <>
      <Container className={classes.mainWrapper}>
        <div className={classes.titleImage}>
          <img className={classes.logo} src={GalloLogo} alt="Gallo" />
          <Typography className={classes.titleText} variant="h5">
            Rules By State
          </Typography>
        </div>
        <br />
        <RulesByStateTable data={rules} />
      </Container>
      <br />
    </>
  );
};

export default RulesByState;
