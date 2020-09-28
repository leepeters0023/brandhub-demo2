import React, { useState, useEffect } from "react";

import { useSelector } from "react-redux";

import { formatMoney } from "../../utility/utilityFunctions";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const PreOrderSummary = () => {
  const classes = useStyles();
  const [currentSummary, setCurrentSummary] = useState(null);
  const [currentOrderId, setCurrentOrderId] = useState(null);

  const programs = useSelector((state) => state.programs.programs);
  const preOrders = useSelector((state) => state.preOrderDetails.preOrderSummary);
  const currentOrder = useSelector((state) => state.orderSet);
  const summaryLoading = useSelector((state) => state.preOrderDetails.preOrderSummaryLoading);

  useEffect(() => {
    if (
      (!currentSummary && preOrders.length > 0 && !summaryLoading) ||
      (preOrders.length > 0 && currentOrder.orderId !== currentOrderId && !summaryLoading)
    ) {
      let summary = preOrders.map((preOrder) => {
        if (
          programs.filter((prog) => prog.id === preOrder.programId).length > 0
        ) {
          let currentProgram = programs.find(
            (prog) => prog.id === preOrder.programId
          );
          return {
            name: `${currentProgram.name} - ${currentProgram.focusMonth}`,
            ...preOrder,
          };
        } else return null;
      });
      summary = summary.filter((order) => order);
      summary.sort((a, b) => {
        return a.name[0].toLowerCase()[0] < b.name[0].toLowerCase()[0]
          ? -1
          : a.name[0].toLowerCase()[0] > b.name[0].toLowerCase()[0]
          ? 1
          : 0;
      });
      setCurrentOrderId(currentOrder.orderId);
      setCurrentSummary(summary);
    }
  }, [
    currentSummary,
    preOrders,
    programs,
    programs.length,
    preOrders.length,
    currentOrder.orderId,
    currentOrderId,
    summaryLoading,
  ]);

  const statusConverter = (status) => {
    if (status === "inactive") {
      return "Not Started";
    } else if (status === "in-progress") {
      return "In Progress";
    } else if (status === "submitted") {
      return "Order Submitted";
    } else {
      return "Error";
    }
  };

  if (currentOrder.preOrderSummaryLoading) {
    return <CircularProgress />;
  }

  return (
    <>
      <TableContainer className={classes.tableContainer}>
        <Table className={classes.table} aria-label="pre-order-summary">
          <TableHead>
            <TableRow>
              <TableCell className={classes.headerText} align="left">
                Pre-Order Program
              </TableCell>
              <TableCell className={classes.headerText} align="center">
                Status
              </TableCell>
              <TableCell className={classes.headerText} align="center">
                Total Items
              </TableCell>
              <TableCell className={classes.headerText} align="center">
                Total Est Cost
              </TableCell>
              <TableCell className={classes.headerText} align="right">
                Remaining Budget
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentSummary &&
              currentSummary.map((preOrder) => {
                if (preOrder) {
                  return (
                    <TableRow key={preOrder.preOrderId}>
                      <TableCell align="left">{preOrder.name}</TableCell>
                      <TableCell align="center">
                        {preOrder.preOrderId !== currentOrder.orderId
                          ? statusConverter(preOrder.status)
                          : statusConverter(currentOrder.status)}
                      </TableCell>
                      <TableCell align="center">
                        {preOrder.preOrderId !== currentOrder.orderId
                          ? preOrder.totalItems
                          : currentOrder.items
                              .map((item) => item.totalItems)
                              .reduce((a, b) => a + b)}
                      </TableCell>
                      <TableCell align="center">
                        {preOrder.preOrderId !== currentOrder.orderId
                          ? formatMoney(preOrder.totalEstCost)
                          : formatMoney(currentOrder.orderTotal)}
                      </TableCell>
                      <TableCell align="right">
                        {formatMoney(
                          Math.floor(Math.random() * 1000000 + 1000000)
                        )}
                      </TableCell>
                    </TableRow>
                  );
                } else return null;
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default PreOrderSummary;
