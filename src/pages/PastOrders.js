import React, { useState, useEffect } from "react";
//import PropTypes from "prop-types";
import "date-fns";

import OrdersPastTable from "../components/OrderHistory/OrdersPastTable";
import OrderHistoryItemModal from "../components/OrderHistory/OrderHistoryItemModal";
import OrderHistoryOrderModal from "../components/OrderHistory/OrderHistoryOrderModal";

import GalloLogo from "../assets/gallologo.png";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
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
    justifyContent: "flex-end",
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
  },
}));

const PastOrders = () => {
  const classes = useStyles();

  const [selectedFromDate, setSelectedFromDate] = useState(
    new Date().toLocaleDateString()
  );
  const [selectedToDate, setSelectedToDate] = useState(
    new Date().toLocaleDateString()
  );
  const [modal, handleModal] = useState(false);
  const [value, updateValue] = useState(1);
  const [tableType, setTableType] = useState(null);
  const [modalType, setModalType] = useState("order");
  const [currentOrder, setCurrentOrder] = useState(null);

  const handleFromDateChange = (date) => {
    setSelectedFromDate(date);
  };
  const handleToDateChange = (date) => {
    setSelectedToDate(date);
  };
  const handlePreview = (id, type) => {
    setCurrentOrder(id);
    setModalType(type);
    handleModal(true);
  };
  const handleModalClose = () => {
    handleModal(false);
  };

  const handleChangeTab = (_evt, newValue) => {
    if (newValue === 1) {
      window.location.hash = "#byorder";
      setTableType("byOrder");
    } else if (newValue === 2) {
      window.location.hash = "#byitems";
      setTableType("byItems");
    }
    updateValue(newValue);
  };

  useEffect(() => {
    if (window.location.hash === "#byorder") {
      updateValue(1);
      setTableType("byOrder");
    } else if (window.location.hash === "#byitems") {
      updateValue(2);
      setTableType("byItems");
    }
  }, []);

  return (
    <>
      <div className={classes.relativeContainer}>
        <Dialog open={modal} onClose={handleModalClose} fullWidth maxWidth="lg">
          <DialogContent>
            {modalType === "item" && (
              <OrderHistoryItemModal handleClose={handleModalClose} />
            )}
            {modalType === "order" && (
              <OrderHistoryOrderModal
                handleClose={handleModalClose}
                orderNumber={currentOrder}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
      <Container className={classes.mainWrapper}>
        <Grid container>
          <Grid item md={2}>
            <img className={classes.trackingLogo} src={GalloLogo} alt="Gallo" />
          </Grid>
          <Grid item md={10}>
            <form>
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
              </div>
              <div className={classes.queryButtonRow}>
                <Button
                  className={classes.queryButton}
                  variant="contained"
                  color="secondary"
                >
                  SEARCH
                </Button>
                <Button
                  className={classes.queryButton}
                  variant="contained"
                  color="primary"
                >
                  RESET
                </Button>
              </div>
            </form>
          </Grid>
        </Grid>
        <br />
        <Tabs
          variant="fullWidth"
          value={value}
          onChange={handleChangeTab}
          indicatorColor="primary"
          centered
        >
          <Tab className={classes.headerText} label="View by Order" value={1} />
          <Tab className={classes.headerText} label="View by Item" value={2} />
        </Tabs>
        <br />
        <br />
        <OrdersPastTable handlePreview={handlePreview} tableType={tableType} />
      </Container>
      <br />
    </>
  );
};

export default PastOrders;
