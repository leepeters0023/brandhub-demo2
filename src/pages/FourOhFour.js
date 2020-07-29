import React from 'react'

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid"

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}))

const FourOhFour = () => {
  const classes = useStyles();
  return (
    <>
    <Container className={classes.mainWrapper}>
      <Grid container spacing={5} >
        <Grid item md={2} />
        <Grid item md={8}>
          
            <Typography variant="h1" color="error">
              Whoops! Can't go there!
            </Typography>
            <br/>
            <Typography className={classes.headerText}>
              Either you don't have permission to visit this page, or something went wrong...
            </Typography>
            <br/>
            <Button href="/" color="primary">
              Go Back Home
            </Button>
          
        </Grid>
      </Grid>
      </Container>
    </>
  )
}

export default FourOhFour;