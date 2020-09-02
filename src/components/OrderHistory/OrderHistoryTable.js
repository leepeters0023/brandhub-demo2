import React from "react";
import PropTypes from "prop-types";
import { navigate } from "@reach/router";

import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  orderHistoryRow: {
    "&&:hover": {
      cursor: "pointer"
    }
  }
}));

const OrderHistoryTable = ({ orders, filter }) => {
  const classes = useStyles();

  const handleRowClick = (orderNum) => {
    navigate(`/orders/history/${orderNum}`)
  }

  if (orders.length === 0) {
    return (
      <>
        <Typography className={classes.headerText}>
          {`You currently don't have any ${
            filter[0].toUppercase() + filter.slice(1)
          } orders on record..`}
        </Typography>
      </>
    );
  }

  return (
    <>
      <TableContainer className={classes.tableContainer}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell className={classes.headerText} align="left">
                Order Number
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Distributor
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                State
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Program
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Order Date
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Ship Date
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Delivered Date
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Tracking
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Total Items
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Order Total
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((row) => (
              <TableRow key={row.orderNum} hover className={classes.orderHistoryRow} onClick={()=>{handleRowClick(row.orderNum)}}>
                <TableCell align="left">
                  {row.orderNum}
                </TableCell>
                <TableCell align="left">
                  {row.distributor}
                </TableCell>
                <TableCell align="left">
                  {row.state}
                </TableCell>
                <TableCell align="left">
                  {row.program}
                </TableCell>
                <TableCell align="left">
                  {row.orderDate}
                </TableCell>
                <TableCell align="left">
                  {row.shipDate}
                </TableCell>
                <TableCell align="left">
                  {row.deliveredDate}
                </TableCell>
                <TableCell align="left">
                  {row.trackingNum}
                </TableCell>
                <TableCell align="left">
                  {row.totalItems}
                </TableCell>
                <TableCell align="left">
                  {row.orderTotal}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

OrderHistoryTable.propTypes = {
  order: PropTypes.array,
};

export default OrderHistoryTable;
