import React from "react";
import { Link } from "@reach/router";

import BackgroundImg from "../assets/background.jpg";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  topImage: {
    position: "relative",
    backgroundImage: `url(${BackgroundImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "Calc(100vh - 64px)",
    overflowX: "hidden",
  },
  paper: {
    padding: "40px",
  },
  welcomeText: {
    position: "absolute",
    top: "Calc(50% - 150px)",
    fontWeight: "600",
    color: "white",
  },
  subTitle: {
    fontWeight: "600",
    color: "#4C4C4C",
  },
  content: {
    fontSize: "1.25rem",
    color: "#4C4C4C",
  },
  landingGrid: {
    position: "absolute",
    top: "50%",
  },
  buttons: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
  },
}));

const Landing = () => {
  const classes = useStyles();
  return (
    <div className={classes.topImage}>
      <Grid container spacing={7}>
        <Grid item sm={1} xs={1} />
        <Grid item sm={5} xs={10}>
          <Typography variant="h2" className={classes.welcomeText}>
            Welcome To
            <br />
            Brandhub!
          </Typography>
        </Grid>
      </Grid>
      <Grid className={classes.landingGrid} container spacing={7}>
        <Grid item sm={1} xs={1}/>
        <Grid item sm={5} xs={10}>
          <Paper className={classes.paper}>
            <Typography variant="h4" className={classes.subTitle}>
              Place an Order
            </Typography>
            <br />
            <Typography variant="h5" className={classes.content}>
              The select platform provides access to place different types of
              Off-Premise Orders:
            </Typography>
            <br />
            <div className={classes.buttons}>
              <Button
                className={classes.largeButton}
                color="primary"
                variant="contained"
                component={Link}
                to="/order"
              >
                PLACE AN ORDER
              </Button>
            </div>
          </Paper>
        </Grid>
        <Grid item sm={5} xs={10}>
          <Paper className={classes.paper}>
            <Typography variant="h4" className={classes.subTitle}>
              Dynamic Coupons
            </Typography>
            <br />
            <Typography variant="h5" className={classes.content}>
              Dynamic coupons enables merchants to create, personalize and submit coupons on demand
            </Typography>
            <br />
            <Button
              className={classes.largeButton}
              color="primary"
              variant="contained"
              component={Link}
              to="/coupons"
            >
              CREATE A COUPON
            </Button>
          </Paper>
        </Grid>
        <Grid item sm={1} xs={1} />
      </Grid>
    </div>
  );
};

export default Landing;
