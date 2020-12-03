import React, { useState } from "react";
import PropTypes from "prop-types";
import { navigate } from "@reach/router";

import { useSelector } from "react-redux";

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
import Tooltip from "@material-ui/core/Tooltip";

import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

const headCells = [
  { id: "poNum", disablePadding: false, label: "PO #", sort: true },
  {
    id: "sequenceNum",
    disablePadding: false,
    label: "Sequence #",
    sort: false,
  },
  { id: "projectNum", disablePadding: false, label: "Project #", sort: false },
  { id: "supplier", disablePadding: false, label: "Supplier", sort: true },
  { id: "itemType", disablePadding: false, label: "Item Type", sort: false },
  { id: "itemDesc", disablePadding: false, label: "Item Desc.", sort: false },
  { id: "brand", disablePadding: false, label: "Brand", sort: false },
  {
    id: "totalItems",
    disablePadding: false,
    label: "Quantity",
    sort: false,
  },
  {
    id: "estCost",
    disablePadding: false,
    label: "Est. Cost/Unit",
    sort: false,
  },
  {
    id: "actCost",
    disablePadding: false,
    label: "Act. Cost/Unit",
    sort: false,
  },
  { id: "status", disablePadding: false, label: "Status", sort: true },
  { id: "dueDate", disablePadding: false, label: "In-Market Date", sort: true },
];

const EnhancedTableHead = (props) => {
  const { classes, order, orderBy, onRequestSort, role } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const currentHeadCells =
    role !== "supplier"
      ? headCells.filter(
          (cell) => cell.id !== "itemDesc" && cell.id !== "itemType"
        )
      : headCells.filter(
          (cell) => cell.id !== "supplier" && cell.id !== "estCost"
        );

  return (
    <TableHead>
      <TableRow>
        {currentHeadCells.map((headCell) => {
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
  scrollRef,
}) => {
  const classes = useStyles();
  const role = useSelector((state) => state.user.role);
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
            role={role}
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
                  <TableCell align="left">{row.sequenceNum}</TableCell>
                  <TableCell align="left">{row.projectNum}</TableCell>
                  {role !== "supplier" && (
                    <TableCell align="left">{row.supplier}</TableCell>
                  )}
                  {role === "supplier" && (
                    <>
                      <TableCell align="left">{row.itemType}</TableCell>
                      <TableCell align="left">{row.itemDesc}</TableCell>
                    </>
                  )}
                  {row.brand.length > 1 ? (
                    <Tooltip placement="left" title={`${row.brand.join(", ")}`}>
                      <TableCell
                        align="left"
                        style={{ display: "flex", alignItems: "flex-end" }}
                      >
                        {row.brands[0]}
                        <MoreHorizIcon fontSize="small" color="inherit" />
                      </TableCell>
                    </Tooltip>
                  ) : (
                    <TableCell align="left">{row.brand[0]}</TableCell>
                  )}
                  <TableCell align="left">{row.totalItems}</TableCell>
                  {role !== "supplier" && (
                    <TableCell align="left">
                      {formatMoney(row.estCost, true)}
                    </TableCell>
                  )}
                  <TableCell align="left">{formatMoney(row.actCost, true)}</TableCell>
                  <TableCell align="left">
                    {row.status[0].toUpperCase() + row.status.slice(1)}
                  </TableCell>
                  <TableCell align="left">{row.dueDate}</TableCell>
                </TableRow>
              ))}
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
