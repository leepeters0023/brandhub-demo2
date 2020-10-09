import React, { useState } from "react";
import PropTypes from "prop-types";

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
  { id: "user", disablePadding: false, label: "Person", sort: true },
  { id: "brand", disablePadding: false, label: "Brand", sort: true },
  { id: "territory", disablePadding: false, label: "Territory", sort: true },
  { id: "budget", disablePadding: false, label: "Budget", sort: false },
  { id: "onHold", disablePadding: false, label: "Pending", sort: false },
  { id: "committed", disablePadding: false, label: "Committed", sort: false },
  { id: "spent", disablePadding: false, label: "Paid", sort: false },
  { id: "remaining", disablePadding: false, label: "Remaining", sort: false },
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
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
};

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  clickableRow: {
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

const BudgetVsSpendTable = ({
  budgets,
  budgetsLoading,
  handleSort,
  scrollRef,
}) => {
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("user");

  const handleRequestSort = (_event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    handleSort({ order: isAsc ? "desc" : "asc", orderBy: property });
  };

  return (
    <>
      <TableContainer
        className={classes.tableContainer}
        style={{ maxHeight: "Calc(100vh - 375px)" }}
        ref={scrollRef}
      >
        <Table
          stickyHeader
          className={classes.table}
          style={{ minWidth: "1325px" }}
        >
          <EnhancedTableHead
            classes={classes}
            onRequestSort={handleRequestSort}
            order={order}
            orderBy={orderBy}
          />
          <TableBody>
            {!budgetsLoading && budgets.length === 0 && (
              <TableRow>
                <TableCell align="left" colSpan={11}>
                  <Typography className={classes.headerText}>
                    {`There are no budgets that match the current search criteria..`}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell align="left" className={classes.headerText} colSpan={3}>
                Totals:
              </TableCell>
              <TableCell align="left">
                $155,000.00
              </TableCell>
              <TableCell align="left">
              $155,000.00
              </TableCell>
              <TableCell align="left">
              $155,000.00
              </TableCell>
              <TableCell align="left">
              $155,000.00
              </TableCell>
              <TableCell align="left">
              $155,000.00
              </TableCell>
            </TableRow>
            {!budgetsLoading &&
              budgets.length > 0 &&
              budgets.map((row, index) => (
                <TableRow key={index} hover className={classes.clickableRow}>
                  <TableCell align="left">{row.user}</TableCell>
                  <TableCell align="left">{row.brand}</TableCell>
                  <TableCell align="left">{row.territory}</TableCell>
                  <TableCell align="left">{formatMoney(row.budget)}</TableCell>
                  <TableCell align="left">{formatMoney(row.onHold)}</TableCell>
                  <TableCell align="left">{formatMoney(row.committed)}</TableCell>
                  <TableCell align="left">{formatMoney(row.spent)}</TableCell>
                  <TableCell align="left">{formatMoney(row.remaining)}</TableCell>
                </TableRow>
              ))}
            {budgetsLoading && (
              <TableRow>
                <TableCell align="left" colSpan={9}>
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

BudgetVsSpendTable.propTypes = {
  budgets: PropTypes.array,
  handleSort: PropTypes.func.isRequired,
  budgetsLoading: PropTypes.bool.isRequired,
  scrollRef: PropTypes.any,
};

export default BudgetVsSpendTable;