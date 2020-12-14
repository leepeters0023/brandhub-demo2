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
    program: { name, imgUrl, desc, goals, focusMonth, strategies, brand },
  } = props;
  return (
    <>
      <br />
      <Grid container spacing={5} justify="center" alignItems="center">
        <Grid item md={3} style={{ textAlign: "center" }}>
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
                width: "Calc(100% - 50px)",
                height: "Calc(100% - 50px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "25px",
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
          <Typography
            className={classes.bodyText}
          >{`Focus Month: ${focusMonth}`}</Typography>
        </Grid>
        <Grid item md={9}>
          <Typography className={classes.headerText}>
            {brand.length === 1 ? "Brand" : "Brands"}
          </Typography>
          <Typography className={classes.bodyText}>
            {brand.length === 1 ? brand[0] : brand.join(", ")}
          </Typography>
          <br />
          <Typography className={classes.headerText}>Description</Typography>
          <Typography className={classes.bodyText}>{desc}</Typography>
          <br />
          <Typography className={classes.headerText}>Goals</Typography>
          <Typography className={classes.bodyText}>{goals}</Typography>
          <br />
          <Typography className={classes.headerText}>
            Marketing Strategy
          </Typography>
          <Typography className={classes.bodyText}>{strategies}</Typography>
        </Grid>
      </Grid>
    </>
  );
};

ProgramDetails.propTypes = {
  program: PropTypes.object.isRequired,
};

export default ProgramDetails;
