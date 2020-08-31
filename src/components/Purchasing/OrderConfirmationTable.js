import React from "react";
import PropTypes from "prop-types";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const OrderConfirmationTable = ({ items }) => {
  console.log(items);
  const classes = useStyles();

  return (
    <>
      <TableContainer className={classes.cartContainer}>
        <Table className={classes.table} aria-label="order-items">
          <TableHead>
            <TableRow>
              <TableCell className={classes.headerText} align="left">
                Preview
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Item
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Item #
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Qty / Pack
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Cost
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Qty
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Total
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.itemNumber}>
                <TableCell align="left">
                  <img
                    id={item.itemNumber}
                    className={classes.previewImg}
                    src={item.imgUrl}
                    alt={item.itemType}
                  />
                </TableCell>
                <TableCell align="left">{`${item.brand} ${item.itemType}`}</TableCell>
                <TableCell align="left">{item.itemNumber}</TableCell>
                <TableCell align="left">{item.qty}</TableCell>
                <TableCell align="left">{`$${item.price.toFixed(2)}`}</TableCell>
                <TableCell align="left">{item.totalItems}</TableCell>
                <TableCell align="left">{`$${item.estTotal.toFixed(2)}`}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

OrderConfirmationTable.propTypes = {
  items: PropTypes.array.isRequired,
};

export default OrderConfirmationTable;