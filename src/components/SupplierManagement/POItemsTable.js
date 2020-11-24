import React from "react";
import PropTypes from "prop-types";

import { formatMoney } from "../../utility/utilityFunctions";

import { useDispatch } from "react-redux";

import { updateCost } from "../../redux/slices/purchaseOrderSlice";

import { useMoneyInput, useNumberOnlyInput } from "../../hooks/InputHooks";

import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

import CancelIcon from "@material-ui/icons/Cancel";
import AddCircleIcon from "@material-ui/icons/AddCircle";

const MoneyCell = ({ initialCost }) => {
  const { value: cost, bind: bindCost } = useMoneyInput(initialCost);
  //TODO, write update function and pass to useMoneyInput
  return (
    <TableCell align="left">
      <TextField
        value={cost}
        variant="outlined"
        size="small"
        fullWidth
        {...bindCost}
      />
    </TableCell>
  );
};

const PackSizeCell = ({ initialPackSize }) => {
  const { value: packSize, bind: bindPackSize } = useNumberOnlyInput(initialPackSize);
  //TODO, handle calls on blur when available
  return (
    <TableCell align="left">
      <TextField
        value={packSize}
        variant="outlined"
        size="small"
        fullWidth
        {...bindPackSize}
      />
    </TableCell>
  )
}

const POItemsTable = ({ items, classes, addNewCost, additionalCosts }) => {
  const dispatch = useDispatch();
  return (
    <TableContainer
      className={classes.tableContainer}
      style={{ width: "75%", minWidth: "1000px" }}
    >
      <Typography className={classes.titleText} style={{ marginLeft: "20px" }}>
        Purchase Order Items:
      </Typography>
      <br />
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell className={classes.headerText} align="left">
              Sequence #
            </TableCell>
            <TableCell className={classes.headerText} align="left">
              Program
            </TableCell>
            <TableCell className={classes.headerText} align="left">
              Item Type
            </TableCell>
            <TableCell className={classes.headerText} align="left">
              Pack Size
            </TableCell>
            <TableCell className={classes.headerText} align="left">
              Qty Ordered
            </TableCell>
            <TableCell className={classes.headerText} align="left">
              Est. Cost/Unit
            </TableCell>
            <TableCell className={classes.headerText} align="left">
              Act. Cost/Unit
            </TableCell>
            <TableCell className={classes.headerText} align="left">
              Total
            </TableCell>
            <TableCell className={classes.headerText} align="right">
              Remove
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((row) => (
            <TableRow key={row.id}>
              <TableCell align="left">{row.sequenceNum}</TableCell>
              <TableCell align="left">{row.program}</TableCell>
              <TableCell align="left">{row.itemType}</TableCell>
              <PackSizeCell initialPackSize={row.packSize} />
              <TableCell align="left">{row.totalItems}</TableCell>
              <TableCell align="left">{formatMoney(row.estCost)}</TableCell>
              <MoneyCell initialCost={formatMoney(row.estCost)} />
              <TableCell align="left">
                {formatMoney(row.totalCost)}
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Remove">
                  <IconButton
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                  >
                    <CancelIcon color="inherit" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell className={classes.headerText}>Set Up Fee:</TableCell>
            <TableCell colSpan={7} align="left">
              <Tooltip title="Add Another Cost">
                <IconButton
                  onClick={(event) => {
                    event.stopPropagation();
                    addNewCost();
                  }}
                >
                  <AddCircleIcon color="inherit" />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
          {additionalCosts.map((cost, index) => (
            <TableRow key={index}>
              <TableCell className={classes.headerText}>Description:</TableCell>
              <TableCell colSpan={4}>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={cost.description}
                  onChange={(evt) => {
                    dispatch(
                      updateCost({
                        key: "description",
                        value: evt.target.value,
                        index: index,
                      })
                    );
                  }}
                />
              </TableCell>
              <TableCell className={classes.headerText} align="right">
                Cost:
              </TableCell>
              <TableCell colSpan={2}>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={cost.cost}
                  onChange={(evt) => {
                    dispatch(
                      updateCost({
                        key: "cost",
                        value: evt.target.value,
                        index: index,
                      })
                    );
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

POItemsTable.propTypes = {
  items: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
  addNewCost: PropTypes.func.isRequired,
  additionalCosts: PropTypes.array,
};

export default React.memo(POItemsTable);
