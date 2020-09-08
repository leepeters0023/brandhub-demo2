import React, { useState } from "react";
import "date-fns";
import subDays from "date-fns/subDays";

import { useInput } from "../hooks/UtilityHooks";

import OrderHistoryTable from "../components/OrderHistory/OrderHistoryTable";

import TextField from "@material-ui/core/TextField";
import AutoComplete from "@material-ui/lab/Autocomplete";
import Typography from "@material-ui/core/Typography";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
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
}));

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  queryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "70%",
  },
  queryButtonRow: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  queryField: {
    width: "22%",
    marginBottom: "16px",
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
}));

const OrderHistory = () => {
  const classes = useStyles();

  const [sortValue, setSortValue] = useState("pending");
  const [vendor, setVendor] = useState(null);
  const { value: sequenceNumber, bind: bindSequenceNumber } = useInput("");
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
        <div className={classes.queryButtonRow}>
          <ButtonGroup
            style={{ height: "40px", marginRight: "10px", marginTop: "7px" }}
            color="secondary"
            aria-label="order-sort"
          >
            <Tooltip title="View Pending Orders">
              <Button
                className={
                  sortValue === "pending"
                    ? classes.largeButton
                    : classes.selectedButton
                }
                variant={sortValue === "pending" ? "contained" : "outlined"}
                onClick={() => {
                  setSortValue("pending");
                }}
              >
                PENDING
              </Button>
            </Tooltip>
            <Tooltip title="View Shipped Orders">
              <Button
                className={
                  sortValue === "shipped"
                    ? classes.largeButton
                    : classes.selectedButton
                }
                variant={sortValue === "shipped" ? "contained" : "outlined"}
                onClick={() => {
                  setSortValue("shipped");
                }}
              >
                SHIPPED
              </Button>
            </Tooltip>
            <Tooltip title="View Complete Orders">
              <Button
                className={
                  sortValue === "complete"
                    ? classes.largeButton
                    : classes.selectedButton
                }
                variant={sortValue === "complete" ? "contained" : "outlined"}
                onClick={() => {
                  setSortValue("complete");
                }}
              >
                COMPLETE
              </Button>
            </Tooltip>
            <Tooltip title="View All Orders">
              <Button
                className={
                  sortValue === "all"
                    ? classes.largeButton
                    : classes.selectedButton
                }
                variant={sortValue === "all" ? "contained" : "outlined"}
                onClick={() => {
                  setSortValue("all");
                }}
              >
                ALL
              </Button>
            </Tooltip>
          </ButtonGroup>
          <div className={classes.queryRow}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                color="secondary"
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
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                color="secondary"
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
              <AutoComplete
                value={vendor}
                className={classes.queryField}
                onChange={(event, value) => setVendor(value)}
                id="vendor"
                options={distributors}
                getOptionLabel={(dist) => dist.name}
                renderInput={(params) => (
                  <TextField
                    color="secondary"
                    {...params}
                    label="Vendor"
                    variant="outlined"
                    size="small"
                  />
                )}
              />
              <TextField
                className={classes.queryField}
                color="secondary"
                fullWidth
                name="sequenceNumber"
                type="text"
                label="Sequence Number"
                value={sequenceNumber}
                {...bindSequenceNumber}
                variant="outlined"
                size="small"
              />
            </MuiPickersUtilsProvider>
            <Button
              className={classes.largeButton}
              style={{ margin: "0 5px 16px 5px" }}
              variant="contained"
              color="secondary"
            >
              SEARCH
            </Button>
          </div>
        </div>
        <br />
        <br />
        <OrderHistoryTable orders={orderRows} filter={sortValue} />
      </Container>
      <br />
    </>
  );
};

export default OrderHistory;
