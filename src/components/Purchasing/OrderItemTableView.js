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
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

const headCells = [
  { id: "preview", label: "Preview" },
  { id: "program", label: "Program" },
  { id: "itemType", label: "Item Type" },
  { id: "sequenceNum", label: "Sequence #" },
  { id: "brand", label: "Brand" },
  { id: "packSize", label: "Pack Size" },
  { id: "stock", label: "On Hand" },
  { id: "estCost", label: "Est. Cost" },
];

const EnhancedTableHead = (props) => {
  const {
    classes,
    rowCount,
    onSelectAllClick,
    numSelected,
    orderLength,
    type,
  } = props;

  const currentHeadCells =
    type === "inStock"
      ? headCells
      : headCells.filter((cell) => cell.id !== "stock");

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount - orderLength}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all items" }}
          />
        </TableCell>
        {currentHeadCells.map((headCell) => (
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
  orderLength: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const OrderItemTableView = ({
  type,
  currentItems,
  handlePreview,
  setCurrentItemAdded,
  isItemsLoading,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const formattedType = `selected${type[0].toUpperCase() + type.slice(1)}Items`;

  const selectedItems = useSelector(
    (state) => state.currentOrder[formattedType]
  );
  const currentOrderItems = useSelector(
    (state) => state.currentOrder[`${type}OrderItems`]
  );

  const handleSelectAllClick = (event) => {
    console.log(event.target.checked);
    if (event.target.checked) {
      const newSelecteds = [];
      currentItems.forEach((item) => {
        if (
          currentOrderItems.filter(
            (orderItem) => item.itemNumber === orderItem.itemNumber
          ).length === 0
        ) {
          newSelecteds.push(item.id);
        }
      });
      //const newSelecteds = currentItems.map((item) => item.id);
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
            orderLength={currentOrderItems.length}
            type={type}
          />
          <TableBody>
            {!isItemsLoading && currentItems.length === 0 && (
              <TableRow>
                <TableCell align="left" colSpan={8}>
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
                        disabled={
                          currentOrderItems.filter(
                            (item) => item.itemNumber === row.itemNumber
                          ).length !== 0
                        }
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
                    {type === "inStock" && (
                      <TableCell align="left">
                        {row.stock ? row.stock : "---"}
                      </TableCell>
                    )}
                    <TableCell>{`${formatMoney(row.estCost)}`}</TableCell>
                  </TableRow>
                );
              })}
            {isItemsLoading && (
              <TableRow>
                <TableCell align="left" colSpan={8}>
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
