import React from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

import StarBorderIcon from "@material-ui/icons/StarBorder";
import AddBoxIcon from "@material-ui/icons/AddBox";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  tableButtonWrapper: {
    display: "flex",
    flexWrap: "none",
  },
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
              {type !== "preOrder" && (
                <TableCell className={classes.headerText} align="left">
                  Qty
                </TableCell>
              )}
              <TableCell className={classes.headerText}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.map((row) => (
              <TableRow key={row.itemNumber} hover>
                <TableCell component="th" scope="row">
                  <Tooltip title="Favorite">
                    <IconButton>
                      <StarBorderIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell align="left">
                  <img
                    id={row.itemNumber}
                    className={classes.previewImageFloat}
                    src={row.imgUrl}
                    alt={row.itemType}
                    onClick={() => handlePreview(row.itemNumber)}
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
                {type !== "preOrder" && (
                  <TableCell>
                    <TextField
                      color="secondary"
                      size="small"
                      style={{ width: "55px" }}
                      id={`${row.itemNumber}`}
                      placeholder="Qty"
                      variant="outlined"
                    />
                  </TableCell>
                )}
                <TableCell>
                  <div className={classes.tableButtonWrapper}>
                    <Tooltip placement="top" title="Add to PDF">
                      <span>
                        <Button
                          variant="contained"
                          color="secondary"
                          id={`${row.itemNumber}`}
                          style={{ margin: "5px 2.5px" }}
                        >
                          <PictureAsPdfIcon className={classes.navIcon} />
                        </Button>
                      </span>
                    </Tooltip>
                    {type !== "preOrder" && (
                      <Tooltip title="Add to Order">
                        <span>
                          <Button
                            variant="contained"
                            color="secondary"
                            id={`${row.itemNumber}`}
                            style={{ margin: "5px 2.5px" }}
                          >
                            <AddBoxIcon className={classes.navIcon} />
                          </Button>
                        </span>
                      </Tooltip>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

OrderItemTableView.propTypes = {
  type: PropTypes.string.isRequired,
  currentItems: PropTypes.array.isRequired,
  handlePreview: PropTypes.func.isRequired,
};

export default OrderItemTableView;
