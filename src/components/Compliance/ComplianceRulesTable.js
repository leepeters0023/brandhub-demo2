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
  { id: "ruleType", disablePadding: false, label: "Rule Type", sort: false },
  { id: "desc", disablePadding: false, label: "Description", sort: false },
  { id: "itemTypes", disablePadding: false, label: "Item Types", sort: false },
  {
    id: "itemTypeCode",
    disablePadding: false,
    label: "Item Type Code",
    sort: false,
  },
  {
    id: "productFamilies",
    disablePadding: false,
    label: "Product Families",
    sort: false,
  },
  { id: "price", disablePadding: false, label: "Price", sort: false },
  { id: "states", disablePadding: false, label: "State Codes", sort: false },
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

const ComplianceRulesTable = ({
  rules,
  rulesLoading,
  handleSort,
  scrollRef,
}) => {
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("itemNumber");

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
            onRequestSort={handleRequestSort}
            order={order}
            orderBy={orderBy}
          />
          <TableBody>
            {!rulesLoading && rules.length === 0 && (
              <TableRow>
                <TableCell align="left" colSpan={11}>
                  <Typography className={classes.headerText}>
                    {`There are no rules that match the current search criteria..`}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!rulesLoading &&
              rules.length > 0 &&
              rules.map((row, index) => (
                <TableRow key={index} hover className={classes.clickableRow}>
                  <TableCell align="left">{row.ruleType}</TableCell>
                  <TableCell align="left">{row.desc}</TableCell>
                  <TableCell align="left">{row.itemTypes}</TableCell>
                  <TableCell align="left">{row.itemTypeCode}</TableCell>
                  <TableCell align="left">{row.productFamilies}</TableCell>
                  <TableCell align="left">
                    {row.price !== "---"
                      ? formatMoney(row.price, false)
                      : row.price}
                  </TableCell>
                  <TableCell align="left">{row.states}</TableCell>
                </TableRow>
              ))}
            {rulesLoading && (
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

ComplianceRulesTable.propTypes = {
  rules: PropTypes.array,
  handleSort: PropTypes.func.isRequired,
  rulesLoading: PropTypes.bool.isRequired,
  scrollRef: PropTypes.any,
};

export default ComplianceRulesTable;
