import React from "react";
import PropTypes from "prop-types";

import { formatMoney } from "../../utility/utilityFunctions";

import { useSelector, useDispatch } from "react-redux";

import {
  updateItemSelection,
  clearItemSelection,
} from "../../redux/slices/itemSlice";

import ImageWrapper from "../Utility/ImageWrapper";

import Checkbox from "@material-ui/core/Checkbox";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import AddCircleIcon from "@material-ui/icons/AddCircle";

const headCells = [
  { id: "preview", label: "Preview" },
  { id: "itemNumber", label: "Sequence #" },
  { id: "program", label: "Program" },
  { id: "itemType", label: "Item Type" },
  { id: "itemDescription", label: "Item Desc." },
  { id: "brand", label: "Brand" },
  { id: "packSize", label: "Pack Size" },
  { id: "stock", label: "On Hand" },
  { id: "estCost", label: "Est. Cost" },
  { id: "addItem", label: "Add" },
];

const EnhancedTableHead = (props) => {
  const {
    classes,
    rowCount,
    onSelectAllClick,
    numSelected,
    type,
    forProgram,
    role,
  } = props;

  const currentHeadCells =
    type === "in-stock"
      ? headCells.filter((cell) => cell.id !== "addItem")
      : !forProgram
      ? headCells.filter((cell) => cell.id !== "stock" && cell.id !== "addItem")
      : role !== "read-only"
      ? headCells.filter((cell) => cell.id !== "stock")
      : headCells.filter(
          (cell) => cell.id !== "stock" && cell.id !== "addItem"
        );

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
};

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const ItemCatalogTable = ({
  currentItems,
  handlePreview,
  isItemsLoading,
  catalogType,
  scrollRef,
  addPreOrderItem,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const selectedItems = useSelector((state) => state.items.selectedItems);
  const preOrderItems = useSelector(
    (state) => state.programs.currentPreOrderItems
  );
  const isPreOrderLoading = useSelector((state) => state.orderSet.isLoading);
  const patchLoading = useSelector((state) => state.patchOrder.isLoading);
  const currentUserRole = useSelector((state) => state.user.role);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = currentItems.map((item) => item.id);
      dispatch(updateItemSelection({ selectedItems: newSelecteds }));
      return;
    }
    dispatch(clearItemSelection({ selectedItems: [] }));
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

    dispatch(updateItemSelection({ selectedItems: newSelected }));
  };

  const isSelected = (id) => selectedItems.indexOf(id) !== -1;

  return (
    <>
      <TableContainer
        className={classes.tableContainer}
        style={{ maxHeight: "Calc(100vh - 250px)" }}
        ref={scrollRef}
      >
        <Table className={classes.table} aria-label="item-catalog" stickyHeader>
          <EnhancedTableHead
            classes={classes}
            numSelected={selectedItems.length}
            onSelectAllClick={handleSelectAllClick}
            rowCount={currentItems.length}
            type={catalogType}
            forProgram={addPreOrderItem ? true : false}
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
              !isPreOrderLoading &&
              currentItems.length > 0 &&
              currentItems.map((item, index) => {
                const isItemSelected = isSelected(item.id);
                const labelId = `item-Checkbox-${index}`;
                return (
                  <TableRow key={item.id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{ "aria-labelledby": labelId }}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => {
                          handleClick(event, item.id);
                          event.stopPropagation();
                        }}
                      />
                    </TableCell>
                    <TableCell align="left">
                      <ImageWrapper
                        id={item.itemNumber}
                        imgClass={classes.previewImageFloat}
                        alt={item.itemType}
                        imgUrl={item.imgUrlThumb}
                        handleClick={() => handlePreview(item.itemNumber)}
                      />
                    </TableCell>
                    <TableCell align="left">{item.itemNumber}</TableCell>
                    <TableCell align="left">{item.program}</TableCell>
                    <TableCell align="left">{item.itemType}</TableCell>
                    <TableCell align="left">{item.itemDescription}</TableCell>
                    <TableCell align="left">{item.brand}</TableCell>
                    <TableCell align="left">{item.packSize}</TableCell>
                    {catalogType === "in-stock" && (
                      <TableCell align="left">
                        {item.stock ? item.stock : "---"}
                      </TableCell>
                    )}
                    <TableCell>{`${formatMoney(
                      item.estCost,
                      false
                    )}`}</TableCell>
                    {!patchLoading &&
                      addPreOrderItem &&
                      currentUserRole !== "read-only" && (
                        <TableCell padding="checkbox" align="center">
                          <Tooltip title="Add to Pre Order">
                            <span>
                              <IconButton
                                onClick={() => addPreOrderItem(item.id)}
                                disabled={
                                  isPreOrderLoading ||
                                  preOrderItems.filter((i) => i === item.id)
                                    .length > 0
                                }
                              >
                                <AddCircleIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </TableCell>
                      )}
                    {patchLoading && addPreOrderItem && (
                      <TableCell padding="checkbox" align="center">
                        <CircularProgress size={25} />
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            {(isItemsLoading || isPreOrderLoading) && (
              <TableRow>
                <TableCell align="left" colSpan={9}>
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

ItemCatalogTable.propTypes = {
  currentItems: PropTypes.array,
  handlePreview: PropTypes.func.isRequired,
  isItemsLoading: PropTypes.bool.isRequired,
};

export default ItemCatalogTable;
