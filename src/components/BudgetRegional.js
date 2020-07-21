import React from "react";

import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Chip from "@material-ui/core/Chip";
import { makeStyles } from "@material-ui/core/styles";

import CachedIcon from "@material-ui/icons/Cached";
import GetAppIcon from "@material-ui/icons/GetApp";

// simulate data for mock
const createData = (date, unit, region, status) => {
  let money = randomMoney();
  return {
    date,
    unit,
    region,
    budget: money[0],
    spend: money[1],
    balance: money[2],
    status,
  };
};

const randomMoney = () => {
  let budget = (Math.random() * 100000).toFixed(2);
  let spend = (Math.random() * budget).toFixed(2);
  let balance = (budget - spend).toFixed(2);
  return [budget, spend, balance];
};

let date = new Date();
let dateString = date.toLocaleDateString();

let budget = [
  createData(dateString, "Lorem 2020", "Select", "Approved"),
  createData(dateString, "Lorem 2020", "Select", "Approved"),
  createData(dateString, "Lorem 2020", "Select", "Approved"),
  createData(dateString, "Lorem 2020", "Select", "Active"),
  createData(dateString, "Lorem 2020", "Select", "Active"),
  createData(dateString, "Lorem 2020", "Select", "Active"),
  createData(dateString, "Lorem 2020", "Select", "Active"),
  createData(dateString, "Lorem 2020", "Select", "Active"),
  createData(dateString, "Lorem 2020", "Select", "Active"),
  createData(dateString, "Lorem 2020", "Select", "Pending"),
  createData(dateString, "Lorem 2020", "Select", "Pending"),
  createData(dateString, "Lorem 2020", "Select", "Pending"),
  createData(dateString, "Lorem 2020", "Select", "Pending"),
  createData(dateString, "Lorem 2020", "Select", "Canceled"),
  createData(dateString, "Lorem 2020", "Select", "Canceled"),
  createData(dateString, "Lorem 2020", "Select", "Canceled"),
]

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const BudgetRegional = () => {

  const classes = useStyles();
  return (
    <>
      <Container className={classes.tabContainer}>
        <TableContainer className={classes.tableContainer}>
          <br />
          <div className={classes.titleBar}>
            <Typography className={classes.titleText} variant="h5">
              Monthly Pre-Order
            </Typography>
            <div className={classes.configButtons}>
              <Tooltip title="Refresh">
                <IconButton>
                  <CachedIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Download">
                <IconButton>
                  <GetAppIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>
          <br />
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.headerText}>Date</TableCell>
                <TableCell className={classes.headerText} align="left">
                  Buisiness Unit
                </TableCell>
                <TableCell className={classes.headerText} align="left">
                  Region
                </TableCell>
                <TableCell className={classes.headerText} align="left">
                  Budget
                </TableCell>
                <TableCell className={classes.headerText} align="left">
                  Spend
                </TableCell><TableCell className={classes.headerText} align="left">
                  Balance
                </TableCell>
                <TableCell
                  className={classes.headerText}
                  align="center"
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {budget.map((row) => (
                <TableRow key={row.budget}>
                  <TableCell component="th" scope="row">
                    {row.date}
                  </TableCell>
                  <TableCell align="left">{row.unit}</TableCell>
                  <TableCell align="left">{row.region}</TableCell>
                  <TableCell align="left">{row.budget}</TableCell>
                  <TableCell align="left">{row.spend}</TableCell>
                  <TableCell align="left">{row.balance}</TableCell>
                  <TableCell align="center">
                    {row.status === "Approved" && <Chip className={classes.chipApproved} label={row.status} />}
                    {row.status === "Active" && <Chip className={classes.chipActive} label={row.status} />}
                    {row.status === "Pending" && <Chip className={classes.chipPending} label={row.status} />}
                    {row.status === "Canceled" && <Chip className={classes.chipCanceled} label={row.status} />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
};

export default BudgetRegional;
