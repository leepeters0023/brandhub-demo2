import React from "react";
import PropTypes from "prop-types";

import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

const headCells = [
  { id: "id", disablePadding: false, label: "Region / Key Acct. Code", sort: true },
  { id: "name", disablePadding: false, label: "Name", sort: true },
  { id: "type", disablePadding: false, label: "Type", sort: false },
  { id: "states", disablePadding: false, label: "States", sort: false },
];
const TerritoryTableHead = (props) => {
  const { classes } = props;

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => {
          return (
            <TableCell
              className={classes.headerText}
              key={headCell.id}
              align="left"
            >
              {headCell.label}
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
};

TerritoryTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
};

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  clickableRow: {
    "&&:hover": {
      cursor: "pointer",
    },
  },
  cellRoot: {
    minWidth: "500px",
  },
}));

const TerritoryTable = ({
  handleTerritoryClick,
  territories,
  isLoading,
}) => {
  const classes = useStyles();

  return (
    <>
      <TableContainer
        style={{ maxHeight: "Calc(100vh - 275px)" }}
      >
        <Table stickyHeader className={classes.table}>
          <TerritoryTableHead
            classes={classes}
          />
          <TableBody>
            {!isLoading && territories.length === 0 && (
              <TableRow>
                <TableCell align="left" colSpan={6}>
                  <Typography className={classes.headerText}>
                    {`There are currently no visible territories..`}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              territories.length > 0 &&
              territories.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  className={classes.clickableRow}
                  onClick={() => {
                    handleTerritoryClick(row.id, "edit");
                  }}
                >
                  <TableCell align="left">{row.code}</TableCell>
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="left">{row.type}</TableCell>
                  <TableCell align="left" classes={{ root: classes.cellRoot }}>
                    {row.states
                      .map((state) => state.code)
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
            {isLoading && (
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

TerritoryTable.propTypes = {
  handleTerritoryClick: PropTypes.func,
};

export default TerritoryTable;
