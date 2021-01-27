import React from "react";
import PropTypes from "prop-types";

import ImageWrapper from "../Utility/ImageWrapper";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  programImage: {
    width: "90%",
    height: "90%",
    objectFit: "cover",
    borderRadius: "50%",
  },
}));

const ProgramDetails = (props) => {
  const classes = useStyles();
  const {
    program: {
      name,
      imgUrl,
      brand,
      orderWindowOpen,
      orderWindowClose,
      orderWindow,
      inMarketDate,
    },
  } = props;
  return (
    <>
      <br />
      <Grid container spacing={5} justify="center" alignItems="center">
        <Grid item md={1} />
        <Grid item md={5} style={{ textAlign: "center" }}>
          <div
            style={{
              width: "100%",
              paddingBottom: "100%",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: "Calc(100% - 100px)",
                height: "Calc(100% - 100px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "50px",
              }}
            >
              <ImageWrapper
                id={name}
                imgClass={classes.programImage}
                alt={name}
                imgUrl={imgUrl}
              />
            </div>
          </div>
        </Grid>
        <Grid item md={5} style={{textAlign: "center"}}>
          <Typography className={classes.headerText}>
            {brand.length === 1 ? "Brand" : "Brands"}
          </Typography>
          <Typography className={classes.bodyText}>
            {brand.length === 1 ? brand[0] : brand.join(", ")}
          </Typography>
          <br />
          <Typography className={classes.headerText}>Order Window Name</Typography>
          <Typography className={classes.bodyText}>{orderWindow}</Typography>
          <br />
          <Typography className={classes.headerText}>Order Window Open</Typography>
          <Typography className={classes.bodyText}>{orderWindowOpen}</Typography>
          <br />
          <Typography className={classes.headerText}>
            Order Window Close
          </Typography>
          <Typography className={classes.bodyText}>{orderWindowClose}</Typography>
          <br />
          <Typography className={classes.headerText}>
            In Market Date
          </Typography>
          <Typography className={classes.bodyText}>{inMarketDate}</Typography>
        </Grid>
        <Grid item md={1} />
      </Grid>
    </>
  );
};

ProgramDetails.propTypes = {
  program: PropTypes.object.isRequired,
};

export default ProgramDetails;
