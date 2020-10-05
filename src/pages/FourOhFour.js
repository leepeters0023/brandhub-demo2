import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { navigate } from "@reach/router";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const FourOhFour = ({handleFiltersClosed}) => {
  const classes = useStyles();
  let redirectTime;

  useEffect(() => {
    if (window.location.pathname !== "/login") {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      redirectTime = setTimeout(() => {
        navigate("/");
      }, 5000);
    }
    return () => {
      clearTimeout(redirectTime)
    }
  }, []);

  useEffect(() => {
    handleFiltersClosed()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Container className={classes.mainWrapper}>
        <br />
        <br />
        <Grid container spacing={5}>
          <Grid item md={2} />
          <Grid item md={8} style={{ textAlign: "center" }}>
            <Typography
              variant="h2"
              color="error"
              style={{ fontWeight: "600" }}
            >
              Whoops! Can't go there!
            </Typography>
            <br />
            <Typography className={classes.headerText}>
              Either you don't have permission to visit this page, or something
              went wrong...
            </Typography>
            <br />
            <Button
              href="/"
              color="secondary"
              variant="contained"
              className={classes.largeButton}
            >
              Go Back Home
            </Button>
            <br />
            <br />
            <br />
            <Typography className={classes.bodyText}>
              You will be redirected back home in five seconds....
            </Typography>
          </Grid>
        </Grid>
      </Container>
      <br />
    </>
  );
};

FourOhFour.propTypes = {
  handleFiltersClosed: PropTypes.func.isRequired
}

export default FourOhFour;
