import React from "react";
import PropTypes from "prop-types";

import { formatMoney } from "../../utility/utilityFunctions";

import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";

const ItemAllocationTable = ({ classes, allocations }) => {
  return (
    <TableContainer
      className={classes.tableContainer}
    >
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell className={classes.headerText} align="left">
              Sequence #
            </TableCell>
            <TableCell className={classes.headerText} align="left">
              Item Type
            </TableCell>
            <TableCell className={classes.headerText} align="left">
              Qty
            </TableCell>
            <TableCell className={classes.headerText} align="left">
              Shipping Status
            </TableCell>
            <TableCell className={classes.headerText} align="left">
              Tracking Number
            </TableCell>
            <TableCell className={classes.headerText} align="left">
              Tax
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allocations.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} align="left">
                There are no allocations for this location
              </TableCell>
            </TableRow>
          )}
          {allocations.map((item) => (
            <TableRow key={item.id}>
              <TableCell align="left">{item.itemNumber}</TableCell>
              <TableCell align="left">{item.itemType}</TableCell>
              <TableCell align="left">{item.totalItems}</TableCell>
              <TableCell align="left">{item.shippingStatus}</TableCell>
              <TableCell align="left">{item.tracking}</TableCell>
              <TableCell align="left">{item.tax !== "---" ? formatMoney(item.tax, true) : item.tax}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

ItemAllocationTable.propTypes = {
  classes: PropTypes.object.isRequired,
  allocations: PropTypes.array
}

export default React.memo(ItemAllocationTable);