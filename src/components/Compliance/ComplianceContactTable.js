import React from "react";
import PropTypes from "prop-types";

import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  clickableRow: {
    "&&:hover": {
      cursor: "pointer",
    },
  },
}));

const ComplianceContactTable = ({ contacts, isLoading, handleRowClick }) => {
  const classes = useStyles();
  return (
    <>
      <TableContainer
        className={classes.tableContainer}
        style={{ maxHeight: "Calc(100vh - 200px)" }}
      >
        <Table stickyHeader className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell className={classes.headerText} align="left">
                State
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Brand Group
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Name
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Email
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading &&
              contacts.length > 0 &&
              contacts.map((contact) => (
                <TableRow
                  key={contact.id}
                  hover
                  className={classes.clickableRow}
                  onClick={() => handleRowClick(contact.id)}
                >
                  <TableCell align="left">{contact.state}</TableCell>
                  <TableCell align="left">{contact.brandGroup}</TableCell>
                  <TableCell align="left">{contact.name}</TableCell>
                  <TableCell align="left">{contact.email}</TableCell>
                </TableRow>
              ))}
            {isLoading && (
              <TableRow>
                <TableCell align="left" colSpan={4}>
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

ComplianceContactTable.propTypes = {
  contacts: PropTypes.array,
  isLoading: PropTypes.bool.isRequired,
  handleRowClick: PropTypes.func.isRequired
}

export default ComplianceContactTable;
