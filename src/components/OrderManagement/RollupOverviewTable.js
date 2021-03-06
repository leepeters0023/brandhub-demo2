import React, { useState } from "react";
import PropTypes from "prop-types";
import { navigate } from "@reach/router";
import format from "date-fns/format";

import { useSelector } from "react-redux";

import { formatMoney, formatDate } from "../../utility/utilityFunctions";

import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TableCell from "@material-ui/core/TableCell";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

const headCells = [
  { id: "user", disablePadding: false, label: "Ordered By", sort: false },
  { id: "program", disablePadding: false, label: "Program", sort: true },
  { id: "brand", disablePadding: false, label: "Brand", sort: false },
  { id: "state", disablePadding: false, label: "State", sort: false },
  {
    id: "totalEstCost",
    disablePadding: false,
    label: "Est. Cost",
    sort: false,
  },
  {
    id: "orderDate",
    disablePadding: false,
    label: "Order Submitted",
    sort: false,
  },
  {
    id: "dueDate",
    disablePadding: false,
    label: "Order Window Close",
    sort: false,
  },
  {
    id: "inMarketDate",
    disablePadding: false,
    label: "In Market Date",
    sort: false,
  },
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

const RollupOverViewTable = ({
  rollupData,
  handleSort,
  isRollupLoading,
  scrollRef,
  orderRef,
}) => {
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("user");

  const currentUserRole = useSelector((state) => state.user.role);

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

  return (
    <>
      <TableContainer
        className={classes.tableContainer}
        style={{ maxHeight: "Calc(100vh - 300px)" }}
        ref={scrollRef}
      >
        <Table stickyHeader className={classes.table} ref={orderRef}>
          <EnhancedTableHead
            classes={classes}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {!isRollupLoading && rollupData.length === 0 && (
              <TableRow>
                <TableCell align="left" colSpan={12}>
                  <Typography className={classes.headerText}>
                    {`There is currently no rollup data to display..`}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!isRollupLoading &&
              rollupData.length > 0 &&
              rollupData.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  className={
                    currentUserRole !== "read-only"
                      ? classes.orderHistoryRow
                      : null
                  }
                  onClick={() => {
                    if (currentUserRole !== "read-only") {
                      navigate(
                        `/rollup/detail/${row.id}#${row.userName} - ${row.program}`
                      );
                    }
                  }}
                >
                  <TableCell align="left">{row.userName}</TableCell>
                  {row.program.length > 1 ? (
                    <Tooltip
                      placement="left"
                      title={`${row.program.join(", ")}`}
                    >
                      <TableCell align="left">
                        {row.program[0]}
                        <MoreHorizIcon
                          fontSize="small"
                          color="inherit"
                          style={{ float: "right" }}
                        />
                      </TableCell>
                    </Tooltip>
                  ) : (
                    <TableCell align="left">{row.program[0]}</TableCell>
                  )}
                  {row.brand.length > 1 ? (
                    <Tooltip placement="left" title={`${row.brand.join(", ")}`}>
                      <TableCell align="left">
                        {row.brand[0]}
                        <MoreHorizIcon
                          fontSize="small"
                          color="inherit"
                          style={{ float: "right" }}
                        />
                      </TableCell>
                    </Tooltip>
                  ) : (
                    <TableCell align="left">{row.brand[0]}</TableCell>
                  )}
                  <TableCell align="left">{row.state}</TableCell>
                  <TableCell align="left">
                    {formatMoney(row.totalEstCost, false)}
                  </TableCell>
                  <TableCell align="left">
                    {row.orderDate !== "---"
                      ? format(
                          formatDate(new Date(row.orderDate)),
                          "MM/dd/yyyy"
                        )
                      : row.orderDate}
                  </TableCell>
                  <TableCell align="left">
                    {row.dueDate !== "---"
                      ? format(formatDate(new Date(row.dueDate)), "MM/dd/yyyy")
                      : row.dueDate}
                  </TableCell>
                  <TableCell align="left">
                    {row.inMarketDate !== "---"
                      ? format(
                          formatDate(new Date(row.inMarketDate)),
                          "MM/dd/yyyy"
                        )
                      : row.inMarketDate}
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

RollupOverViewTable.propTypes = {
  rollupData: PropTypes.array,
  handleSort: PropTypes.func.isRequired,
  isRollupLoading: PropTypes.bool.isRequired,
  scrollRef: PropTypes.any.isRequired,
};

export default RollupOverViewTable;
