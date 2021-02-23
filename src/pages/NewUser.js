import React, { useEffect } from "react";
import PropTypes from "prop-types";

import { useSelector } from "react-redux";

import Logo from "../assets/RTA_Logo_Stacked.png";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  newUserWrapper: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    position: "fixed",
    top: 0,
    left: 0,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  infoWrapper: {
    height: "80vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    position: "fixed",
    top: "20px",
    left: "20px",
    width: "150px",
    height: "auto",
    filter: "brightness(0%)",
  },
  logout: {
    position: "fixed",
    top: "20px",
    right: "20px",
  },
}));

const NewUser = ({ handleFiltersClosed, handleLogout }) => {
  const classes = useStyles();

  const firstName = useSelector((state) => state.user.firstName);
  const lastName = useSelector((state) => state.user.lastName);

  useEffect(() => {
    handleFiltersClosed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.newUserWrapper}>
      <img src={Logo} className={classes.logo} alt="Logo" />
      <Button
        className={clsx(classes.logout, classes.largeButton)}
        variant="contained"
        color="secondary"
        onClick={handleLogout}
      >
        LOGOUT
      </Button>
      <Container className={classes.infoWrapper}>
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
              <Typography className={classes.titleText} variant="h5">
                {`Welcome to Brandhub ${firstName} ${lastName}`}
              </Typography>
            </Grid>
            <Grid item sm={2} xs={1} />
          </Grid>
        </div>
      </Container>
    </div>
  );
};

NewUser.propTypes = {
  handleFiltersClosed: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired,
};

export default NewUser;
