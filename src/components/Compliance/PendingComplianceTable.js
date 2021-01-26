import React from "react";
import PropTypes from "prop-types";

import { useSelector, useDispatch } from "react-redux";

import { updateCompItemSelection } from "../../redux/slices/complianceItemsSlice";

import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

const headCells = [
  { id: "state", disablePadding: false, label: "State", sort: false },
  { id: "user", disablePadding: false, label: "Person", sort: false },
  {
    id: "distributorName",
    disablePadding: false,
    label: "Distributor",
    sort: false,
  },
  { id: "qty", disablePadding: false, label: "Total Items", sort: false },
  { id: "rule", disablePadding: false, label: "Rule", sort: false },
];

const EnhancedTableHead = (props) => {
  const { classes, rowCount, onSelectAllClick, numSelected } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            disabled={rowCount.length === 0}
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all items" }}
          />
        </TableCell>
        {headCells.map((headCell) => {
          return (
            <TableCell
              className={classes.headerText}
              key={headCell.id}
              align="left"
            >
              {headCell.label}
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
};

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
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
}));

const ComplianceItemsTable = ({ items, itemsLoading, tableRef }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const currentSelectedItems = useSelector(
    (state) => state.complianceItems.selectedItems
  );

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = items.map((item) => item.id);
      dispatch(updateCompItemSelection({ selectedItems: newSelecteds }));
      return;
    }
    dispatch(updateCompItemSelection({ selectedItems: [] }));
  };

  const handleClick = (_event, id) => {
    const selectedIndex = currentSelectedItems.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(currentSelectedItems, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(currentSelectedItems.slice(1));
    } else if (selectedIndex === currentSelectedItems.length - 1) {
      newSelected = newSelected.concat(currentSelectedItems.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        currentSelectedItems.slice(0, selectedIndex),
        currentSelectedItems.slice(selectedIndex + 1)
      );
    }

    dispatch(updateCompItemSelection({ selectedItems: newSelected }));
  };

  const isSelected = (id) => currentSelectedItems.indexOf(id) !== -1;

  return (
    <>
      <TableContainer
        className={classes.tableContainer}
        style={{ maxHeight: "Calc(100vh - 375px)" }}
      >
        <Table stickyHeader className={classes.table} ref={tableRef}>
          <EnhancedTableHead
            classes={classes}
            numSelected={currentSelectedItems.length}
            onSelectAllClick={handleSelectAllClick}
            rowCount={items.length}
          />
          <TableBody>
            {!itemsLoading && items.length === 0 && (
              <TableRow>
                <TableCell align="left" colSpan={11}>
                  <Typography className={classes.headerText}>
                    {`There are no order items that match the current search criteria..`}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!itemsLoading &&
              items.length > 0 &&
              items.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `compliance-Checkbox-${index}`;
                return (
                  <TableRow key={index} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{ "aria-labelledby": labelId }}
                        disabled={row.isComplianceCanceled}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => {
                          handleClick(event, row.id);
                          event.stopPropagation();
                        }}
                      />
                    </TableCell>
                    <TableCell align="left">{row.state}</TableCell>
                    <TableCell align="left">{row.user}</TableCell>
                    <TableCell align="left">{row.distributor}</TableCell>
                    <TableCell align="left">
                      {!row.isComplianceCanceled ? row.totalItems : "Canceled"}
                    </TableCell>
                    <TableCell align="left">
                      {row.triggeredRules.length > 0 && row.triggeredPriorApprovalRules.length > 0
                        ? row.triggerdRules.join(", ") + ", " +
                          row.triggeredPriorApprovalRules.join(", ")
                        : row.triggeredRules.length > 0
                        ? row.triggeredRules.join(", ")
                        : row.triggeredPriorApprovalRules.length > 0
                        ? row.triggeredPriorApprovalRules.join(", ")
                        : "---"}
                    </TableCell>
                  </TableRow>
                );
              })}
            {itemsLoading && (
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

ComplianceItemsTable.propTypes = {
  items: PropTypes.array,
  itemsLoading: PropTypes.bool.isRequired,
  tableRef: PropTypes.any,
};

export default ComplianceItemsTable;
