import React, { useEffect } from "react";
// import PropTypes from "prop-types";
// import { navigate } from "@reach/router";
import format from "date-fns/format";
import clsx from "clsx";

import { useSelector, useDispatch } from "react-redux";

import {
  addCost,
  // updateSupplierNotes,
  // updateLabel,
} from "../../redux/slices/purchaseOrderSlice";

import POItemsTable from "./POItemsTable";

import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  POText: {
    marginBottom: "5px",
  },
  fullHeightGridItem: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    height: "100%",
    width: "100%",
  },
}));

const CurrentPO = ({ purchaseOrderItems }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const additionalCosts = useSelector(
    (state) => state.purchaseOrder.currentPO.additionalCosts
  );

  const addNewCost = () => {
    dispatch(addCost({ description: "", cost: "" }));
  };

  useEffect(() => {
    if (additionalCosts.length === 0) {
      dispatch(addCost({ description: "", cost: "" }));
    }
  }, [additionalCosts.length, dispatch]);

  return (
    <>
      <Grid
        container
        spacing={5}
        style={{ width: "75%", minWidth: "1000px" }}
        alignItems="flex-end"
      >
        <Grid item sm={6}>
          <Typography className={clsx(classes.headerText, classes.POText)}>
            Supplier:
          </Typography>
          <Typography className={clsx(classes.headerText, classes.POText)}>
            Contact Name:
          </Typography>
          <Typography className={clsx(classes.headerText, classes.POText)}>
            Email:
          </Typography>
          <Typography className={clsx(classes.headerText, classes.POText)}>
            Phone:
          </Typography>
        </Grid>
        <Grid item sm={6}>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
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
                value={format(new Date(), "MM/dd/yyyy")}
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
                id="expectedShip"
                label="Expected Ship"
                value={format(new Date(), "MM/dd/yyyy")}
                //onChange={(value) => handleFilters(value, "toDate")}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
          </div>
          <br />
          <Typography className={clsx(classes.headerText, classes.POText)}>
            Terms: Net 30 Days
          </Typography>
          <Typography className={clsx(classes.headerText, classes.POText)}>
            Purchased By:
          </Typography>
        </Grid>
      </Grid>
      <br />
      <Divider style={{ width: "75%", minWidth: "1000px" }} />
      <br />
      <Grid
        container
        spacing={5}
        style={{ width: "75%", minWidth: "1000px" }}
        alignItems="flex-end"
      >
        <Grid item sm={6}>
          <div className={classes.fullHeightGridItem}>
            <Typography className={classes.titleText}>
              Supplier Notes:
            </Typography>
            <br />
            <TextField
              label="Supplier Notes"
              color="secondary"
              multiline
              fullWidth
              variant="outlined"
              size="small"
              rows="4"
            />
          </div>
        </Grid>
        <Grid item sm={6}>
          <Typography className={clsx(classes.headerText, classes.POText)}>
            RFQ Number:
          </Typography>
          <Typography className={clsx(classes.headerText, classes.POText)}>
            Spec Details:
          </Typography>
        </Grid>
      </Grid>
      <br />
      <Divider style={{ width: "75%", minWidth: "1000px" }} />
      <br />
      <br />
      <POItemsTable
        items={purchaseOrderItems}
        classes={classes}
        addNewCost={addNewCost}
        additionalCosts={additionalCosts}
      />
      <br />
      <br />
      <div
        style={{
          width: "75%",
          minWidth: "1000px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Typography
          className={classes.titleText}
          style={{ marginRight: "20px" }}
        >
          Total: $25,000.00
        </Typography>
      </div>
      <br />    
      <br />
    </>
  );
};

export default CurrentPO;
