import React from "react";

import GalloLogo from "../assets/gallologo.png";

import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  tableContainer: {
    margin: "100px auto 0 auto",
    padding: "20px 25px",
    width: "90vw",
  },
  table: {
    width: "100%",
  },
  tableRow: {
    "&:hover": {
      backgroundColor: "lightgray !important",
    },
  },
}));

// simulate data for mock
const createData = (order, date, tracking, total) => {
  return { order, date, tracking, total };
};

let date = new Date();
let dateString = date.toLocaleDateString();

const getOrder = () => {
  return `Order ${Math.floor(Math.random() * 1000 + 63000)}`;
};

const rows = [
  createData(
    getOrder(),
    dateString,
    "Tracking Order",
    (Math.random() * 1000).toFixed(2)
  ),
  createData(
    getOrder(),
    dateString,
    "Tracking Order",
    (Math.random() * 1000).toFixed(2)
  ),
  createData(
    getOrder(),
    dateString,
    "Tracking Order",
    (Math.random() * 1000).toFixed(2)
  ),
  createData(
    getOrder(),
    dateString,
    "Tracking Order",
    (Math.random() * 1000).toFixed(2)
  ),
  createData(
    getOrder(),
    dateString,
    "Tracking Order",
    (Math.random() * 1000).toFixed(2)
  ),
  createData(
    getOrder(),
    dateString,
    "Tracking Order",
    (Math.random() * 1000).toFixed(2)
  ),
  createData(
    getOrder(),
    dateString,
    "Tracking Order",
    (Math.random() * 1000).toFixed(2)
  ),
  createData(
    getOrder(),
    dateString,
    "Tracking Order",
    (Math.random() * 1000).toFixed(2)
  ),
];

const OrderHistory = () => {
  const classes = useStyles();
  return (
    <>
      <TableContainer className={classes.tableContainer} component={Paper}>
        <div className={classes.titleImage}>
          <img className={classes.logo} src={GalloLogo} alt="Gallo" />
          <Typography className={classes.titleText} variant="h5">
            Order History
          </Typography>
        </div>
        <br />
        <hr />
        <br />
        <Typography className={classes.titleText} variant="h5">
          Past Orders
        </Typography>
        <br />
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className={classes.headerText}>Order Number</TableCell>
              <TableCell className={classes.headerText} align="right">
                Order Date
              </TableCell>
              <TableCell className={classes.headerText} align="right">
                Tracking
              </TableCell>
              <TableCell className={classes.headerText} align="right">
                Total
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.order} hover={true}  className={classes.tableRow}>
                <TableCell component="th" scope="row">
                  {row.order}
                </TableCell>
                <TableCell align="right">{row.date}</TableCell>
                <TableCell align="right">{row.tracking}</TableCell>
                <TableCell align="right">{row.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default OrderHistory;
