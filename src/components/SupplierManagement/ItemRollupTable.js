import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { navigate } from "@reach/router";

import { useDispatch } from "react-redux";

import { setSelectedRFQItem } from "../../redux/slices/rfqSlice";
import { setSelectedPOItems } from "../../redux/slices/purchaseOrderSlice";

import { formatMoney } from "../../utility/utilityFunctions";

import ConfirmDeleteRollupItem from "../Utility/ConfirmDeleteRollupItem";

import Checkbox from "@material-ui/core/Checkbox";
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TableCell from "@material-ui/core/TableCell";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import DeleteIcon from "@material-ui/icons/Delete";

const headCells = [
  { id: "sequenceNum", disablePadding: false, label: "Sequence #", sort: true },
  { id: "territory", disablePadding: false, label: "Territory", sort: false },
  { id: "brand", disablePadding: false, label: "Brand", sort: false },
  { id: "program", disablePadding: false, label: "Program", sort: true },
  { id: "projectNum", disablePadding: false, label: "Project #", sort: false },
  { id: "itemType", disablePadding: false, label: "Item Type", sort: true },
  { id: "itemDesc", disablePadding: false, label: "Item Desc.", sort: true },
  {
    id: "totalItems",
    disablePadding: false,
    label: "Total Ordered",
    sort: false,
  },
  {
    id: "totalNotCompliant",
    disablePadding: false,
    label: "Pending Compliance",
    sort: false,
  },
  { id: "estCost", disablePadding: false, label: "Est. Cost", sort: false },
  {
    id: "totalEstCost",
    disablePadding: false,
    label: "Est. Total",
    sort: false,
  },
  { id: "dueDate", disablePadding: false, label: "In-Market Date", sort: true },
  { id: "supplier", disablePadding: false, label: "Supplier", sort: false },
];

const EnhancedTableHead = (props) => {
  const {
    classes,
    rowCount,
    order,
    orderBy,
    onRequestSort,
    onSelectAllClick,
    numSelected,
    type,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const currentHeader =
    type === "po"
      ? headCells
      : headCells
          .filter((cell) => cell.id !== "supplier")
          .filter((cell) => cell.id !== "totalNotCompliant");

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          {type === "po" && (
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{ "aria-label": "select all items" }}
            />
          )}
        </TableCell>
        {currentHeader.map((headCell) => {
          if (!headCell.sort) {
            return (
              <TableCell
                className={classes.headerText}
                key={headCell.id}
                align="left"
              >
                {headCell.label}
              </TableCell>
            );
          } else {
            return (
              <TableCell
                className={classes.headerText}
                key={headCell.id}
                align="left"
                padding={headCell.disablePadding ? "none" : "default"}
                sortDirection={orderBy === headCell.id ? order : false}
              >
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : "asc"}
                  onClick={createSortHandler(headCell.id)}
                >
                  {headCell.label}
                  {orderBy === headCell.id ? (
                    <span className={classes.visuallyHidden}>
                      {order === "desc"
                        ? "sorted descending"
                        : "sorted ascending"}
                    </span>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            );
          }
        })}
        <TableCell align="right" />
      </TableRow>
    </TableHead>
  );
};

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  clickableCell: {
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "#737373",
      color: "white",
    },
  },
}));

