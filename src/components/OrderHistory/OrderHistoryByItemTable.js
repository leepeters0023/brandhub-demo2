import React, { useState } from "react";
import PropTypes from "prop-types";
import { navigate } from "@reach/router";
import format from "date-fns/format";

import { formatMoney } from "../../utility/utilityFunctions";

import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TableCell from "@material-ui/core/TableCell";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

const headCells = [
  { id: "sequenceNum", disablePadding: false, label: "Sequence #", sort: true },
  { id: "program", disablePadding: false, label: "Program", sort: true },
  { id: "itemType", disablePadding: false, label: "Item Type", sort: true },
  {
    id: "distributor",
    disablePadding: false,
    label: "Distributor",
    sort: true,
  },
  { id: "state", disablePadding: false, label: "State", sort: false },
  { id: "packSize", disablePadding: false, label: "Qty / Pack", sort: false },
  {
    id: "totalItems",
    disablePadding: false,
    label: "Total Items",
    sort: false,
  },
  { id: "estCost", disablePadding: false, label: "Est. Cost", sort: false },
  { id: "estTotal", disablePadding: false, label: "Est. Total", sort: false },
  { id: "actCost", disablePadding: false, label: "Act. Cost", sort: false },
  { id: "actTotal", disablePadding: false, label: "Act. Total", sort: false },
  { id: "orderDate", disablePadding: false, label: "Order Date", sort: true },
  { id: "shipDate", disablePadding: false, label: "Ship Date", sort: true },
  { id: "tracking", disablePadding: false, label: "Tracking #", sort: false },
  { id: "status", disablePadding: false, label: "Status", sort: true },
];

const EnhancedTableHead = (props) => {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => {
          if (!headCell.sort) {
            return (
              <TableCell
                className={classes.headerText}
                key={headCell.id}
                align="left"
              >
                {headCell.label}
              </TableCell>
            );
          } else {
            return (
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
                      {order === "desc"
                        ? "sorted descending"
                        : "sorted ascending"}
                    </span>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            );
          }
        })}
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

const OrderHistoryByItemTable = ({
  items,
  handleSort,
  isOrdersLoading,
  scrollRef,
}) => {
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("orderDate");

  const handleRequestSort = (_event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    handleSort({ order: isAsc ? "desc" : "asc", orderBy: property });
  };

  const handleRowClick = (orderNum) => {
    navigate(`/orders/history/${orderNum}`);
  };

  return (
    <>
      <TableContainer
        className={classes.tableContainer}
        style={{ maxHeight: "Calc(100vh - 275px)" }}
        ref={scrollRef}
      >
        <Table
          stickyHeader
          className={classes.table}
          style={{ minWidth: "1325px" }}
        >
          <EnhancedTableHead
            classes={classes}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {!isOrdersLoading && items.length === 0 && (
              <TableRow>
                <TableCell align="left" colSpan={11}>
                  <Typography className={classes.headerText}>
                    {`You currently don't have any items on record that match this search criteria..`}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!isOrdersLoading &&
              items.length > 0 &&
              items.map((row) => (
                <TableRow
                  key={row.orderNum}
                  hover
                  className={classes.orderHistoryRow}
                  onClick={() => {
                    handleRowClick(row.orderNum);
                  }}
                >
                  <TableCell align="left">{row.sequenceNum}</TableCell>
                  <TableCell align="left">{row.program}</TableCell>
                  <TableCell align="left">{row.itemType}</TableCell>
                  <TableCell align="left">{row.distributor}</TableCell>
                  <TableCell align="left">{row.state}</TableCell>
                  <TableCell align="left">{row.packSize}</TableCell>
                  <TableCell align="left">{row.totalItems}</TableCell>
                  <TableCell align="left">
                    {row.estCost !== "---"
                      ? formatMoney(row.estCost)
                      : row.estCost}
                  </TableCell>
                  <TableCell align="left">
                    {row.estTotal !== "---"
                      ? formatMoney(row.estTotal)
                      : row.estTotal}
                  </TableCell>
                  <TableCell align="left">
                    {row.actCost !== "---"
                      ? formatMoney(row.actCost)
                      : row.actCost}
                  </TableCell>
                  <TableCell align="left">
                    {row.actTotal !== "---"
                      ? formatMoney(row.actTotal)
                      : row.actTotal}
                  </TableCell>
                  <TableCell align="left">
                    {row.orderDate !== "---"
                      ? format(new Date(row.orderDate), "MM/dd/yyyy")
                      : row.orderDate}
                  </TableCell>
                  <TableCell align="left">
                    {row.orderDate !== "---"
                      ? format(new Date(row.shipDate), "MM/dd/yyyy")
                      : row.shipDate}
                  </TableCell>
                  <TableCell align="left">{row.tracking}</TableCell>
                  <TableCell align="left">
                    {row.orderStatus[0].toUpperCase() +
                      row.orderStatus.slice(1)}
                  </TableCell>
                </TableRow>
              ))}
            {isOrdersLoading && (
              <TableRow>
                <TableCell align="left" colSpan={11}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

OrderHistoryByItemTable.propTypes = {
  orders: PropTypes.array,
  handleSort: PropTypes.func.isRequired,
  isOrdersLoading: PropTypes.bool.isRequired,
  scrollRef: PropTypes.any.isRequired,
};

export default OrderHistoryByItemTable;
