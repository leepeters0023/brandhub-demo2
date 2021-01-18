import React from "react";
import PropTypes from "prop-types";

import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
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
      RTA logo
        <div
          style={{
            height: "90vh",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid container>
            <Grid item sm={2} xs={1} />
            <Grid item sm={8} xs={10} style={{ textAlign: "center"}}>
              <Typography className={classes.titleText} variant="h5">
                Approve or deny this
              </Typography>
              <br />
              <div 
                style={{display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                }}>
                <Button
                    className={classes.largeButton}
                    style={{width: "150px", margin: "10px"}}
                    variant="contained" 
                    onClick={() => { /*do something */}}
                      >
                        Approve
                </Button>
            
            
                <Button
                    className={classes.largeButton}
                    style={{width: "150px", margin: "10px"}}
                    variant="contained"
                    onClick={() => { /*do something */}}
                      >
                        Deny
                </Button>
                </div>
            </Grid>
          </Grid>
        </div>
            <Typography className={classes.titleText} style={{bottom: "0", float: "right"}} variant="h5">
                    need help?
            </Typography>
      </Container>
    </>
  );
};

ApproveOrDenyItem.propTypes = {
  handleFiltersClosed: PropTypes.func.isRequired,
};

export default ApproveOrDenyItem;
