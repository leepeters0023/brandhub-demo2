import React from "react";
import PropTypes from "prop-types";

import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

const SpecDetailTable = ({ classes, specArray }) => {
  return (
    <TableContainer className={classes.tableContainer}>
      <Table className={classes.table} size="small">
        <TableBody>
          {specArray.map((spec, index) => (
            <TableRow key={index}>
              <TableCell classes={{root: classes.specTableCellRoot}} align="left" className={classes.headerText}>
                {spec.spec}
              </TableCell>
              <TableCell classes={{root: classes.specTableCellRoot}} align="left" className={classes.bodyText}>
                {spec.desc}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

SpecDetailTable.propTypes = {
  classes: PropTypes.object.isRequired,
  specArray: PropTypes.array,
};

export default React.memo(
  SpecDetailTable,
  (prev, next) =>
    prev.specArray &&
    next.specArray &&
    prev.specArray.length === next.specArray.length
);
