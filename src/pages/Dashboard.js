import React, { useState, useEffect } from "react";

import DashboardFieldOne from "../components/Dashboard/DashboardFieldOne";
import DashboardCompliance from "../components/Dashboard/DashboardCompliance";

import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  centerGrid: {
    width: "100%",
    height: "Calc(100vh - 150px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      height: "auto",
      flexDirection: "column",
      justifyContent: "flex-start",
    }
  },
}));

const Dashboard = () => {
  const classes = useStyles();

  const [currentUser, setCurrentUser] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    let user = window.localStorage.getItem("user");
    if (user) {
      setCurrentUser(user);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <>
      <Container className={classes.mainWrapper}>
        <div className={classes.centerGrid}>
          {currentUser === "field1" && <DashboardFieldOne />}
          {currentUser === "field2" && <DashboardFieldOne />}
          {currentUser === "super" && <DashboardFieldOne />}
          {currentUser === "compliance" && <DashboardCompliance />}
        </div>
      </Container>
      <br />
    </>
  );
};

export default Dashboard;
