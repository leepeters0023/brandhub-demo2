import React, { useState } from "react";
import PropTypes from "prop-types";
import { navigate } from "@reach/router";

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
  { id: "poNum", disablePadding: false, label: "PO #", sort: true },
  { id: "supplier", disablePadding: false, label: "Supplier", sort: true },
  {
    id: "totalItems",
    disablePadding: false,
    label: "Total Ordered",
    sort: false,
  },
  { id: "estTotal", disablePadding: false, label: "Est. Total", sort: false },
  { id: "actTotal", disablePadding: false, label: "Act. Total", sort: false },
  { id: "status", disablePadding: false, label: "Status", sort: true },
  { id: "shipDate", disablePadding: false, label: "Ship Date", sort: true}
];

const EnhancedTableHead = (props) => {
  const {
    classes,
    order,
    orderBy,
    onRequestSort,
  } = props;
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

const PurchaseOrderHistoryTable = ({
  pos,
  posLoading,
  handleSort,
  scrollRef
}) => {
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("sequenceNum");

  const handleRequestSort = (_event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    handleSort({ order: isAsc ? "desc" : "asc", orderBy: property });
  };

  const handleRowClick = (poNum) => {
    navigate(`/purchasing/purchaseOrder#${poNum}`);
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
            {!posLoading && pos.length === 0 && (
              <TableRow>
                <TableCell align="left" colSpan={11}>
                  <Typography className={classes.headerText}>
                    {`There are no items that match the current search criteria..`}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!posLoading &&
              pos.length > 0 &&
              pos.map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    className={classes.clickableRow}
                    onClick={() => {
                      handleRowClick(row.poNum);
                    }}
                  >
                    <TableCell align="left">{row.poNum}</TableCell>
                    <TableCell align="left">{row.supplier}</TableCell>
                    <TableCell align="left">{row.totalItems}</TableCell>
                    <TableCell align="left">
                      {formatMoney(row.estTotal)}
                    </TableCell>
                    <TableCell align="left">
                      {formatMoney(row.actTotal)}
                    </TableCell>
                    <TableCell align="left">{row.status}</TableCell>
                    <TableCell align="left">{row.shipDate}</TableCell>
                  </TableRow>
                )
              )}
            {posLoading && (
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

PurchaseOrderHistoryTable.propTypes = {
  pos: PropTypes.array,
  handleSort: PropTypes.func.isRequired,
  posLoading: PropTypes.bool.isRequired,
  scrollRef: PropTypes.any,
};

export default PurchaseOrderHistoryTable;