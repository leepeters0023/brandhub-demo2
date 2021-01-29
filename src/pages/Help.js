import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";

import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import GetAppIcon from '@material-ui/icons/GetApp';
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton"

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  divider: {
    width: "100%",
  },
}));

const Help = ({ handleFiltersClosed }) => {
  const classes = useStyles();
  const helpData = [
    {
      text: "Field User Guide -- BDM's", //field1 aka sales
      linkTo: 'https://s3.amazonaws.com/helpscout.net/docs/assets/5fd9057b7fd4415d7b898720/attachments/601443ae1f25b9041beb96c2/SELDE.2101.RTA_IMPLEMENTATION_DOCUMENTATION_SALES_118501.pdf',
      id: '5ffdf334b9a8501b295cf995',
    },
    {
      text: "Order Review Guide -- BAM's/CAM's", // field2, aka "brand activation manager", aka forward deployed
      linkTo: 'https://s3.amazonaws.com/helpscout.net/docs/assets/5fd9057b7fd4415d7b898720/attachments/601442ba6867724dfc6ed8b9/SELDE.2101.RTA_IMPLEMENTATION_DOCUMENTATION_FORWARDDEPLOYED_118501.pdf',
      id: '600af2ff1c64ad47e4b7201d',
    },
    {
      text: "Ops User Guide", // aka purchaser 
      linkTo: 'https://s3.amazonaws.com/helpscout.net/docs/assets/5fd9057b7fd4415d7b898720/attachments/6014436c6867724dfc6ed8c9/SELDE.2101.RTA_IMPLEMENTATION_DOCUMENTATION_PURCHASERGUIDE_118501.pdf',
      id: '601438192042ff6d1b2a8ab3',
    },
    {
      text: "View Only User Guide",
      linkTo: 'https://s3.amazonaws.com/helpscout.net/docs/assets/5fd9057b7fd4415d7b898720/attachments/601444366867724dfc6ed8d7/SELDE.2101.RTA_IMPLEMENTATION_DOCUMENTATION_VIEWONLYGUIDE_118501.pdf',
      id: '600ed315c64fe14d0e1fe351',
    },
    {
      text: "Finance User Guide",
      linkTo: 'https://s3.amazonaws.com/helpscout.net/docs/assets/5fd9057b7fd4415d7b898720/attachments/601441c5a4cefb30ae5c560a/SELDE.2101.RTA_IMPLEMENTATION_DOCUMENTATION_FINANCEGUIDE_118501.pdf',
      id: '600ed398cfe30d219ccdb224',
    },
    {
      text: "Supplier User Guide",
      linkTo: 'https://s3.amazonaws.com/helpscout.net/docs/assets/5fd9057b7fd4415d7b898720/attachments/601443f6ac2f834ec538347f/SELDE.2101.RTA_IMPLEMENTATION_DOCUMENTATION_SUPPLIERQUICKSTARTGUIDE_118501.pdf',
      id: '601438c22042ff6d1b2a8abb',
    },
    // {
    //   text: " Compliance User Guide",
    //   linkTo: null
    //   this is still with creative
    // },
  ]

  useEffect(() => {
    handleFiltersClosed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openGuide = (url) => {
    window.open(url, '_blank');
  }

  return (
    <>
    <Helmet><title>RTA | Help</title>
    <script type="text/javascript">{`Beacon('close')`}</script>
    </Helmet>
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
            sm={12}
            xs={12}
            key={i}
          >
            <Divider className={classes.divider} />
            <div style={{ display: "flex", height: "175px", flexDirection: "row", alignItems: "center", }}>
              <Typography className={classes.titleText}>
                {data.text}
              </Typography>
              <IconButton
                onClick={() => openGuide(data.linkTo)}>
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
            Email: help@readytoactivate.com
            </Typography>
          <Typography className={classes.bodyText}>
            Please allow up to 12 hours to receive a response from us.
            </Typography>
        </div>
      </Grid>
    </Container>
    </>
  );
};

Help.propTypes = {
  handleFiltersClosed: PropTypes.func.isRequired,
};

export default Help;
