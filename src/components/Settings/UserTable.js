import React, { useState } from "react";
import PropTypes from "prop-types";

//import { useSelector } from "react-redux";

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
  { id: "id", disablePadding: false, label: "User Id", sort: true },
  { id: "name", disablePadding: false, label: "Name", sort: true },
  { id: "email", disablePadding: false, label: "Email", sort: false },
  { id: "role", disablePadding: false, label: "Role", sort: false },
  {
    id: "territories",
    disablePadding: false,
    label: "Territories",
    sort: false,
  },
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
  cellRoot: {
    minWidth: "500px",
  },
}));

const UserTable = ({
  handleUserClick,
  users,
  handleSort,
  isUsersLoading,
  scrollRef,
}) => {
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");

  const handleRequestSort = (_event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    handleSort({ order: isAsc ? "desc" : "asc", orderBy: property });
  };

  return (
    <>
      <TableContainer
        style={{ maxHeight: "Calc(100vh - 275px)" }}
        ref={scrollRef}
      >
        <Table stickyHeader className={classes.table}>
          <EnhancedTableHead
            classes={classes}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {!isUsersLoading && users.length === 0 && (
              <TableRow>
                <TableCell align="left" colSpan={6}>
                  <Typography className={classes.headerText}>
                    {`There are currently no users on record that match this search criteria..`}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!isUsersLoading &&
              users.length > 0 &&
              users.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  className={classes.clickableRow}
                  onClick={() => {
                    handleUserClick(row.id);
                  }}
                >
                  <TableCell align="left">{row.id}</TableCell>
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="left">{row.email}</TableCell>
                  <TableCell align="left">
                    {row.role[0].toUpperCase() + row.role.slice(1)}
                  </TableCell>
                  <TableCell align="left" classes={{ root: classes.cellRoot }}>
                    {row.territories
                      .map((terr) => terr.name)
                      .sort((a, b) => {
                        return a.toLowerCase()[0] < b.toLowerCase()[0]
                          ? -1
                          : a.toLowerCase()[0] > b.toLowerCase()[0]
                          ? 1
                          : 0;
                      })
                      .join(", ")}
                  </TableCell>
                </TableRow>
              ))}
            {isUsersLoading && (
              <TableRow>
                <TableCell align="left" colSpan={6}>
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

UserTable.propTypes = {
  handleUserClick: PropTypes.func,
};

export default UserTable;
