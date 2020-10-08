import React from "react";
import PropTypes from "prop-types";

import { formatMoney } from "../../utility/utilityFunctions";

//import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
//import TextField from "@material-ui/core/TextField";
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
    justifyContent: "center",
  },
  root: {
    width: "150px !important",
    maxWidth: "150px !important",
    minWidth: "150px !important",
  },
}));

// const MemoInputField = React.memo(
//   ({ item, currentItemValues, handleItemUpdate }) => {
//     return (
//       <TextField
//         color="secondary"
//         size="small"
//         style={{ width: "55px" }}
//         id={`${item.id}`}
//         placeholder="Qty"
//         variant="outlined"
//         value={currentItemValues[item.id] || ""}
//         onChange={handleItemUpdate}
//       />
//     );
//   },
//   (prev, next) => {
//     return (
//       prev.item.id === next.item.id &&
//       prev.currentItemValues[`${prev.item.id}`] ===
//         next.currentItemValues[`${next.item.id}`]
//     );
//   }
// );

const OrderItemTableView = (props) => {
  const {
    type,
    currentItems,
    handlePreview,
    handleAddItem,
    setCurrentItemAdded,
  } = props;
  const classes = useStyles();
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
                Qty / Pack
              </TableCell>
              {(type === "inStock") && (
                <TableCell className={classes.headerText} align="left">
                  Stock
                </TableCell>
              )}
              <TableCell className={classes.headerText} align="left">
                Cost
              </TableCell>
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
              <TableRow key={row.id} hover>
                {/* <TableCell component="th" scope="row">
                  <Tooltip title="Favorite">
                    <IconButton>
                      <StarBorderIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell> */}
                <TableCell align="left">
                  <img
                    id={row.id}
                    className={classes.previewImageFloat}
                    src={row.imgUrl}
                    alt={row.itemType}
                    onClick={() => {
                      handlePreview(row.itemNumber);
                      setCurrentItemAdded(null);
                    }}
                  />
                </TableCell>
                <TableCell align="left">{`${row.brand} ${row.itemType}`}</TableCell>
                <TableCell align="left">{row.itemNumber}</TableCell>
                <TableCell align="left">{row.brand}</TableCell>
                <TableCell align="left">{row.qty}</TableCell>
                {(type === "inStock") && (
                  <TableCell>{row.stock}</TableCell>
                )}
                <TableCell>{`${formatMoney(row.price)}`}</TableCell>
                <TableCell align="center">
                  <div className={classes.tableButtonWrapper}>
                    <IconButton
                      id={`${row.id}`}
                      style={{ margin: "5px 2.5px" }}
                    >
                      <PictureAsPdfIcon />
                    </IconButton>

                    {type !== "program" && (
                      <IconButton
                        id={`${row.id}`}
                        style={{ margin: "5px 2.5px" }}
                        value=""
                        onClick={(evt) => {
                          handleAddItem(row);
                        }}
                      >
                        <AddBoxIcon />
                      </IconButton>
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
  handleAddItem: PropTypes.func.isRequired,
  setCurrentItemAdded: PropTypes.func.isRequired,
};

export default React.memo(OrderItemTableView);
