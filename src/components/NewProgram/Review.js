import React from "react";
import PropTypes from "prop-types";

import { useSelector } from "react-redux";

import OrderItemViewControl from "../Purchasing/OrderItemViewControl";

import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import clsx from "clsx";

const Review = ({ classes, handlePreview }) => {
  let newProgram = useSelector((state) => state.newProgram);

  return (
    <>
      <br />
      <br />
      <Grid container spacing={5}>
        <Grid item sm={5} xs={12} className={classes.reviewGrid}>
          <div className={classes.headerTextLine}>
            <Typography
              className={clsx(classes.headerTextLineStart, classes.headerText)}
            >
              Name:
            </Typography>
            <Typography
              className={clsx(classes.headerTextLineStart, classes.bodyText)}
            >
              {newProgram.name}
            </Typography>
          </div>
          <br />
          <div className={classes.headerTextLine}>
            <Typography
              className={clsx(classes.headerTextLineStart, classes.headerText)}
            >
              Order Window:
            </Typography>
            <Typography
              className={clsx(classes.headerTextLineStart, classes.bodyText)}
            >
              {`${newProgram.orderStartDate} - ${newProgram.orderEndDate}`}
            </Typography>
          </div>
          <div className={classes.headerTextLine}>
            <Typography
              className={clsx(classes.headerTextLineStart, classes.headerText)}
            >
              In Market Window:
            </Typography>
            <Typography
              className={clsx(classes.headerTextLineStart, classes.bodyText)}
            >
              {`${newProgram.inMarketStartDate} - ${newProgram.inMarketEndDate}`}
            </Typography>
          </div>
        </Grid>
        <Grid item sm={7} xs={12} className={classes.reviewGrid}>
          <Typography className={classes.headerText}>Territories:</Typography>
          <br />
          <Typography className={classes.bodyText}>
            {newProgram.territories.map((terr) => terr.name).join(", ")}
          </Typography>
        </Grid>
      </Grid>
      <br />
      <OrderItemViewControl
        type={"new-program"}
        currentView={"grid"}
        handlePreview={handlePreview}
        items={newProgram.items}
        isItemsLoading={false}
      />
    </>
  );
};

Review.propTypes = {
  handlePreview: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default React.memo(Review);
