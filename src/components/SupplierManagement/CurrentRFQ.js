import React from "react";
import PropTypes from "prop-types";
// import { navigate } from "@reach/router";
import format from "date-fns/format";
import clsx from "clsx";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  bidText: {
    marginBottom: "5px",
  },
  gridBorder: {
    borderRight: "1px solid #cbcbcb",
    [theme.breakpoints.down("md")]: {
      borderRight: "0px solid black",
    },
  },
  fullHeightGridItem: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    height: "100%",
    width: "100%",
  },
  squareGridItem: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  squarePaper: {
    backgroundColor: "whitesmoke",
    width: "100%",
    paddingBottom: "100%",
    position: "relative",
  },
  squareInnerPaper: {
    position: "absolute",
    width: "Calc(100% - 50px)",
    height: "Calc(100% - 50px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "25px",
  },
  largePreview: {
    objectFit: "contain",
    width: "100%",
    heigth: "100%",
  }
}));

const CurrentRFQ = ({ currentRFQ }) => {
  const classes = useStyles();
  return (
    <>
      <Grid
        container
        spacing={5}
        style={{ width: "75%", minWidth: "600px" }}
        alignItems="stretch"
      >
        <Grid item lg={6} sm={12} className={classes.gridBorder}>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item sm={4}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  color="secondary"
                  className={classes.dateField}
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="quoteDue"
                  label="Quote Due"
                  value={
                    currentRFQ.dueDate !== "---"
                      ? format(new Date(currentRFQ.dueDate))
                      : format(new Date(), "MM/dd/yyyy")
                  }
                  //onChange={(value) => handleFilters(value, "toDate")}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </MuiPickersUtilsProvider>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  color="secondary"
                  className={classes.dateField}
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="dueDate"
                  label="Due Date"
                  value={
                    currentRFQ.inMarketDate !== "---"
                      ? format(new Date(currentRFQ.inMarketDate))
                      : format(new Date(), "MM/dd/yyyy")
                  }
                  //onChange={(value) => handleFilters(value, "toDate")}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </MuiPickersUtilsProvider>
              <br />
              <br />
              <Typography
                noWrap
                className={clsx(classes.headerText, classes.bidText)}
              >
                {`Program:`}
              </Typography>
              <Typography
                noWrap
                className={clsx(classes.headerText, classes.bidText)}
              >
                {`Brand(s):`}
              </Typography>
              <Typography
                noWrap
                className={clsx(classes.headerText, classes.bidText)}
              >
                {`Item Type:`}
              </Typography>
              <Typography
                noWrap
                className={clsx(classes.headerText, classes.bidText)}
              >
                {`Sequence Number:`}
              </Typography>
              <Typography
                noWrap
                className={clsx(classes.headerText, classes.bidText)}
              >
                {`Qty:`}
              </Typography>
            </Grid>
            <Grid item sm={8}>
              <Typography
                noWrap
                className={clsx(classes.headerText, classes.bidText)}
              >
                {currentRFQ.program}
              </Typography>
              <Typography
                noWrap
                className={clsx(classes.headerText, classes.bidText)}
              >
                {currentRFQ.brand}
              </Typography>
              <Typography
                noWrap
                className={clsx(classes.headerText, classes.bidText)}
              >
                {currentRFQ.itemType}
              </Typography>
              <Typography
                noWrap
                className={clsx(classes.headerText, classes.bidText)}
              >
                {currentRFQ.sequenceNum}
              </Typography>
              <Typography
                noWrap
                className={clsx(classes.headerText, classes.bidText)}
              >
                {currentRFQ.totalItems}
              </Typography>
            </Grid>
            <Grid item sm={12}>
              <TextField
                label="Supplier Notes"
                color="secondary"
                multiline
                fullWidth
                variant="outlined"
                size="small"
                rows="4"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={6} sm={12}>
          <div className={classes.fullHeightGridItem}>
            <Typography className={classes.titleText}>
              Product Specifications:
            </Typography>
            <br />
            <Grid container spacing={2}>
              <Grid item sm={3}>
                <Typography
                  noWrap
                  className={clsx(classes.headerText, classes.bidText)}
                >
                  Front 4-Color:
                </Typography>
                <Typography
                  noWrap
                  className={clsx(classes.headerText, classes.bidText)}
                >
                  Front Finish:
                </Typography>
                <Typography
                  noWrap
                  className={clsx(classes.headerText, classes.bidText)}
                >
                  Back 4-Color:
                </Typography>
                <Typography
                  noWrap
                  className={clsx(classes.headerText, classes.bidText)}
                >
                  Hot Stamp:
                </Typography>
                <Typography
                  noWrap
                  className={clsx(classes.headerText, classes.bidText)}
                >
                  Embossing:
                </Typography>
                <Typography
                  noWrap
                  className={clsx(classes.headerText, classes.bidText)}
                >
                  Stock:
                </Typography>
                <Typography
                  noWrap
                  className={clsx(classes.headerText, classes.bidText)}
                >
                  Flat Size:
                </Typography>
                <Typography
                  noWrap
                  className={clsx(classes.headerText, classes.bidText)}
                >
                  Finishing Type:
                </Typography>
                <Typography
                  noWrap
                  className={clsx(classes.headerText, classes.bidText)}
                >
                  Perf:
                </Typography>
                <Typography
                  noWrap
                  className={clsx(classes.headerText, classes.bidText)}
                >
                  Score:
                </Typography>
              </Grid>
              <Grid item sm={9}>
                <Typography
                  noWrap
                  className={clsx(classes.headerText, classes.bidText)}
                >
                  4-Color
                </Typography>
                <Typography
                  noWrap
                  className={clsx(classes.headerText, classes.bidText)}
                >
                  Dull Matte
                </Typography>
                <Typography
                  noWrap
                  className={clsx(classes.headerText, classes.bidText)}
                >
                  No
                </Typography>
                <Typography
                  noWrap
                  className={clsx(classes.headerText, classes.bidText)}
                >
                  No
                </Typography>
                <Typography
                  noWrap
                  className={clsx(classes.headerText, classes.bidText)}
                >
                  No
                </Typography>
                <Typography
                  noWrap
                  className={clsx(classes.headerText, classes.bidText)}
                >
                  Other - 8 mill. White electrostatic Matte finish vinyl
                </Typography>
                <Typography
                  noWrap
                  className={clsx(classes.headerText, classes.bidText)}
                >
                  Size Info
                </Typography>
                <Typography
                  noWrap
                  className={clsx(classes.headerText, classes.bidText)}
                >
                  Trim to size
                </Typography>
                <Typography
                  noWrap
                  className={clsx(classes.headerText, classes.bidText)}
                >
                  No
                </Typography>
                <Typography
                  noWrap
                  className={clsx(classes.headerText, classes.bidText)}
                >
                  No
                </Typography>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
      <br />
      <br />
      <Divider style={{ width: "75%", minWidth: "600px" }} />
      <br />
      <Grid
        container
        spacing={5}
        style={{ width: "75%", minWidth: "600px" }}
        alignItems="stretch"
      >
        <Grid item md={4} sm={12}>
          <div className={classes.squareGridItem}>
            <Paper className={classes.squarePaper}>
              <div className={classes.squareInnerPaper}>
                <img
                  src={currentRFQ.imgUrlOne}
                  alt={`Item number ${currentRFQ.sequenceNum}`}
                  className={classes.largePreview}
                />
              </div>
            </Paper>
          </div>
        </Grid>
        <Grid item md={4} sm={12}>
          <div className={classes.squareGridItem}>
            <Paper className={classes.squarePaper}>
              <div className={classes.squareInnerPaper}>
                <Typography className={classes.titleText}>
                  Sample Image
                </Typography>
              </div>
            </Paper>
          </div>
        </Grid>
        <Grid item md={4} sm={12}>
          <div className={classes.squareGridItem}>
            <Paper className={classes.squarePaper}>
              <div className={classes.squareInnerPaper}>
                <Typography className={classes.titleText}>
                  Sample Image
                </Typography>
              </div>
            </Paper>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

CurrentRFQ.propTypes = {
  currentRFQ: PropTypes.object.isRequired,
};

export default CurrentRFQ;