const ItemRollupTable = ({
  items,
  handleSort,
  isItemsLoading,
  scrollRef,
  itemSelected,
  setItemSelected,
  type,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("sequenceNum");
  const [selected, setSelected] = useState([]);
  const [confirmOpen, setConfirmOpen] = useCallback(useState(false));
  const [currentId, setCurrentId] = useCallback(useState(null));

  const handleOpenConfirm = useCallback(
    (id) => {
      setCurrentId(id);
      setConfirmOpen(true);
    },
    [setConfirmOpen, setCurrentId]
  );

  const handleRemove = useCallback(
    (id) => {
      //TODO
      console.log(id);
      setConfirmOpen(false);
    },
    [setConfirmOpen]
  );

  const handleCloseConfirm = useCallback(() => {
    setConfirmOpen(false);
  }, [setConfirmOpen]);

  const handleRequestSort = (_event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    handleSort({ order: isAsc ? "desc" : "asc", orderBy: property });
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = items.map((item) => item.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (_event, id, itemId) => {
    const selectedIndex = selected.indexOf(`${id}-${itemId}`);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, `${id}-${itemId}`);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    if (type === "rfq") {
      if (newSelected.length === 0) {
        dispatch(setSelectedRFQItem({ itemId: null }));
      } else {
        dispatch(setSelectedRFQItem({ itemId: newSelected[0].split("-")[1] }));
      }
    }

    if (type === "po") {
      dispatch(setSelectedPOItems({ selectedItems: newSelected }));
    }

    setSelected(newSelected);
  };

  const isSelected = (id, itemId) => selected.indexOf(`${id}-${itemId}`) !== -1;

  const handleComplianceClick = (id, itemNumber) => {
    navigate(`/compliance/pending/${id}#${itemNumber}`);
  };

  useEffect(() => {
    if (selected.length > 0 && !itemSelected) {
      setItemSelected(true);
    }
  }, [selected, setItemSelected, itemSelected]);

  useEffect(() => {
    if (selected.length === 0 && itemSelected) {
      setItemSelected(false);
    }
  }, [selected, setItemSelected, itemSelected]);

  console.log(items);
  return (
    <>
      <ConfirmDeleteRollupItem
        open={confirmOpen}
        handleClose={handleCloseConfirm}
        handleRemove={handleRemove}
        itemId={currentId}
        type={type}
      />
      <TableContainer
        className={classes.tableContainer}
        style={{ maxHeight: "Calc(100vh - 375px)" }}
        ref={scrollRef}
      >
        <Table
          stickyHeader
          className={classes.table}
          style={{ minWidth: "1325px" }}
        >
          <EnhancedTableHead
            classes={classes}
            numSelected={selected.length}
            onRequestSort={handleRequestSort}
            onSelectAllClick={handleSelectAllClick}
            order={order}
            orderBy={orderBy}
            rowCount={items.length}
            type={type}
          />
          <TableBody>
            {!isItemsLoading && items.length === 0 && (
              <TableRow>
                <TableCell align="left" colSpan={11}>
                  <Typography className={classes.headerText}>
                    {`There are no items that match the current search criteria..`}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!isItemsLoading &&
              items.length > 0 &&
              items.map((row, index) => {
                const isItemSelected = isSelected(row.id, row.itemId);
                const labelId = `po-rollup-Checkbox-${index}`;

                return (
                  <TableRow key={index} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{ "aria-labelledby": labelId }}
                        onClick={(event) => event.stopPropagation()}
                        disabled={
                          type === "rfq" &&
                          selected.length >= 1 &&
                          selected[0] !== `${row.id}-${row.itemId}`
                        }
                        onChange={(event) => {
                          handleClick(event, row.id, row.itemId);
                          event.stopPropagation();
                        }}
                      />
                    </TableCell>
                    <TableCell align="left">{row.sequenceNum}</TableCell>
                    <TableCell align="left">{row.territory}</TableCell>
                    <TableCell align="left">{row.brand}</TableCell>
                    {row.programs.length > 1 && (
                      <Tooltip title={`${row.programs.join(", ")}`}>
                        <TableCell align="left">
                          {row.program && row.program !== "---"
                            ? row.program.name
                            : row.programs.length > 0
                            ? row.programs[0].name
                            : "---"}
                        </TableCell>
                      </Tooltip>
                    )}
                    {row.programs.length <= 1 && (
                      <TableCell align="left">
                        {row.program && row.program !== "---"
                          ? row.program.name
                          : row.programs.length > 0
                          ? row.programs[0].name
                          : "---"}
                      </TableCell>
                    )}
                    <TableCell align="left">{row.projectNum}</TableCell>
                    <TableCell align="left">{row.itemType}</TableCell>
                    <TableCell align="left">{row.itemDescription}</TableCell>
                    <TableCell align="left">{row.totalItems}</TableCell>
                    {type === "po" && (
                      <TableCell
                        align="left"
                        className={classes.clickableCell}
                        onClick={() => {
                          handleComplianceClick(row.id, row.sequenceNum);
                        }}
                      >
                        {row.totalNotCompliant}
                      </TableCell>
                    )}
                    <TableCell align="left">
                      {formatMoney(row.estCost, true)}
                    </TableCell>
                    <TableCell align="left">
                      {formatMoney(row.totalEstCost, true)}
                    </TableCell>
                    <TableCell align="left">{row.dueDate}</TableCell>
                    {type === "po" && (
                      <TableCell align="left">{row.supplier}</TableCell>
                    )}
                    <TableCell align="right" padding="checkbox">
                      <Tooltip
                        title={`Delete ${
                          type === "po" ? "Purchase Order Item" : "RFQ Item"
                        }`}
                      >
                        <IconButton onClick={() => handleOpenConfirm(row.id)}>
                          <DeleteIcon color="inherit" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            {isItemsLoading && (
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

ItemRollupTable.propTypes = {
  items: PropTypes.array,
  handleSort: PropTypes.func.isRequired,
  isItemsLoading: PropTypes.bool.isRequired,
  scrollRef: PropTypes.any,
  itemSelected: PropTypes.bool.isRequired,
  setItemSelected: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default ItemRollupTable;
