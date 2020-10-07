import React from "react";
// import PropTypes from "prop-types";
// import { navigate } from "@reach/router";
import format from "date-fns/format";
import clsx from "clsx";

import { formatMoney } from "../../utility/utilityFunctions";

import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";

//mock data
import { singlePO } from "../../assets/mockdata/dataGenerator";

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

const CurrentPO = () => {
  const classes = useStyles();

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
                id="expectedArrival"
                label="Expected Arrival"
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
      <TableContainer
        className={classes.tableContainer}
        style={{ width: "75%", minWidth: "1000px" }}
      >
        <Typography
          className={classes.titleText}
          style={{ marginLeft: "20px" }}
        >
          Purchase Order Items:
        </Typography>
        <br />
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell className={classes.headerText} align="left">
                Sequence #
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Program
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Item Type
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Qty Desired
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Qty Ordered
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Cost/Unit
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Total
              </TableCell>
              <TableCell className={classes.headerText} align="right">
                Remove
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {singlePO.map((row) => (
              <TableRow key={row.id}>
                <TableCell align="left">{row.sequenceNum}</TableCell>
                <TableCell align="left">{row.program}</TableCell>
                <TableCell align="left">{row.itemType}</TableCell>
                <TableCell align="left">{row.totalItems}</TableCell>
                <TableCell align="left">
                  <TextField
                    value={row.totalItems}
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </TableCell>
                <TableCell align="left">
                  <TextField
                    value={formatMoney(row.estCost)}
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </TableCell>
                <TableCell align="left">{formatMoney(row.estTotal)}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Deny">
                    <IconButton
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                    >
                      <CancelIcon color="inherit" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={8} className={classes.headerText}>
                Set Up Fee:
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.headerText}>Description:</TableCell>
              <TableCell colSpan={4}>
                <TextField variant="outlined" size="small" fullWidth />
              </TableCell>
              <TableCell className={classes.headerText} align="right">
                Cost:
              </TableCell>
              <TableCell colSpan={2}>
                <TextField variant="outlined" size="small" fullWidth />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      <br />
      <div style={{width: "75%", minWidth: "1000px", display: "flex", justifyContent: "flex-end"}}>
        <Typography className={classes.titleText} style={{marginRight: "20px"}}>
          Total: $25,000.00
        </Typography>
      </div>
      <br />
      <br />
      {/* This will be mapped over all shipping locations */}
      <Grid
        container
        spacing={5}
        style={{ width: "75%", minWidth: "1000px", backgroundColor: "#f2f2f2" }}
      >
        <Grid item sm={6}>
          <div className={classes.fullHeightGridItem}>
            <Typography className={classes.titleText}>Ship To:</Typography>
            <br />
            <div>
              <Typography className={clsx(classes.headerText, classes.POText)}>
                Attention:
              </Typography>
              <Typography className={clsx(classes.headerText, classes.POText)}>
                Address:
              </Typography>
              <TextField
                label="Label"
                color="secondary"
                multiline
                fullWidth
                variant="outlined"
                size="small"
                rows="4"
              />
            </div>
          </div>
        </Grid>
        <Grid item sm={6}>
          <div className={classes.fullHeightGridItem}>
            <Typography className={classes.titleText}>
              Shipping Detail:
            </Typography>
            <br />
            <div>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  color="secondary"
                  className={classes.dateField}
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="actualShip"
                  label="Actual Ship"
                  value={format(new Date(), "MM/dd/yyyy")}
                  //onChange={(value) => handleFilters(value, "toDate")}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </MuiPickersUtilsProvider>
              <br />
              <Typography className={clsx(classes.headerText, classes.POText)}>
                Carrier:
              </Typography>
              <Typography className={clsx(classes.headerText, classes.POText)}>
                Method:
              </Typography>
              <Typography className={clsx(classes.headerText, classes.POText)}>
                Tracking Numbers:
              </Typography>
            </div>
          </div>
        </Grid>
      </Grid>
      <br />
    </>
  );
};

export default CurrentPO;
