import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
//import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

//import StarBorderIcon from "@material-ui/icons/StarBorder";
import AddBoxIcon from "@material-ui/icons/AddBox";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  tableButtonWrapper: {
    display: "flex",
    flexWrap: "none",
    width: "148px",
  },
  root: {
    width: "150px !important",
    maxWidth: "150px !important",
    minWidth: "150px !important",
  },
}));

const MemoInputCell = React.memo(
  ({ item, currentItemValues, handleItemUpdate }) => {
    return (
      <TableCell>
        <TextField
          color="secondary"
          size="small"
          style={{ width: "55px" }}
          id={`${item.itemNumber}`}
          placeholder="Qty"
          variant="outlined"
          value={currentItemValues[item.itemNumber] || ""}
          onChange={handleItemUpdate}
        />
      </TableCell>
    );
  }
);

const OrderItemTableView = (props) => {
  const {
    type,
    currentItems,
    handlePreview,
    currentProgram,
    handleAddItem,
  } = props;
  const classes = useStyles();

  //nounused vars (current program not needed yet until api integration)
  console.log(currentProgram);

  const [currentItemValues, updateCurrentItemValues] = useCallback(
    useState({})
  );

  const handleItemUpdate = useCallback(
    (evt) => {
      const numArray = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
      let itemValues = { ...currentItemValues };
      let total;
      if (
        numArray.includes(evt.target.value[evt.target.value.length - 1]) ||
        evt.target.value === ""
      ) {
        if (evt.target.value === "") {
          total = 0;
        } else total = parseInt(evt.target.value);
        itemValues[evt.target.id] = total;
        updateCurrentItemValues(itemValues);
      }
    },
    [currentItemValues, updateCurrentItemValues]
  );

  useEffect(() => {
    if (Object.keys(currentItemValues).length === 0) {
      let itemObj = {};
      currentItems.forEach((item) => {
        itemObj[item.itemNumber] = "";
      });
    }
  }, [currentItemValues, currentItems]);

  return (
    <>
      <TableContainer className={classes.tableContainer}>
        <Table className={classes.table} aria-label="in-stock-table">
          <TableHead>
            <TableRow>
              {/* <TableCell className={classes.headerText}></TableCell> */}
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
              {type !== "program" && (
                <TableCell className={classes.headerText} align="left">
                  Qty
                </TableCell>
              )}
              <TableCell
                className={classes.headerText}
                classes={{ root: classes.root }}
                align="center"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.map((row) => (
              <TableRow key={row.itemNumber} hover>
                {/* <TableCell component="th" scope="row">
                  <Tooltip title="Favorite">
                    <IconButton>
                      <StarBorderIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell> */}
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
                {type === "inStock" && <TableCell>{row.stock}</TableCell>}
                <TableCell>{row.price}</TableCell>
                {type !== "program" && (
                  <MemoInputCell
                    item={row}
                    currentItemValues={currentItemValues}
                    handleItemUpdate={handleItemUpdate}
                  />
                )}
                <TableCell align="right">
                  <div className={classes.tableButtonWrapper}>
                    <Button
                      variant="contained"
                      color="secondary"
                      id={`${row.itemNumber}`}
                      style={{ margin: "5px 2.5px" }}
                    >
                      <PictureAsPdfIcon className={classes.navIcon} />
                    </Button>

                    {type !== "program" && (
                      <Button
                        variant="contained"
                        color="secondary"
                        id={`${row.itemNumber}`}
                        style={{ margin: "5px 2.5px" }}
                        disabled={
                          currentItemValues[row.itemNumber] === "" ||
                          !currentItemValues[row.itemNumber]
                        }
                        value=""
                        onClick={(evt) => {
                          handleAddItem(
                            row,
                            parseInt(currentItemValues[row.itemNumber])
                          );
                          handleItemUpdate(evt);
                        }}
                      >
                        <AddBoxIcon className={classes.navIcon} />
                      </Button>
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
  currentProgram: PropTypes.object,
  handleAddItem: PropTypes.func.isRequired,
};

export default OrderItemTableView;
