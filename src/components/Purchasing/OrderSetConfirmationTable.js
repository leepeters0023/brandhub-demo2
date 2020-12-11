import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import format from "date-fns/format";
import addDays from "date-fns/addDays";

import { formatMoney } from "../../utility/utilityFunctions";

import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";

import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
}));

const CollapseRow = ({ classes, rowData, orders, type }) => {
  const [open, setOpen] = useCallback(useState(false));

  return (
    <>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="left">{rowData.itemNumber}</TableCell>
        <TableCell align="left">{rowData.brand}</TableCell>
        <TableCell align="left">{rowData.itemType}</TableCell>
        <TableCell align="left">
          {formatMoney(rowData.estCost, false)}
        </TableCell>
        <TableCell align="left">{rowData.totalItems}</TableCell>
        <TableCell align="left">
          {formatMoney(rowData.totalEstCost, false)}
        </TableCell>
        {type !== "pre-order" && (
          <>
            <TableCell align="left">
              {format(addDays(new Date(), 28), "MM/dd/yyyy")}
            </TableCell>
            <TableCell align="left">
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  fullWidth
                  color="secondary"
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id={`${rowData.id}-req-date`}
                  label=""
                  value={format(addDays(new Date(), 28), "MM/dd/yyyy")}
                  //onChange={(value) => handle this function!}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </MuiPickersUtilsProvider>
            </TableCell>
            <TableCell padding="checkbox">
              <Checkbox />
            </TableCell>
          </>
        )}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1} style={{ overFlowX: "scroll" }}>
              <Typography
                className={classes.headerText}
                gutterBottom
                component="div"
              >
                Item Allocations
              </Typography>
              <TableContainer>
                <Table size="small" aria-label="item-details">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">
                        <Typography className={classes.bodyText}>
                          Order #
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography className={classes.bodyText}>
                          Distributor ID
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography className={classes.bodyText}>
                          Distributor Name
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography className={classes.bodyText}>
                          Total Allocated
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((order) => {
                      if (
                        order.items.find(
                          (item) => item.itemNumber === rowData.itemNumber
                        ).totalItems > 0
                      ) {
                        return (
                          <TableRow key={`${rowData.id}-${order.id}`}>
                            <TableCell align="center">{order.id}</TableCell>
                            <TableCell align="center">
                              {order.distributorId}
                            </TableCell>
                            <TableCell align="center">
                              {order.distributorName}
                            </TableCell>
                            <TableCell align="center">
                              {
                                order.items.find(
                                  (item) =>
                                    item.itemNumber === rowData.itemNumber
                                ).totalItems
                              }
                            </TableCell>
                          </TableRow>
                        );
                      } else return null;
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const OrderSetConfirmationTable = ({ orders, items, type }) => {
  const classes = useStyles();

  return (
    <>
      <TableContainer
        className={classes.tableContainer}
        style={{ maxHeight: "Calc(100vh - 300px)" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
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
                Est. Cost
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Total Items
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Est. Total
              </TableCell>
              {type !== "pre-order" && (
                <>
                  <TableCell className={classes.headerText} align="left">
                    Std. Delivery
                  </TableCell>
                  <TableCell className={classes.headerText} align="left">
                    Req. Delivery
                  </TableCell>
                  <TableCell className={classes.headerText} align="left">
                    Rush
                  </TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => {
              if (item.totalItems > 0) {
                return (
                  <CollapseRow
                    key={item.id}
                    classes={classes}
                    rowData={item}
                    orders={orders}
                    type={type}
                  />
                );
              } else return null;
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

OrderSetConfirmationTable.propTypes = {
  orders: PropTypes.array,
  items: PropTypes.array,
};

export default OrderSetConfirmationTable;
