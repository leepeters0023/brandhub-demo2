import React, { useState } from "react";
import "date-fns";
import subDays from "date-fns/subDays";

import { useInput } from "../hooks/UtilityHooks";

import OrderHistoryTable from "../components/OrderHistory/OrderHistoryTable";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import AutoComplete from "@material-ui/lab/Autocomplete";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";

//mockdata
import { orderHistory } from "../assets/mockdata/orderHistory";
import distributors from "../assets/mockdata/distributors";

const orderRows = orderHistory.map((data) => ({
  orderNum: data.orderNum,
  distributor: data.distributor,
  state: data.state,
  program: data.program,
  orderDate: data.orderDate,
  shipDate: data.shipDate,
  deliveredDate: "---",
  trackingNum: data.trackingNum,
  totalItems: Math.floor(Math.random() * 100 + 50),
  orderTotal: data.orderTotal,
  orderStatus: data.orderStatus,
}));

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  queryRow: {
    display: "flex",
    width: "90%",
    marginLeft: "10%",
  },
  gridItemContainer: {
    display: "flex",
    alignItems: "center",
  },
  trackingLogo: {
    width: "100px",
    height: "auto",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  selectedButton: {
    fontWeight: "600",
    fontSize: "1rem",
    textAlign: "center",
    color: "#737373",
  },
  dateField: {
    marginBottom: "17px",
    marginTop: "12px",
  }
}));

const OrderHistory = () => {
  const classes = useStyles();

  const [distributor, setDistributor] = useState(null);
  const { value: sequenceNumber, bind: bindSequenceNumber } = useInput("");
  const { value: program, bind: bindProgram } = useInput("");
  const [selectedFromDate, setSelectedFromDate] = useState(
    subDays(new Date(), 7).toLocaleDateString()
  );
  const [selectedToDate, setSelectedToDate] = useState(
    new Date().toLocaleDateString()
  );

  const handleFromDateChange = (date) => {
    setSelectedFromDate(date);
  };
  const handleToDateChange = (date) => {
    setSelectedToDate(date);
  };

  return (
    <>
      <Container className={classes.mainWrapper}>
        <Typography className={classes.titleText}>Order History</Typography>

        <br />
        <div className={classes.queryRow}>
          <Grid container spacing={2}>
            <Grid item md={2} sm={4} className={classes.gridItemContainer}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  fullWidth
                  color="secondary"
                  className={classes.dateField}
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
            <Grid item md={2} sm={4} className={classes.gridItemContainer}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  fullWidth
                  color="secondary"
                  className={classes.dateField}
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
            <Grid item md={2} sm={4} className={classes.gridItemContainer}>
              <AutoComplete
                fullWidth
                value={distributor}
                className={classes.queryField}
                onChange={(event, value) => setDistributor(value)}
                id="distributor"
                options={distributors}
                getOptionLabel={(dist) => dist.name}
                renderInput={(params) => (
                  <TextField
                    color="secondary"
                    {...params}
                    label="Distributor"
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item md={2} sm={4} className={classes.gridItemContainer}>
              <TextField
                className={classes.queryField}
                color="secondary"
                fullWidth
                name="program"
                type="text"
                label="Program"
                value={program}
                {...bindProgram}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item md={2} sm={4} className={classes.gridItemContainer}>
              <TextField
                className={classes.queryField}
                color="secondary"
                fullWidth
                name="sequenceNumber"
                type="text"
                label="Sequence #"
                value={sequenceNumber}
                {...bindSequenceNumber}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item md={2} sm={4} className={classes.gridItemContainer}>
              <Button
                fullWidth
                className={classes.largeButton}
                variant="contained"
                color="secondary"
              >
                SEARCH
              </Button>
            </Grid>
          </Grid>
        </div>
        <br />
        <br />
        <OrderHistoryTable orders={orderRows} />
      </Container>
      <br />
    </>
  );
};

export default OrderHistory;
