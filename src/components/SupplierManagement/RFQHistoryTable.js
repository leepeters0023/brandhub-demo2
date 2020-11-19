import React, { useState } from "react";
import PropTypes from "prop-types";
import { navigate } from "@reach/router";
import format from "date-fns/format";

import { useSelector, useDispatch } from "react-redux";

import { resetRFQ } from "../../redux/slices/rfqSlice";

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
  { id: "rfqNum", disablePadding: false, label: "RFQ #", sort: true },
  { id: "sequenceNum", disablePadding: false, label: "Sequence #", sort: true },
  { id: "program", disablePadding: false, label: "Program", sort: true },
  { id: "itemType", disablePadding: false, label: "Item Type", sort: true },
  {
    id: "totalItems",
    disablePadding: false,
    label: "Total Ordered",
    sort: false,
  },
  { id: "estCost", disablePadding: false, label: "Est. Cost", sort: false },
  {
    id: "totalEstCost",
    disablePadding: false,
    label: "Est. Total",
    sort: false,
  },
  { id: "dueDate", disablePadding: false, label: "Due Date", sort: true },
  { id: "status", disablePadding: false, label: "Status", sort: true },
];

const EnhancedTableHead = (props) => {
  const { classes, order, orderBy, onRequestSort } = props;
  const role = useSelector((state) => state.user.role);
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  console.log(role)

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

const RFQHistoryTable = ({ rfqs, rfqsLoading, handleSort, scrollRef }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("sequenceNum");

  const handleStatus = (status, bids) => {
    if (status === "sent") {
      let bidCount = 0;
      bids.forEach((bid) => {
        if (bid.status === "sent") {
          bidCount += 1
        }
      })
      if (bidCount !== bids.length) {
        return `Waiting for Resp. ${bidCount}/${bids.length}`
      } else {
        return "Ready for Review"
      }
    } else {
      return status[0].toUpperCase() + status.slice(1);
    }
  }

  const handleRequestSort = (_event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    handleSort({ order: isAsc ? "desc" : "asc", orderBy: property });
  };

  const handleRowClick = (rfqNum) => {
    dispatch(resetRFQ());
    navigate(`/purchasing/rfq#${rfqNum}`);
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
            {!rfqsLoading && rfqs.length === 0 && (
              <TableRow>
                <TableCell align="left" colSpan={11}>
                  <Typography className={classes.headerText}>
                    {`There are no items that match the current search criteria..`}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!rfqsLoading &&
              rfqs.length > 0 &&
              rfqs.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  className={classes.clickableRow}
                  onClick={() => {
                    handleRowClick(row.id);
                  }}
                >
                  <TableCell align="left">{row.id}</TableCell>
                  <TableCell align="left">{row.sequenceNum}</TableCell>
                  <TableCell align="left">{row.program}</TableCell>
                  <TableCell align="left">{row.itemType}</TableCell>
                  <TableCell align="left">{row.totalItems}</TableCell>
                  <TableCell align="left">{formatMoney(row.estCost)}</TableCell>
                  <TableCell align="left">
                    {formatMoney(row.totalEstCost)}
                  </TableCell>
                  <TableCell>{format(new Date(), "MM/dd/yyyy")}</TableCell>
                  <TableCell align="left">{handleStatus(row.status, row.bids)}</TableCell>
                </TableRow>
              ))}
            {rfqsLoading && (
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

RFQHistoryTable.propTypes = {
  rfqs: PropTypes.array,
  handleSort: PropTypes.func.isRequired,
  rfqsLoading: PropTypes.bool.isRequired,
  scrollRef: PropTypes.any,
};

export default RFQHistoryTable;
