import React from "react";
import PropTypes from "prop-types";

import { useSelector, useDispatch } from "react-redux";

import { useInput } from "../hooks/UtilityHooks";

import { logIn } from "../redux/slices/userSlice";

import BrandHubLogo from "../assets/brandhub.svg";

import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme) => ({
  welcomContainer: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    position: "fixed",
    top: 0,
    left: 0,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  welcome: {
    fontWeight: "800",
  },
  loginContainer: {
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
    filter: "brightness(0%)",
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    color: "#FFFFFF",
    fontSize: "1.25rem",
    fontWeight: "600",
    margin: theme.spacing(3, 0, 2),
  },
}));

const Login = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { value: userName, bind: bindUserName } = useInput("");
  const { value: password, bind: bindPassword } = useInput("");

  const error = useSelector((state) => state.user.error);
  const isLoading = useSelector((state) => state.user.loginIsLoading);

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    await dispatch(logIn(userName, password));
  };

  return (
    <div className={classes.welcomContainer}>
      <img src={BrandHubLogo} className={classes.logo} alt="Logo" />
      <Container
        className={classes.loginContainer}
        component="main"
        maxWidth="xs"
      >
        <CssBaseline />
        <div className={classes.paper}>
          <Typography className={classes.welcome} component="h1" variant="h2">
            Welcome
          </Typography>
          <Typography variant="h5">Sign in to access your account</Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              color="secondary"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              helperText={
                error
                  ? error.includes("status code 422")
                    ? "Invalid username or password"
                    : error
                  : null
              }
              error={error ? true : false}
              {...bindUserName}
            />
            <TextField
              color="secondary"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              helperText={
                error
                  ? error.includes("status code 422")
                    ? "Invalid username or password"
                    : error
                  : null
              }
              error={error ? true : false}
              {...bindPassword}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              className={classes.submit}
            >
              {!isLoading ? "Sign In" : <CircularProgress />}
            </Button>
            <Grid container justify="center" alignItems="center">
              <Grid item xs={12} style={{textAlign: "center"}}>
                <Link href="#" color="secondary" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </div>
  );
};

Login.propTypes = {
  setAuth: PropTypes.func.isRequired,
};

export default Login;
