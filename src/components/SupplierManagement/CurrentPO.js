import React, { useState } from "react";
import { navigate } from "@reach/router";
import clsx from "clsx";

import { useSelector, useDispatch } from "react-redux";

import { useInput } from "../../hooks/InputHooks";
import { formatMoney, formatDate } from "../../utility/utilityFunctions";

import {
  addCost,
  updateDateByType,
  updateShipMethod,
  updateSupplierNote,
  updateKeyAccountTape,
  setDirectShip,
  deleteItem,
  deletePurchaseOrder,
} from "../../redux/slices/purchaseOrderSlice";

import POItemsTable from "./POItemsTable";
import SpecDetailTable from "./SpecDetailTable";

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
  specTableCellRoot: {
    padding: "5px 0px",
  },
}));

const CurrentPO = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const currentPO = useSelector((state) => state.purchaseOrder.currentPO);
  const additionalCosts = useSelector(
    (state) => state.purchaseOrder.currentPO.additionalCosts
  );
  const currentRole = useSelector((state) => state.user.role);

  const { value: method, bind: bindMethod } = useInput(currentPO.method);
  const { value: note, bind: bindNote } = useInput(currentPO.supplierNotes);
  const { value: keyAcctTape, bind: bindKeyAcctTape } = useInput(
    currentPO.keyAcctTape
  );
  const [shippingOption, setShippingOption] = useState(
    currentPO.directShip ? "direct" : "cdc"
  );

  const deletePOItem = (id) => {
    let initialLength = currentPO.poItems.length;
    dispatch(deleteItem(id));
    if (initialLength === 1) {
      dispatch(deletePurchaseOrder(currentPO.id));
      navigate("/purchasing/poRollup");
    }
  };

  const updateMethod = () => {
    dispatch(updateShipMethod(currentPO.id, method));
  };

  const updateNote = () => {
    dispatch(updateSupplierNote(currentPO.id, note));
  };

  const updateTape = () => {
    dispatch(updateKeyAccountTape(currentPO.id, keyAcctTape));
  };

  const addNewCost = () => {
    dispatch(addCost({ description: "", cost: "" }));
  };

  const handleRadioChange = (event) => {
    setShippingOption(event.target.value);
    if (event.target.value === "direct") {
      dispatch(setDirectShip(currentPO.id, true));
    } else {
      dispatch(setDirectShip(currentPO.id, false));
    }
  };

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
            {currentRole !== "supplier" && (
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  color="secondary"
                  className={classes.dateField}
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="dueDate"
                  label="Delivery Date"
                  value={formatDate(currentPO.dueDate)}
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
            )}
            {currentRole === "supplier" && (
              <Typography className={clsx(classes.headerText, classes.POText)}>
                {`Delivery Date:  ${new Date(
                  currentPO.dueDate
                ).toLocaleDateString()}`}
              </Typography>
            )}
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
        alignItems="flex-start"
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
            {currentRole !== "supplier" && (
              <>
                <TextField
                  label="Ship Method"
                  color="secondary"
                  fullWidth
                  variant="outlined"
                  size="small"
                  onBlur={updateMethod}
                  {...bindMethod}
                />
                <br />
                <TextField
                  label="Key Account Tape"
                  color="secondary"
                  multiline
                  fullWidth
                  variant="outlined"
                  size="small"
                  rows="3"
                  onBlur={updateTape}
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
                  rows="6"
                  onBlur={updateNote}
                  {...bindNote}
                />
              </>
            )}
            {currentRole === "supplier" && (
              <>
                <Typography className={classes.bodyText}>
                  {`Ship Method: ${currentPO.method}`}
                </Typography>
                <Typography className={classes.bodyText}>
                  {`Key Account Tape: ${currentPO.keyAcctTape}`}
                </Typography>
                <Typography className={classes.bodyText}>
                  {`Note: ${currentPO.supplierNotes}`}
                </Typography>
              </>
            )}
          </div>
        </Grid>
        <Grid item sm={6}>
          <Typography className={clsx(classes.headerText, classes.POText)}>
            Spec Details:
          </Typography>
          <br />
          {currentPO.poItems.map((item, index) => {
            let specArray = Object.keys(item.itemSpec).map((spec, i) => ({
              spec: spec,
              desc: item.itemSpec[spec],
            }));
            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <Typography
                  className={clsx(classes.headerText, classes.POText)}
                >
                  {`Sequence Number: ${item.sequenceNum}`}
                </Typography>
                <SpecDetailTable classes={classes} specArray={specArray} />
                {index !== currentPO.poItems.length - 1 && (
                  <>
                    <br />
                    <Divider />
                    <br />
                  </>
                )}
              </div>
            );
          })}
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
        handleDelete={deletePOItem}
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
        {currentRole !== "supplier" && (
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
        )}
        {currentRole === "supplier" && (
          <Typography className={classes.headerText}>Direct Ship</Typography>
        )}
        <Typography
          className={classes.titleText}
          style={{ marginRight: "20px" }}
        >
          {`Total: ${formatMoney(currentPO.totalCost, true)}`}
        </Typography>
      </div>
      <br />
      <br />
    </>
  );
};

export default React.memo(CurrentPO);
