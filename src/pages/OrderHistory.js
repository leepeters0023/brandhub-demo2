import React, { useState } from "react";
import "date-fns";

import Typography from "@material-ui/core/Typography";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  queryButton: {
    width: "100px",
    height: "40px",
    margin: "5px",
  },
  queryRow: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  queryButtonRow: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
  },
  queryField: {
    width: "23%",
    marginLeft: "10px",
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
    new Date().toLocaleDateString()
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
        <Grid container>
          <Grid item md={2}>
            <Typography className={classes.titleText}>Order History</Typography>
          </Grid>
          <Grid item md={10}>
              
          </Grid>
        </Grid>
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
      </Container>
      <br />
    </>
  );
};

export default OrderHistory;
