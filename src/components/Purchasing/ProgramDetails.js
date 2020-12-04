import React from "react";
import PropTypes from "prop-types";

import { addDefaultImg } from "../../utility/utilityFunctions";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  programImage: {
    width: "90%",
    height: "auto",
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
          <img src={imgUrl} onError={addDefaultImg} className={classes.programImage} alt={name} />
          <Typography className={classes.bodyText}>{`Focus Month: ${focusMonth}`}</Typography>
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
          <Typography className={classes.headerText}>Marketing Strategy</Typography>
          <Typography className={classes.bodyText}>{strategies}</Typography>
        </Grid>
      </Grid>
    </>
  );
};

ProgramDetails.propTypes = {
  program: PropTypes.object.isRequired
}

export default ProgramDetails;
