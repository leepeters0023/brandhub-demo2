import React from "react";
import PropTypes from "prop-types";

import { formatMoney } from "../../utility/utilityFunctions";

import { useDispatch, useSelector } from "react-redux";

import {
  setItemActCost,
  setItemPackOut,
} from "../../redux/slices/purchaseOrderSlice";

import { useMoneyInput } from "../../hooks/InputHooks";

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
import Checkbox from "@material-ui/core/Checkbox";

import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import CancelIcon from "@material-ui/icons/Cancel";
import AddCircleIcon from "@material-ui/icons/AddCircle";

const MoneyCell = ({ initialCost, id, role, span }) => {
  let currentFunc = role !== "supplier" ? setItemActCost : undefined;
  const { value: cost, bind: bindCost } = useMoneyInput(
    initialCost,
    currentFunc,
    id,
    true
  );
  return (
    <TableCell align="left" colSpan={span ? span : null}>
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

const POItemsTable = ({
  items,
  classes,
  handleDelete,
  handleSetUpFee,
}) => {
  const dispatch = useDispatch();
  const currentRole = useSelector((state) => state.user.role);

  const handlePackOut = (id, value) => {
    dispatch(setItemPackOut(id, value));
  };

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
            {currentRole !== "supplier" && (
              <TableCell className={classes.headerText} align="left">
                Est. Cost/Unit
              </TableCell>
            )}
            <TableCell className={classes.headerText} align="left">
              Act. Cost/Unit
            </TableCell>
            <TableCell className={classes.headerText} align="left">
              Total
            </TableCell>
            <TableCell className={classes.headerText} align="left">
              Pack Out
            </TableCell>
            {currentRole !== "supplier" && (
              <TableCell className={classes.headerText} align="right">
                Remove
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((row) => (
            <TableRow key={row.id}>
              <TableCell align="left">{row.itemNumber}</TableCell>
              {row.program !== "---" && row.program.length > 1 ? (
                <Tooltip placement="left" title={`${row.program.join(", ")}`}>
                  <TableCell
                    align="left"
                    style={{ display: "flex", alignItems: "flex-end" }}
                  >
                    {row.program[0]}
                    <MoreHorizIcon fontSize="small" color="inherit" />
                  </TableCell>
                </Tooltip>
              ) : (
                <TableCell align="left">
                  {row.program[0] || row.program}
                </TableCell>
              )}
              <TableCell align="left">{row.itemType}</TableCell>
              <TableCell align="left">{row.packSize}</TableCell>
              <TableCell align="left">{row.totalItems}</TableCell>
              {currentRole !== "supplier" && (
                <TableCell align="left">
                  {formatMoney(row.estCost, true)}
                </TableCell>
              )}
              {currentRole !== "supplier" ? (
                <MoneyCell
                  initialCost={formatMoney(row.actCost, true)}
                  id={row.id}
                  role={currentRole}
                />
              ) : (
                <TableCell align="left">
                  {formatMoney(row.actCost, true)}
                </TableCell>
              )}
              <TableCell align="left">
                {formatMoney(row.totalCost, true)}
              </TableCell>
              {currentRole !== "supplier" && (
                <TableCell padding="checkbox" align="center">
                  <Checkbox
                    checked={row.packOut}
                    onChange={() => handlePackOut(row.id, !row.packOut)}
                  />
                </TableCell>
              )}
              {currentRole === "supplier" && (
                <TableCell align="left">{row.packout ? "Yes" : "No"}</TableCell>
              )}
              {currentRole !== "supplier" && (
                <TableCell align="right">
                  <Tooltip title="Remove">
                    <IconButton
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDelete(row.id);
                      }}
                    >
                      <CancelIcon color="inherit" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              )}
            </TableRow>
          ))}
          {currentRole !== "supplier" && (
            <>
              <TableRow>
                <TableCell colSpan={2} className={classes.headerText}>
                  Set Up Fee:
                </TableCell>
                <TableCell colSpan={8} align="left">
                  <Tooltip title="Add Another Cost">
                    <IconButton
                      onClick={(event) => {
                        event.stopPropagation();
                        handleSetUpFee();
                      }}
                    >
                      <AddCircleIcon color="inherit" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            </>
          )}
          {currentRole === "supplier" && (
            <>
              <TableRow>
                <TableCell colSpan={6} className={classes.headerText}>
                  Total Freight Cost:
                </TableCell>
                <MoneyCell initialCost="$0.00" role={currentRole} span={2} />
              </TableRow>
              <TableRow>
                <TableCell colSpan={6} className={classes.headerText}>
                  Total Tax:
                </TableCell>
                <MoneyCell initialCost="$0.00" role={currentRole} span={2} />
              </TableRow>
            </>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

POItemsTable.propTypes = {
  items: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
  handleSetUpFee: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default React.memo(POItemsTable);
