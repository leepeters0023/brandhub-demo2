import React from "react";
import PropTypes from "prop-types";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const ApproveOrDenyItem = ({ handleFiltersClosed }) => {
  const classes = useStyles();

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
                Approve or deny this
              </Typography>
              <br />
              <Typography className={classes.bodyText}>
               Some buttons and logic that passes an approve or deny value back to API
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

export default ApproveOrDenyItem;
