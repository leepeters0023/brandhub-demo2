import React from "react";
import { Link } from "@reach/router";
import Logo from "../assets/RTA_Logo_Stacked.png";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  logo: {
    width: "75%",
    height: "auto",
    minWidth: "500px",
  }
}));

const Landing = () => {
  const classes = useStyles();

  return (
    <>
      <Container className={classes.mainWrapper}>
        <div
          style={{
            height: "70vh",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid container>
            <Grid item sm={2} xs={1} />
            <Grid item sm={8} xs={10} style={{ textAlign: "center" }}>
              <img src={Logo} className={classes.logo} alt="Welcome to RTA" />
              <br />
              <br />
              <Typography className={classes.bodyText}>
                Maybe we could have some sort of description here? Make a nice info page for anyone who happens upon our generic url?
              </Typography>
              <br />
              <br />
              <Button component={Link} to="/oauth">LOG IN</Button>
            </Grid>
            <Grid item sm={2} xs={1} />
          </Grid>
        </div>
      </Container>
    </>
  );
};

export default Landing;