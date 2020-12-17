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
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";

const headCells = [
  { id: "user", disablePadding: false, label: "Person", sort: true },
  { id: "itemNumber", disablePadding: false, label: "Sequence #", sort: true },
  { id: "program", disablePadding: false, label: "Program", sort: true },
  { id: "itemType", disablePadding: false, label: "Item Type", sort: true },
  {
    id: "itemDescription",
    disablePadding: false,
    label: "Item Desc.",
    sort: false,
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
  {
    id: "totalEstCost",
    disablePadding: false,
    label: "Est. Total",
    sort: false,
  },
  { id: "orderDate", disablePadding: false, label: "Order Date", sort: true },
  { id: "dueDate", disablePadding: false, label: "In-Market Date", sort: true },
  { id: "status", disablePadding: false, label: "Status", sort: false },
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

const RollupOverviewByItemTable = ({
  items,
  handleSort,
  isRollupLoading,
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

  const statusConverter = (status) => {
    if (status === "inactive") {
      return "Not Started";
    } else if (status === "in-progress") {
      return "In Progress";
    } else if (status === "submitted") {
      return "Order Submitted";
    } else {
      return "Error";
    }
  };

  const handleRowClick = (id, userName, program) => {
    navigate(`/rollup/detail/${id}#${userName} - ${program}`);
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
            {!isRollupLoading && items.length === 0 && (
              <TableRow>
                <TableCell align="left" colSpan={11}>
                  <Typography className={classes.headerText}>
                    {`You currently don't have any items on record that match this search criteria..`}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!isRollupLoading &&
              items.length > 0 &&
              items.map((row, index) => (
                <TableRow
                  key={index}
                  hover
                  className={classes.orderHistoryRow}
                  onClick={() => {
                    handleRowClick(row.orderSetId, row.user, row.program);
                  }}
                >
                  <TableCell align="left">{row.user}</TableCell>
                  <TableCell align="left">{row.itemNumber}</TableCell>
                  <TableCell align="left">{row.program}</TableCell>
                  <TableCell align="left" style={{ whiteSpace: "nowrap" }}>
                    {row.itemType}
                  </TableCell>
                  <TableCell align="left">{row.itemDescription}</TableCell>
                  {row.state.length > 2 ? (
                    <Tooltip
                      title={`${row.state.split(", ").splice(1).join(", ")}`}
                    >
                      <TableCell align="left">
                        <Typography variant="body2">{`${
                          row.state.split(", ")[0]
                        }...`}</Typography>
                      </TableCell>
                    </Tooltip>
                  ) : (
                    <TableCell align="left">{row.state}</TableCell>
                  )}
                  <TableCell align="left">{row.packSize}</TableCell>
                  <TableCell align="left">{row.totalItems}</TableCell>
                  <TableCell align="left">
                    {row.estCost !== "---"
                      ? formatMoney(row.estCost, false)
                      : row.estCost}
                  </TableCell>
                  <TableCell align="left">
                    {row.totalEstCost !== "---"
                      ? formatMoney(row.totalEstCost, false)
                      : row.totalEstCost}
                  </TableCell>
                  <TableCell align="left">
                    {row.orderDate !== "---"
                      ? format(new Date(row.orderDate), "MM/dd/yyyy")
                      : row.orderDate}
                  </TableCell>
                  <TableCell align="left">
                    {row.orderDue !== "---"
                      ? format(new Date(row.orderDue), "MM/dd/yyyy")
                      : row.orderDue}
                  </TableCell>
                  <TableCell align="left">
                    {statusConverter(row.status)}
                  </TableCell>
                </TableRow>
              ))}
            {isRollupLoading && (
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

RollupOverviewByItemTable.propTypes = {
  items: PropTypes.array,
  handleSort: PropTypes.func.isRequired,
  isRollupLoading: PropTypes.bool.isRequired,
  scrollRef: PropTypes.any.isRequired,
};

export default RollupOverviewByItemTable;
