import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { useSelector, useDispatch } from "react-redux";

import { useInput } from "../hooks/UtilityHooks";

import { logInUser } from "../api/userApi";

import { setIsLoading, setUserFetched, fetchUser } from "../redux/slices/userSlice";

import BrandHubLogo from "../assets/brandhub.svg";

import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";
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

// const userTypes = [
//   "super",
//   "field1",
//   "field2",
//   "compliance",
//   "marketing",
//   "creative",
// ];

const Login = ({ setAuth }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const currentRole = useSelector((state) => state.user.role)

  const {
    value: userName,
    bind: bindUserName,
    reset: resetUserName,
  } = useInput("");
  const {
    value: password,
    bind: bindPassword,
    reset: resetPassword,
  } = useInput("");

  const [error, setError] = useState({ user: undefined });
  const isLoading = useSelector((state) => state.user.isLoading)

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    dispatch(setIsLoading());
    const response = await logInUser(userName, password) 
    console.log(response)
    if (response.status === "ok") {
      resetUserName()
      resetPassword()
      await dispatch(fetchUser())
    } else if (response.error) {
      resetUserName()
      resetPassword()
      setError({error: response.error})
      dispatch(setUserFetched())
    }
  };

  useEffect(()=>{
    if (currentRole.length !== 0) {
      setAuth(currentRole)
      dispatch(setUserFetched)
    }
  }, [currentRole, dispatch, setAuth])
  
  if (isLoading) {
    return (
      <Backdrop className={classes.backdrop} open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    )
  }

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
              helperText={error.error}
              error={error.error ? true : false}
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
              helperText={error.error}
              error={error.error ? true : false}
              {...bindPassword}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container justify="center" alignItems="center">
              <Grid item xs={5}>
                <Link href="#" color="secondary" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item xs={7}>
                <Link href="#" color="secondary" variant="body2">
                  {"Don't have an account? Sign Up"}
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
