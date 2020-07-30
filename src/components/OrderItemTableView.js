import React from "react";

import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import StarBorderIcon from "@material-ui/icons/StarBorder";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const OrderItemTableView = (props) => {
  const { type, currentItems, handlePreview } = props;
  const classes = useStyles();
  return (
    <>
      <TableContainer className={classes.tableContainer}>
        <Table className={classes.table} aria-label="in-stock-table">
          <TableHead>
            <TableRow>
              <TableCell className={classes.headerText}></TableCell>
              <TableCell className={classes.headerText} align="left">
                Preview
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Item Name
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Item #
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Brand
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Qty / Item
              </TableCell>
              {type === "inStock" && (
                <TableCell className={classes.headerText} align="left">
                  Stock
                </TableCell>
              )}
              <TableCell className={classes.headerText} align="left">
                Cost
              </TableCell>
              <TableCell className={classes.headerText}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.map((row) => (
              <TableRow key={row.itemNumber} hover>
                <TableCell component="th" scope="row">
                  <IconButton>
                    <StarBorderIcon />
                  </IconButton>
                </TableCell>
                <TableCell align="left">
                  <img
                    id={row.itemNumber}
                    className={classes.previewImageFloat}
                    src={row.imgUrl}
                    alt={row.itemType}
                    onClick={handlePreview}
                  />
                </TableCell>
                <TableCell align="left">{`${row.brand} ${row.itemType}`}</TableCell>
                <TableCell align="left">{row.itemNumber}</TableCell>
                <TableCell align="left">{row.brand}</TableCell>
                <TableCell align="left">{row.qty}</TableCell>
                {type === "inStock" && (
                  <TableCell>
                    {Math.floor(Math.random() * 10 + 1) * 5}
                  </TableCell>
                )}
                <TableCell>{row.price}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    id={`${row.itemNumber}`}
                  >
                    <Tooltip title="Add to Cart">
                      <AddShoppingCartIcon color="primary" />
                    </Tooltip>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default OrderItemTableView;
