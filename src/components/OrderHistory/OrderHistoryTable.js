import React, { useState } from "react";
import PropTypes from "prop-types";
import { navigate } from "@reach/router";

import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TableCell from "@material-ui/core/TableCell";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const headCells = [
  { id: "orderNum", disablePadding: false, label: "Order #" },
  { id: "distributor", disablePadding: false, label: "Distributor" },
  { id: "state", disablePadding: false, label: "State" },
  { id: "program", disablePadding: false, label: "Program" },
  { id: "orderDate", disablePadding: true, label: "Order Date" },
  { id: "shipDate", disablePadding: false, label: "Ship Date" },
  { id: "deliveredDate", disablePadding: false, label: "Delivered Date" },
  { id: "tracking", disablePadding: false, label: "Tracking" },
  { id: "totalItems", disablePadding: false, label: "Total Items" },
  { id: "orderTotal", disablePadding: false, label: "Order Total" },
  { id: "status", disablePadding: false, label: "Status" },
];

const EnhancedTableHead = (props) => {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            className={classes.headerText}
            key={headCell.id}
            align="left"
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  orderHistoryRow: {
    "&&:hover": {
      cursor: "pointer",
    },
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

const OrderHistoryTable = ({ orders }) => {
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("orderDate");

  const handleRequestSort = (_event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    //TODO make api call to get sorted data
  };

  const handleRowClick = (orderNum) => {
    navigate(`/orders/history/${orderNum}`);
  };

  if (orders.length === 0) {
    return (
      <>
        <Typography className={classes.headerText}>
          {`You currently don't have any orders on record..`}
        </Typography>
      </>
    );
  }

  return (
    <>
      <TableContainer className={classes.tableContainer}>
        <Table className={classes.table}>
          <EnhancedTableHead
            classes={classes}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {orders.map((row) => (
              <TableRow
                key={row.orderNum}
                hover
                className={classes.orderHistoryRow}
                onClick={() => {
                  handleRowClick(row.orderNum);
                }}
              >
                <TableCell align="left">{row.orderNum}</TableCell>
                <TableCell align="left">{row.distributor}</TableCell>
                <TableCell align="left">{row.state}</TableCell>
                <TableCell align="left">{row.program}</TableCell>
                <TableCell align="left">{row.orderDate}</TableCell>
                <TableCell align="left">{row.shipDate}</TableCell>
                <TableCell align="left">{row.deliveredDate}</TableCell>
                <TableCell align="left">{row.trackingNum}</TableCell>
                <TableCell align="left">{row.totalItems}</TableCell>
                <TableCell align="left">{row.orderTotal}</TableCell>
                <TableCell align="left">{row.orderStatus}</TableCell>
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
