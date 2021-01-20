import React, { useEffect } from "react";
import PropTypes from "prop-types";


import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import GetAppIcon from '@material-ui/icons/GetApp';
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  divider: {
    width: "100%",
  },
  dashPaper: {
    backgroundColor: "white",
    width: "100%",
    height: "150px",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }
}));

const Help = ({ handleFiltersClosed }) => {
  const classes = useStyles();
  const helpData = [
    {
      text: "Field User Guide -- BDM's",
      linkTo: null
    },
    {
      text: "Order Review Guide -- BAM's/CAM's",
      linkTo: null
    },
    {
      text: "Ops User Guide",
      linkTo: null
    },
    {
      text: "View Only User Guide",
      linkTo: null
    },
    {
      text: "Finance User Guide",
      linkTo: null
    },
    {
      text: "Supplier User Guide",
      linkTo: null
    },
    {
      text: " Compliance User Guide",
      linkTo: null
    },
  ]

  useEffect(() => {
    handleFiltersClosed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      className={classes.mainWrapper}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <br />
      <br />
      <Grid container spacing={3} justify="flex-start" style={{ width: "80%" }}>
        <div style={{ paddingLeft: "24px", width: "100%", textAlign: "left", marginBottom: "50px", }}>
          <Typography
            style={{
              fontWeight: "400",
              fontSize: "2rem",
              color: "#4C4C4C",
            }}
          >
            How can we help?
        </Typography>
        </div>
        {helpData.map((data, i) => (
          <Grid
            item
            lg={4}
            md={6}
            sm={6}
            xs={12}
            //component={Link}
            //to={data.link}
            key={i}
          >
            <Divider className={classes.divider} />
            <div style={{ display: "flex", height: "175px", flexDirection: "row", alignItems: "center", }}>
              <Typography className={classes.titleText}>
                {data.text}
              </Typography>
              <IconButton>
                <GetAppIcon color="secondary" />
              </IconButton>
            </div>
            <Divider className={classes.divider} />
          </Grid>
        ))}
         <div style={{ width: "100%", textAlign: "center", marginTop: "75px", }}>
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
        </div>
      </Grid>
    </Container>
  );
};

Help.propTypes = {
  handleFiltersClosed: PropTypes.func.isRequired,
};

export default Help;
