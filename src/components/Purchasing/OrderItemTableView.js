import React from "react";
import PropTypes from "prop-types";

import { formatMoney } from "../../utility/utilityFunctions";

import { useSelector, useDispatch } from "react-redux";

import {
  updateSelection,
  clearItemSelections,
} from "../../redux/slices/currentOrderSlice";

import Checkbox from "@material-ui/core/Checkbox";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

import CancelIcon from "@material-ui/icons/Cancel";
import ShareIcon from "@material-ui/icons/Share";

const headCells = [
  { id: "preview", label: "Preview" },
  { id: "program", label: "Program" },
  { id: "itemType", label: "Item Type" },
  { id: "sequenceNum", label: "Sequence #" },
  { id: "brand", label: "Brand" },
  { id: "packSize", label: "Pack Size" },
  { id: "stock", label: "On Hand" },
  { id: "estCost", label: "Est. Cost" },
  { id: "action", label: "" },
];

const EnhancedTableHead = (props) => {
  const { classes, rowCount, onSelectAllClick, numSelected, type } = props;

  const currentHeader =
    type !== "inStock"
      ? headCells.filter((cell) => cell.id !== "stock")
      : headCells;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all items" }}
          />
        </TableCell>
        {currentHeader.map((headCell) => (
          <TableCell
            className={classes.headerText}
            key={headCell.id}
            align="left"
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  rowCount: PropTypes.number.isRequired,
  type: PropTypes.string,
};

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
    isItemsLoading,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const formattedType = `selected${type[0].toUpperCase() + type.slice(1)}Items`;

  const selectedItems = useSelector(
    (state) => state.currentOrder[formattedType]
  );
  console.log(selectedItems);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = currentItems.map((item) => item.id);
      dispatch(
        updateSelection({ type: formattedType, selectedItems: newSelecteds })
      );
      return;
    }
    dispatch(clearItemSelections());
  };

  const handleClick = (_event, id) => {
    const selectedIndex = selectedItems.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedItems, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedItems.slice(1));
    } else if (selectedIndex === selectedItems.length - 1) {
      newSelected = newSelected.concat(selectedItems.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedItems.slice(0, selectedIndex),
        selectedItems.slice(selectedIndex + 1)
      );
    }

    dispatch(
      updateSelection({ type: formattedType, selectedItems: newSelected })
    );
  };

  const isSelected = (id) => selectedItems.indexOf(id) !== -1;

  return (
    <>
      <TableContainer
        className={classes.tableContainer}
        style={{ maxHeight: "Calc(100vh - 250px)" }}
      >
        <Table className={classes.table} aria-label="item-table" stickyHeader>
          <EnhancedTableHead
            classes={classes}
            numSelected={selectedItems.length}
            onSelectAllClick={handleSelectAllClick}
            rowCount={currentItems.length}
            type={type}
          />
          <TableBody>
            {!isItemsLoading && currentItems.length === 0 && (
              <TableRow>
                <TableCell align="left" colSpan={type === "inStock" ? 10 : 9}>
                  <Typography className={classes.headerText}>
                    {`There are no items that match the current search criteria..`}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!isItemsLoading &&
              currentItems.length > 0 &&
              currentItems.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `item-Checkbox-${index}`;
                return (
                  <TableRow key={row.id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{ "aria-labelledby": labelId }}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => {
                          handleClick(event, row.id);
                          event.stopPropagation();
                        }}
                      />
                    </TableCell>
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
                      {type !== "new-program" &&
                        type !== "new-program-current" && (
                          <IconButton
                            id={`${row.id}`}
                            style={{ margin: "5px 2.5px" }}
                          >
                            <ShareIcon />
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
                    </TableCell>
                  </TableRow>
                );
              })}
              {isItemsLoading && (
              <TableRow>
                <TableCell align="left" colSpan={type === "inStock" ? 10 : 9}>
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

OrderItemTableView.propTypes = {
  type: PropTypes.string.isRequired,
  currentItems: PropTypes.array.isRequired,
  handlePreview: PropTypes.func.isRequired,
  handleAddItem: PropTypes.func.isRequired,
  setCurrentItemAdded: PropTypes.func.isRequired,
};

export default React.memo(OrderItemTableView);
