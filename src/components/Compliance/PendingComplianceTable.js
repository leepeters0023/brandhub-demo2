import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TableCell from "@material-ui/core/TableCell";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

//There is no sorting or filtering for this table at the moment, but we are leaving the
//ability to to add that if need be

const headCells = [
  { id: "territory", disablePadding: false, label: "Territory", sort: false },
  { id: "user", disablePadding: false, label: "Person", sort: false },
  { id: "distributorName", disablePadding: false, label: "Distributor", sort: false },
  { id: "distributorState", disablePadding: false, label: "State", sort: false },
  { id: "qty", disablePadding: false, label: "Total Items", sort: false },
  { id: "rule", disablePadding: false, label: "Rule", sort: false },
];

const EnhancedTableHead = (props) => {
  const {
    classes,
    rowCount,
    order,
    orderBy,
    onRequestSort,
    onSelectAllClick,
    numSelected,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            disabled={rowCount.length === 0}
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all items" }}
          />
        </TableCell>
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

const ComplianceItemsTable = ({
  items,
  itemsLoading,
  handleSort,
  itemSelected,
  setItemSelected,
}) => {
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("user");
  const [selected, setSelected] = useState([]);

  const handleRequestSort = (_event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    handleSort({ order: isAsc ? "desc" : "asc", orderBy: property });
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = items.map((item) => item.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (_event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  useEffect(() => {
    if (selected.length > 0 && !itemSelected) {
      setItemSelected(true);
    }
  }, [selected, setItemSelected, itemSelected]);

  useEffect(() => {
    if (selected.length === 0 && itemSelected) {
      setItemSelected(false);
    }
  }, [selected, setItemSelected, itemSelected]);

  return (
    <>
      <TableContainer
        className={classes.tableContainer}
        style={{ maxHeight: "Calc(100vh - 375px)" }}
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
            numSelected={selected.length}
            onSelectAllClick={handleSelectAllClick}
            rowCount={items.length}
          />
          <TableBody>
            {!itemsLoading && items.length === 0 && (
              <TableRow>
                <TableCell align="left" colSpan={11}>
                  <Typography className={classes.headerText}>
                    {`There are no order items that match the current search criteria..`}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!itemsLoading &&
              items.length > 0 &&
              items.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `compliance-Checkbox-${index}`;
                return (
                  <TableRow key={index} hover >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{ "aria-labelledby": labelId }}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => {
                          handleClick(event, row.id);
                          event.stopPropagation();
                        }}
                      />
                    </TableCell>
                    <TableCell align="left">{row.territory}</TableCell>
                    <TableCell align="left">{row.user}</TableCell>
                    <TableCell align="left">{row.distributorName}</TableCell>
                    <TableCell align="left">{row.distributorState}</TableCell>
                    <TableCell align="left">{row.totalItems}</TableCell>
                    <TableCell align="left">{row.rule}</TableCell>
                  </TableRow>
                );
              })}
            {itemsLoading && (
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

ComplianceItemsTable.propTypes = {
  items: PropTypes.array,
  //handleSort: PropTypes.func.isRequired,
  itemsLoading: PropTypes.bool.isRequired,
  scrollRef: PropTypes.any,
};

export default ComplianceItemsTable;