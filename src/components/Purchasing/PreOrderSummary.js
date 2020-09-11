import React, {useState, useEffect} from 'react'

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

  const programs = useSelector((state) => state.programs.programs);
  const preOrders = useSelector((state) => state.programTable.preOrderSummary);
  const currentOrder = useSelector((state) => state.programTable);

  useEffect(()=>{
    if (!currentSummary && preOrders.length > 0) {
      let summary = preOrders.map((preOrder) => {
        if (programs.filter((prog) => prog.id === preOrder.programId).length > 0) {
          let currentProgram = programs.find((prog) => prog.id === preOrder.programId)
          return ({
            name: `${currentProgram.name} - ${currentProgram.focusMonth}`,
            ...preOrder,
          })
        } else return null
      })
      console.log(summary)
      setCurrentSummary(summary);
    }
  }, [currentSummary, preOrders, programs, programs.length, preOrders.length])

  if (currentOrder.preOrderSummaryLoading) {
    return <CircularProgress />
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
              <TableCell className={classes.headerText} align="left">
                Status
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Total Items
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Total Est Cost
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentSummary && currentSummary.map((preOrder) => (
              <TableRow key={preOrder.preOrderId}>
                <TableCell align="left">
                  {preOrder.name}
                </TableCell>
                <TableCell align="left">
                  {preOrder.preOrderId !== currentOrder.preOrderId ? preOrder.status : currentOrder.status}
                </TableCell>
                <TableCell align="left">
                  {preOrder.preOrderId !== currentOrder.preOrderId ? preOrder.totalItems : currentOrder.items.map(item => item.totalItems).reduce((a, b) => a + b)}
                </TableCell>
                <TableCell align="left">
                  {preOrder.preOrderId !== currentOrder.preOrderId ? formatMoney(preOrder.totalEstCost) : formatMoney(currentOrder.programTotal)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default PreOrderSummary;
