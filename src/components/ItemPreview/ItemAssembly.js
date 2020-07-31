import React from "react";

import ReactPlayer from "react-player/lazy";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core";

const url = "https://www.youtube.com/watch?v=CGP2N8BGXms"

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  instructions: {
    [theme.breakpoints.down("md")]: {
      textAlign: "center"
    }
  }
}));

const ItemOneSheet = () => {
  const classes = useStyles();
  return (
    <>
      <Container className={classes.modalTabContainer}>
        <Grid container spacing={2} justify="center" >
          <Grid item lg={8} md={12}>
            <ReactPlayer url={url} style={{margin: "0 auto"}}/>
          </Grid>
          <Grid item lg={4} md={12} className={classes.instructions}>
            <Typography className={classes.headerText}>
              Assembly Instructions:
            </Typography>
            <br />
            <Typography className={classes.bodyText}>
              - Ex voluptate ex dolore duis voluptate.
            </Typography>
            <Typography className={classes.bodyText}>
              - Ex voluptate ex dolore duis voluptate.
            </Typography>
            <Typography className={classes.bodyText}>
              - Ex voluptate ex dolore duis voluptate.
            </Typography>
            <Typography className={classes.bodyText}>
              - Ex voluptate ex dolore duis voluptate.
            </Typography>
            <Typography className={classes.bodyText}>
              - Ex voluptate ex dolore duis voluptate.
            </Typography>
          </Grid>
        </Grid>
      </Container>
      <br />
    </>
  );
};

export default ItemOneSheet;