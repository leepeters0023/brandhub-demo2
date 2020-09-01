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

const ItemCatalogTable = ({ currentItems, handlePreview }) => {
  const classes = useStyles();

  return (
    <>
      <TableContainer className={classes.tableContainer}>
        <Table className={classes.table} aria-label="item-catalog">
          <TableHead>
            <TableRow>
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
                Qty / Pack
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Cost
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.map((item) => (
              <TableRow key={item.itemNumber} hover>
                <TableCell align="left">
                  <img
                    id={item.itemNumber}
                    className={classes.previewImageFloat}
                    src={item.imgUrl}
                    alt={item.itemType}
                    onClick={() => handlePreview(item.itemNumber)}
                  />
                </TableCell>
                <TableCell align="left">{`${item.brand} ${item.itemType}`}</TableCell>
                <TableCell align="left">{item.itemNumber}</TableCell>
                <TableCell align="left">{item.brand}</TableCell>
                <TableCell align="left">{item.qty}</TableCell>
                <TableCell>{item.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

ItemCatalogTable.propTypes = {
  items: PropTypes.array,
  handlePreview: PropTypes.func.isRequired,
}

export default ItemCatalogTable;
