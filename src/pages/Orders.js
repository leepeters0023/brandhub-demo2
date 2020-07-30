import React, { useState } from "react";
import "date-fns";

import OrdersCurrentTable from "../components/OrdersCurrentTable";
import OrdersPastTable from "../components/OrdersPastTable";
import TrackingModal from "../components/TrackingModal";

import GalloLogo from "../assets/gallologo.png";

import Divider from "@material-ui/core/Divider";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
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
  queryForm: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  queryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  queryButtonRow: {
    display: "flex",
    justifyContent: "flex-end",
  },
  queryField: {
    width: "23%",
  },
  trackingLogo: {
    width: "100px",
    height: "auto",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}));

const Orders = () => {
  const classes = useStyles();

  const [selectedFromDate, setSelectedFromDate] = useState(
    new Date().toLocaleDateString()
  );
  const [selectedToDate, setSelectedToDate] = useState(
    new Date().toLocaleDateString()
  );
  const [itemModal, handleItemModal] = useState(false);

  const handleFromDateChange = (date) => {
    setSelectedFromDate(date);
  };
  const handleToDateChange = (date) => {
    setSelectedToDate(date);
  };
  const handlePreview = (id) => {
    console.log(id);
    handleItemModal(true);
  };
  const handleModalClose = () => {
    handleItemModal(false);
  };

  return (
    <>
      <div className={classes.relativeContainer}>
        <Dialog
          open={itemModal}
          onClose={handleModalClose}
          fullWidth
          maxWidth="lg"
        >
          <DialogContent>
            <TrackingModal handleClose={handleModalClose} />
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
                <TextField
                  color="secondary"
                  className={classes.queryField}
                  size="small"
                  variant="outlined"
                  margin="normal"
                  id="approvalId"
                  label="Approval Id"
                  name="approvalId"
                />
                <TextField
                  color="secondary"
                  className={classes.queryField}
                  size="small"
                  variant="outlined"
                  margin="normal"
                  id="theme"
                  label="Program Theme"
                  name="theme"
                />
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
                  CLEAR
                </Button>
              </div>
            </form>
          </Grid>
        </Grid>
        <br />
        <Divider classes={{ root: classes.pageBreak }} />
        <br />
        {window.location.hash === "#current" && (
          <OrdersCurrentTable handlePreview={handlePreview} />
        )}
        {window.location.hash === "#past" && (
          <OrdersPastTable handlePreview={handlePreview} />
        )}
      </Container>
    </>
  );
};

export default Orders;
