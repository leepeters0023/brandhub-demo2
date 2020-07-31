import React from "react";

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
    program: { name, imgUrl, desc, goals, timeframe },  
  } = props;

  return (
    <>
      <br />
      <Grid container spacing={5} justify="center" alignItems="center">
        <Grid item md={3} style={{ textAlign: "center" }}>
          <img src={imgUrl} className={classes.programImage} alt={name} />
          <Typography className={classes.bodyText}>{timeframe}</Typography>
        </Grid>
        <Grid item md={9}>
          <Typography className={classes.headerText}>Description</Typography>
          <Typography className={classes.bodyText}>{desc}</Typography>
          <br />
          <Typography className={classes.headerText}>Goals</Typography>
          <Typography className={classes.bodyText}>{goals}</Typography>
          <br />
          <Typography className={classes.headerText}>Marketing Strategy</Typography>
          <Typography className={classes.bodyText}>Officia culpa occaecat eu esse consectetur duis reprehenderit occaecat ea. Duis quis elit sint dolore consectetur nulla reprehenderit cupidatat ea. Enim mollit labore eiusmod id aliquip reprehenderit Lorem exercitation amet nisi ut.</Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default ProgramDetails;