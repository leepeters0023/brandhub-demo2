import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import DashboardFieldOne from "../components/Dashboard/DashboardFieldOne";
//import DashboardCompliance from "../components/Dashboard/DashboardCompliance";

// import CircularProgress from "@material-ui/core/CircularProgress";
// import Backdrop from "@material-ui/core/Backdrop";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const Dashboard = () => {
  const classes = useStyles();
  const [currentRole, setCurrentRole] = useState(undefined)

  const role = useSelector(state => state.user.role)
  const name = useSelector(state => state.user.firstName)

  useEffect(()=>{
    if (role.length > 0) {
      setCurrentRole(role)
    }
  }, [role])

  return (
    <>
      <Container className={classes.mainWrapper}>
        
          {currentRole === "field1" && <DashboardFieldOne name={name} />}
          {currentRole === "field2" && <DashboardFieldOne name={name} />}
          {currentRole === "super" && <DashboardFieldOne name={name} />}
          {currentRole === "compliance" && <DashboardFieldOne name={name} />}
    
      </Container>
      <br />
    </>
  );
};

export default Dashboard;
