import React, { useState } from "react";
import "date-fns";

import GalloLogo from "../assets/gallologo.png";

import { useInput } from "../hooks/UtilityHooks";
import { stateList } from "../assets/mockdata/stateContacts";
import items from "../assets/mockdata/Items";
import distributors from "../assets/mockdata/distributors";
import programs from "../assets/mockdata/Programs";

import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import AutoComplete from "@material-ui/lab/Autocomplete";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";

const regions = [
  "Region 1",
  "Region 2",
  "Region 3",
  "Region 4",
  "Key Acct. 1",
  "Key Acct. 2",
];

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  queryField: {
    width: "100%",
  },
  formButton: {
    width: "100%",
    fontWeight: "600",
  },
}));

const Reports = () => {
  const classes = useStyles();

  const [selectedFromDate, setSelectedFromDate] = useState(
    new Date().toLocaleDateString()
  );
  const [selectedToDate, setSelectedToDate] = useState(
    new Date().toLocaleDateString()
  );
  const [state, setState] = useState(null);
  const [brand, setBrand] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [program, setProgram] = useState(null);
  const [region, setRegion] = useState(null);

  const handleFromDateChange = (date) => {
    setSelectedFromDate(date);
  };
  const handleToDateChange = (date) => {
    setSelectedToDate(date);
  };
  const {
    value: sequenceNumber,
    bind: bindSequenceNumber,
    reset: resetSequenceNumber,
  } = useInput("");

  const handleOrderHistorySubmit = (evt) => {
    console.log(sequenceNumber, evt.target.id);
    resetSequenceNumber();
  };

  return (
    <>
      <Paper className={classes.paperContainer}>
        <div className={classes.titleImage}>
          <img className={classes.logo} src={GalloLogo} alt="Gallo" />
          <Typography className={classes.titleText} variant="h5">
            Reports
          </Typography>
        </div>
        <br />
        <Divider />
        <br />
        <Typography className={classes.headerText}>Order History:</Typography>
        <br />
        <Grid container spacing={2} justify="center" alignItems="center">
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                className={classes.queryField}
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="fromDate"
                label="Order From Date"
                value={selectedFromDate}
                onChange={handleFromDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                className={classes.queryField}
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="toDate"
                label="Order To Date"
                value={selectedToDate}
                onChange={handleToDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <TextField
              fullWidth
              name="sequenceNumber"
              type="text"
              label="Sequence Number"
              {...bindSequenceNumber}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <AutoComplete
              value={state}
              onChange={(event, value) => setState(value)}
              id="state"
              options={stateList}
              getOptionLabel={(state) => state.state}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="State"
                  variant="outlined"
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <AutoComplete
              value={brand}
              onChange={(event, value) => setBrand(value)}
              id="brand"
              options={items}
              getOptionLabel={(item) => item.brand}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Brand"
                  variant="outlined"
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <AutoComplete
              value={vendor}
              onChange={(event, value) => setVendor(value)}
              id="vendor"
              options={distributors}
              getOptionLabel={(dist) => dist.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Vendor"
                  variant="outlined"
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <AutoComplete
              value={program}
              onChange={(event, value) => setProgram(value)}
              id="program"
              options={programs}
              getOptionLabel={(program) => program.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Programs"
                  variant="outlined"
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <AutoComplete
              value={region}
              onChange={(event, value) => setRegion(value)}
              id="region"
              options={regions}
              getOptionLabel={(region) => region}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Region / Key Acct."
                  variant="outlined"
                  size="small"
                />
              )}
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={2} justify="center" alignItems="center">
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <Button
              className={classes.formButton}
              id="orderSummary"
              color="primary"
              variant="contained"
              onClick={handleOrderHistorySubmit}
            >
              Generate Order Summary
            </Button>
          </Grid>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <Button
              className={classes.formButton}
              id="orderDetails"
              color="primary"
              variant="contained"
              onClick={handleOrderHistorySubmit}
            >
              Generate Order Details
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default Reports;
