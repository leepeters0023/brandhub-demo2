import React from "react";
import PropTypes from "prop-types";

import { formatMoney } from "../../utility/utilityFunctions";

import { useSelector, useDispatch } from "react-redux";

import {
  updateSelection,
  updateCurrentWarehouse,
  clearItemSelections,
} from "../../redux/slices/currentOrderSlice";

import ImageWrapper from "../Utility/ImageWrapper";

import Checkbox from "@material-ui/core/Checkbox";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

const headCells = [
  { id: "preview", label: "Preview" },
  { id: "itemNumber", label: "Sequence #" },
  { id: "brand", label: "Brand" },
  { id: "program", label: "Program" },
  { id: "itemType", label: "Item Type" },
  { id: "itemDescription", label: "Item Desc." },
  { id: "packSize", label: "Pack Size" },
  { id: "stock", label: "On Hand" },
  { id: "estCost", label: "Est. Cost" },
  { id: "addInv", label: "" },
];

const EnhancedTableHead = (props) => {
  const {
    classes,
    // rowCount,
    // onSelectAllClick,
    // numSelected,
    // orderLength,
    type,
    role,
  } = props;

  const currentHeadCells =
    type === "inStock"
      ? role === "purchaser" || role === "super" || role === "select-purchaser"
        ? headCells
        : headCells.filter((cell) => cell.id !== "addInv")
      : headCells.filter((cell) => cell.id !== "stock" && cell.id !== "addInv");

  return (
    <TableHead>
      <TableRow>
        {role !== "read-only" && (
          <TableCell padding="checkbox">
            {/* <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount - orderLength}
              onChange={onSelectAllClick}
              inputProps={{ "aria-label": "select all items" }}
            /> */}
          </TableCell>
        )}
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
  buttonText: {
    whiteSpace: "nowrap",
  },
}));

const OrderItemTableView = ({
  type,
  currentItems,
  handlePreview,
  handleAddInvOpen,
  setCurrentItemAdded,
  isItemsLoading,
  scrollRef,
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
  const currentWarehouse = useSelector(
    (state) => state.currentOrder.currentWarehouse
  );
  const inStockOrderItems = useSelector(
    (state) => state.currentOrder.inStockOrderItems
  );
  const currentUserRole = useSelector((state) => state.user.role);

  const handleSelectAllClick = (event) => {
    //todo update to handle warehouse and reimplement
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
    dispatch(updateCurrentWarehouse({ warehouse: null }));
  };

  const handleClick = (_event, id, warehouse) => {
    const selectedIndex = selectedItems.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedItems, id);
      if (
        !currentWarehouse &&
        type === "inStock" &&
        inStockOrderItems.length === 0
      ) {
        dispatch(updateCurrentWarehouse({ warehouse: warehouse }));
      }
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
    if (
      newSelected.length === 0 &&
      type === "inStock" &&
      inStockOrderItems.length === 0
    ) {
      dispatch(updateCurrentWarehouse({ warehouse: null }));
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
        style={{ maxHeight: "Calc(100vh - 275px)" }}
        ref={scrollRef}
      >
        <Table className={classes.table} aria-label="item-table" stickyHeader>
          <EnhancedTableHead
            classes={classes}
            numSelected={selectedItems.length}
            onSelectAllClick={handleSelectAllClick}
            rowCount={currentItems.length}
            orderLength={currentOrderItems.length}
            type={type}
            role={currentUserRole}
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
                const isItemSelected =
                  currentUserRole !== "read-only" ? isSelected(row.id) : null;
                const labelId = `item-Checkbox-${index}`;
                return (
                  <TableRow key={row.id} hover>
                    {currentUserRole !== "read-only" && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                          onClick={(event) => event.stopPropagation()}
                          disabled={
                            currentOrderItems.filter(
                              (item) => item.itemNumber === row.itemNumber
                            ).length !== 0 ||
                            (type === "inStock" &&
                              currentWarehouse &&
                              row.warehouse &&
                              row.warehouse !== currentWarehouse)
                          }
                          onChange={(event) => {
                            handleClick(event, row.id, row.warehouse);
                            event.stopPropagation();
                          }}
                        />
                      </TableCell>
                    )}
                    <TableCell align="left">
                      <ImageWrapper
                        id={row.id}
                        imgClass={classes.previewImageFloat}
                        alt={row.itemType}
                        imgUrl={row.imgUrlThumb}
                        handleClick={() => {
                          handlePreview(row.itemNumber);
                          setCurrentItemAdded(null);
                        }}
                      />
                    </TableCell>
                    <TableCell align="left">{row.itemNumber}</TableCell>
                    {row.brand.length > 1 ? (
                      <Tooltip
                        placement="left"
                        title={`${row.brand.join(", ")}`}
                      >
                        <TableCell align="left">
                          {row.brand[0]}
                          <MoreHorizIcon
                            fontSize="small"
                            color="inherit"
                            style={{ float: "right" }}
                          />
                        </TableCell>
                      </Tooltip>
                    ) : (
                      <TableCell align="left">{row.brand[0]}</TableCell>
                    )}
                    {row.program.length > 1 ? (
                      <Tooltip
                        placement="left"
                        title={`${row.program.join(", ")}`}
                      >
                        <TableCell align="left">
                          {row.program[0]}
                          <MoreHorizIcon
                            fontSize="small"
                            color="inherit"
                            style={{ float: "right" }}
                          />
                        </TableCell>
                      </Tooltip>
                    ) : (
                      <TableCell align="left">{row.program[0]}</TableCell>
                    )}
                    <TableCell align="left">{row.itemType}</TableCell>
                    <TableCell align="left">{row.itemDescription}</TableCell>
                    <TableCell align="left">{row.packSize}</TableCell>
                    {type === "inStock" && (
                      <TableCell align="left">
                        {row.stock ? row.stock : "---"}
                      </TableCell>
                    )}
                    <TableCell>{`${formatMoney(
                      row.estCost,
                      false
                    )}`}</TableCell>
                    {type === "inStock" &&
                      (currentUserRole === "purchaser" ||
                        currentUserRole === "select-purchaser" ||
                        currentUserRole === "super") && (
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            className={classes.largeButton}
                            color="secondary"
                            onClick={() => handleAddInvOpen(row.id)}
                            classes={{ label: classes.buttonText }}
                          >
                            ADD INV.
                          </Button>
                        </TableCell>
                      )}
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
  handleAddInvOpen: PropTypes.func,
  handleAddItem: PropTypes.func.isRequired,
  setCurrentItemAdded: PropTypes.func.isRequired,
};

export default React.memo(OrderItemTableView);
