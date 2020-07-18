import React from "react";
import { Link } from "@reach/router";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Container from "@material-ui/core/Container";
import Chip from "@material-ui/core/Chip";
import { makeStyles } from "@material-ui/core/styles";

// simulate data for mock
const createData = (order, date, total, status) => {
  return { order, date, total, status };
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
    (Math.random() * 1000).toFixed(2),
    "Pending",
  ),
  createData(
    getOrder(),
    dateString,
    (Math.random() * 1000).toFixed(2),
    "Pending",
  ),
];

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const OrderPrePortal = () => {
  const classes = useStyles();

  return (
    <div>
      <Container className={classes.tabContainer}>
        <Button
          className={classes.largeButton}
          variant="contained"
          color="secondary"
          component={Link}
          to="/order/pre-order"
        >
          Start Pre-Order
        </Button>
        <br/>
        <br/>
        <TableContainer className={classes.tableContainer} >
        <br />
        <Typography className={classes.titleText} variant="h5">
          Pre-Orders in Progress
        </Typography>
        <br />
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className={classes.headerText}>Order Number</TableCell>
              <TableCell className={classes.headerText} align="right">Order Date</TableCell>
              <TableCell className={classes.headerText} align="right">Total</TableCell>
              <TableCell className={classes.headerText} align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.order}>
                <TableCell component="th" scope="row">
                  {row.order}
                </TableCell>
                <TableCell align="right">{row.date}</TableCell>
                <TableCell align="right">{row.total}</TableCell>
                <TableCell align="center">
                    {row.status === "Approved" && <Chip className={classes.chipApproved} label={row.status} />}
                    {row.status === "Active" && <Chip className={classes.chipActive} label={row.status} />}
                    {row.status === "Pending" && <Chip className={classes.chipPending} label={row.status} />}
                    {row.status === "Canceled" && <Chip className={classes.chipCanceled} label={row.status} />}
                  </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Container>
    </div>
  );
};

export default OrderPrePortal;
