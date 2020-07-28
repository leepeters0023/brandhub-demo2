import React, { useState, useEffect } from "react";

import GalloLogo from "../assets/gallologo.png";

import DashboardFieldOne from "../components/Dashboard/DashboardFieldOne";
import DashboardCompliance from "../components/Dashboard/DashboardCompliance";

import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  paper: {
    padding: "40px",
  },
  welcomeText: {
    fontWeight: "600",
    color: "#4C4C4C",
  },
  subTitle: {
    fontWeight: "600",
    color: "#4C4C4C",
  },
  content: {
    fontSize: "1.25rem",
    color: "#4C4C4C",
  },
  buttons: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
  },
}));

const Dashboard = () => {
  const classes = useStyles();

  const [currentUser, setCurrentUser] = useState("")

  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    setLoading(true)
    let user = window.localStorage.getItem("user")
    if (user) {
      setCurrentUser(user)
      setLoading(false)
    }
  },[])

  if (loading) {
    return <CircularProgress />
  }

  return (
    <>
      <Paper className={classes.paperContainer}>
        <div className={classes.titleImage}>
          <img className={classes.logo} src={GalloLogo} alt="Gallo" />
          <Typography className={classes.welcomeText} variant="h4">
            {`Hello ~# user type: ${currentUser} #~ ! Welcome to Brandhub!`}
          </Typography>
        </div>
      </Paper>
      {currentUser === "field1" && <DashboardFieldOne />}
      {currentUser === "field2" && <DashboardFieldOne />}
      {currentUser === "super" && <DashboardFieldOne />}
      {currentUser === "compliance" && <DashboardCompliance />}
    </>
  );
};

export default Dashboard;
