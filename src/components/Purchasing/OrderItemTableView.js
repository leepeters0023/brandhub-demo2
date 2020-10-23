import React from "react";
import PropTypes from "prop-types";

import { formatMoney } from "../../utility/utilityFunctions";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import AddBoxIcon from "@material-ui/icons/AddBox";
import CancelIcon from "@material-ui/icons/Cancel";
import ShareIcon from "@material-ui/icons/Share";

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
      <TableContainer
        className={classes.tableContainer}
        style={{ maxHeight: "Calc(100vh - 250px)" }}
      >
        <Table className={classes.table} aria-label="item-table" stickyHeader>
          <TableHead>
            <TableRow>
              {/* <TableCell className={classes.headerText}></TableCell> */}
              <TableCell className={classes.headerText} align="left">
                Preview
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Program
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Item Type
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
              {type === "inStock" && (
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
                <TableCell align="left">{row.brand}</TableCell>
                <TableCell align="left">{row.itemType}</TableCell>
                <TableCell align="left">{row.itemNumber}</TableCell>
                <TableCell align="left">{row.brand}</TableCell>
                <TableCell align="left">{row.packSize}</TableCell>
                {type === "inStock" && <TableCell>{row.stock}</TableCell>}
                <TableCell>{`${formatMoney(row.estCost)}`}</TableCell>
                <TableCell align="center">
                  <div className={classes.tableButtonWrapper}>
                    {type !== "new-program" && type !== "new-program-current" && (
                      <IconButton
                        id={`${row.id}`}
                        style={{ margin: "5px 2.5px" }}
                      >
                        <ShareIcon />
                      </IconButton>
                    )}

                    {type !== "program" && type !== "new-program-current" && (
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
                    {type === "new-program-current" && (
                      <>
                        <IconButton
                          id={`${row.id}`}
                          style={{ margin: "5px 2.5px" }}
                          onClick={() => {
                            handleAddItem(row, true);
                          }}
                        >
                          <CancelIcon />
                        </IconButton>
                      </>
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
