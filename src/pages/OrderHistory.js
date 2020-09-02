import React, { useState } from "react";
import "date-fns";
import subDays from "date-fns/subDays";

import OrderHistoryTable from "../components/OrderHistory/OrderHistoryTable";

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
}))

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  queryButton: {
    width: "100px",
    height: "40px",
    margin: "5px",
  },
  queryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  queryButtonRow: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center"
  },
  queryField: {
    width: "38%",
    marginBottom: "16px",
  },
  trackingLogo: {
    width: "100px",
    height: "auto",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
    selectedButton: {
      fontWeight: "600",
      fontSize: "1rem",
      textAlign: "center",
      color: "#737373",
    },
  },
}));

const OrderHistory = () => {
  const classes = useStyles();

  const [sortValue, setSortValue] = useState("pending");
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
            style={{ height: "40px", marginRight: "10px" }}
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
            </MuiPickersUtilsProvider>
            <Button
              className={classes.largeButton}
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
