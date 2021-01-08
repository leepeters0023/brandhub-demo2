import React, { useEffect } from "react";
import PropTypes from "prop-types";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const Help = ({ handleFiltersClosed }) => {
  const classes = useStyles();

  useEffect(() => {
    handleFiltersClosed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Container className={classes.mainWrapper}>
        <div
          style={{
            height: "70vh",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid container>
            <Grid item sm={2} xs={1} />
            <Grid item sm={8} xs={10} style={{ textAlign: "center" }}>
              <Typography className={classes.titleText} variant="h5">
                Brandhub Help
              </Typography>
              <br />
              <Typography className={classes.bodyText}>
                If you have any immediate questions, please contact Select
                Design. We are happy to help!
              </Typography>
              <br />
              <Typography className={classes.headerText}>
                General Contact Information
              </Typography>
              <Typography className={classes.bodyText}>
                Phone: 802-864-9075
              </Typography>
              <Typography className={classes.bodyText}>
                Email: help@brandhub.com
              </Typography>
              <Typography className={classes.bodyText}>
                Please allow up to 12 hours to receive a response from us.
              </Typography>
            </Grid>
            <Grid item sm={2} xs={1} />
          </Grid>
        </div>
      </Container>
    </>
  );
};

Help.propTypes = {
  handleFiltersClosed: PropTypes.func.isRequired,
};

export default Help;
