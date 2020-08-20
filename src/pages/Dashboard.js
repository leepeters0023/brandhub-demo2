import React, { useState, useEffect } from "react";

import DashboardFieldOne from "../components/Dashboard/DashboardFieldOne";
import DashboardCompliance from "../components/Dashboard/DashboardCompliance";

import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
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
        
          {currentUser === "field1" && <DashboardFieldOne />}
          {currentUser === "field2" && <DashboardFieldOne />}
          {currentUser === "super" && <DashboardFieldOne />}
          {currentUser === "compliance" && <DashboardCompliance />}
    
      </Container>
      <br />
    </>
  );
};

export default Dashboard;
