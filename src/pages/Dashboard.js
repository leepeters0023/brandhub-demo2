import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import DashboardFieldOne from "../components/Dashboard/DashboardFieldOne";
import DashboardCompliance from "../components/Dashboard/DashboardCompliance";

import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const Dashboard = () => {
  const classes = useStyles();
  const [currentRole, setCurrentRole] = useState(undefined)

  const isLoading = useSelector(state => state.user.isLoading)
  const role = useSelector(state => state.user.role)

  useEffect(()=>{
    if (role.length > 0) {
      setCurrentRole(role)
    }
  }, [role])

  if (isLoading) {
    return (
      <Backdrop className={classes.backdrop} open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    )
  }

  return (
    <>
      <Container className={classes.mainWrapper}>
        
          {currentRole === "field1" && <DashboardFieldOne />}
          {currentRole === "field2" && <DashboardFieldOne />}
          {currentRole === "super" && <DashboardFieldOne />}
          {currentRole === "compliance" && <DashboardCompliance />}
    
      </Container>
      <br />
    </>
  );
};

export default Dashboard;
