import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "@reach/router";

import DashboardFieldOne from "../components/Dashboard/DashboardFieldOne";
//import DashboardCompliance from "../components/Dashboard/DashboardCompliance";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  dashboardGridItem: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  dashPaper: {
    backgroundColor: "whitesmoke",
    width: "100%",
    paddingBottom: "100%",
    position: "relative",
  },
  innerPaper: {
    position: "absolute",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "25px",
  }
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
      <Container className={classes.mainWrapper} style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
      <div style={{ width: "100%", textAlign: "center" }}>
        <Typography className={classes.titleText}>
          {`Welcome back ${name}!`}
        </Typography>
      </div>
      <br />
      <br />
      <br />
        <Grid container spacing={6} justify="center" style={{width: "95%"}}>
          <Grid item md={3} sm={6} xs={12} component={Link} to="/programs">
            <div className={classes.dashboardGridItem}>

            <Paper className={classes.dashPaper}>
              <div className={classes.innerPaper}>
                <Typography className={classes.titleText}>
                  Pre-Order
                </Typography>
              </div>

            </Paper>
            </div>
          </Grid>
          <Grid item md={3} sm={6} xs={12} component={Link} to="/orders/items/instock">
            <div className={classes.dashboardGridItem}>

            <Paper className={classes.dashPaper}>
              <div className={classes.innerPaper}>
              <Typography className={classes.titleText}>
                  Place In-Stock Order
                </Typography>
              </div>
              
            </Paper>
            </div>
          </Grid>
          <Grid item md={3} sm={6} xs={12} component={Link} to="/orders/items/ondemand">
            <div className={classes.dashboardGridItem}>

            <Paper className={classes.dashPaper}>
              <div className={classes.innerPaper}>
              <Typography className={classes.titleText}>
                  Place On-Demand Order
                </Typography>
              </div>
              
            </Paper>
            </div>
          </Grid>
          <Grid item md={3} sm={6} xs={12} >
            <div className={classes.dashboardGridItem}>

            <Paper className={classes.dashPaper}>
              <div className={classes.innerPaper}>
              <Typography className={classes.titleText}>
                  Coupons
                </Typography>
              </div>
              
            </Paper>
            </div>
          </Grid>
        </Grid>
        
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
