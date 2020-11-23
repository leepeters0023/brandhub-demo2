import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
// import { navigate } from "@reach/router";
import clsx from "clsx";

import { useSelector, useDispatch } from "react-redux";

import { useInput } from "../../hooks/InputHooks";
import { formatMoney } from "../../utility/utilityFunctions";

import {
  addCost,
  updateDateByType,
  updateSupplierNote,
} from "../../redux/slices/purchaseOrderSlice";

import POItemsTable from "./POItemsTable";

import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
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

const CurrentPO = ({ currentPO }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { value: note, bind: bindNote } = useInput(currentPO.supplierNotes);
  const { value: keyAcctTape, bind: bindKeyAcctTape } = useInput(
    currentPO.keyAcctTape
  );
  const [shippingOption, setShippingOption] = useState("direct");

  const additionalCosts = useSelector(
    (state) => state.purchaseOrder.currentPO.additionalCosts
  );

  const updateNote = () => {
    dispatch(updateSupplierNote(currentPO.id, note));
  };

  const addNewCost = () => {
    dispatch(addCost({ description: "", cost: "" }));
  };

  const handleRadioChange = (event) => {
    setShippingOption(event.target.value);
    //TODO update in redux
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
            {`Supplier: ${currentPO.supplier}`}
          </Typography>
          <Typography className={clsx(classes.headerText, classes.POText)}>
            {`Contact Name: ${currentPO.contactName}`}
          </Typography>
          <Typography className={clsx(classes.headerText, classes.POText)}>
            {`Email: ${currentPO.email}`}
          </Typography>
          <Typography className={clsx(classes.headerText, classes.POText)}>
            {`Phone: ${currentPO.phone}`}
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
                value={currentPO.dueDate}
                onChange={(value) =>
                  dispatch(
                    updateDateByType(
                      currentPO.id,
                      "in-market-date",
                      new Date(value)
                    )
                  )
                }
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
                value={currentPO.expectedShip}
                onChange={(value) =>
                  dispatch(
                    updateDateByType(
                      currentPO.id,
                      "expected-ship-date",
                      new Date(value)
                    )
                  )
                }
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
          </div>
          <br />
          <Typography className={clsx(classes.headerText, classes.POText)}>
            {`Terms: ${currentPO.terms}`}
          </Typography>
          <Typography className={clsx(classes.headerText, classes.POText)}>
            {`Purchased By: ${currentPO.purchasedBy}`}
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
            <Typography className={clsx(classes.headerText, classes.POText)}>
              {`Shipping Labels: ${currentPO.shippingLabel}`}
            </Typography>
            <Typography className={clsx(classes.headerText, classes.POText)}>
              {`RFQ Number: ${currentPO.rfqNumber}`}
            </Typography>
            <br />
            <TextField
              label="Key Account Tape"
              color="secondary"
              multiline
              fullWidth
              variant="outlined"
              size="small"
              rows="2"
              onBlur={() => {
                /* TODO */ console.log(keyAcctTape);
              }}
              {...bindKeyAcctTape}
            />
            <br />
            <TextField
              label="Supplier Notes"
              color="secondary"
              multiline
              fullWidth
              variant="outlined"
              size="small"
              rows="4"
              onBlur={updateNote}
              {...bindNote}
            />
          </div>
        </Grid>
        <Grid item sm={6}>
          <Typography className={clsx(classes.headerText, classes.POText)}>
            {`Spec Details: ${currentPO.specDetails}`}
          </Typography>
        </Grid>
      </Grid>
      <br />
      <Divider style={{ width: "75%", minWidth: "1000px" }} />
      <br />
      <br />
      <POItemsTable
        items={currentPO.poItems}
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
          justifyContent: "space-between",
        }}
      >
        <RadioGroup
          aria-label="shipping-options"
          name="shipping-options"
          value={shippingOption}
          onChange={handleRadioChange}
          row
        >
          <FormControlLabel
            value="direct"
            control={<Radio />}
            label="Direct Ship"
          />
          <FormControlLabel
            value="cdc"
            control={<Radio />}
            label="Ship to CDC"
          />
        </RadioGroup>
        <Typography
          className={classes.titleText}
          style={{ marginRight: "20px" }}
        >
          {`Total: ${formatMoney(currentPO.totalCost)}`}
        </Typography>
      </div>
      <br />
      <br />
    </>
  );
};

CurrentPO.propTypes = {
  currentPO: PropTypes.object,
};

export default CurrentPO;
