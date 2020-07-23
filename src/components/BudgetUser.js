import React from "react";

import MaterialTable from "material-table";

import { tableIcons } from "../utility/tableIcons";

import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";

import CachedIcon from "@material-ui/icons/Cached";
import GetAppIcon from "@material-ui/icons/GetApp";

// simulate data for mock
const createData = (date, user, unit, region) => {
  let money = randomMoney();
  return {
    date,
    user,
    unit,
    region,
    spend: money[1],
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
  createData(dateString, "Jeremy Kent", "Lorem 2020", "Select"),
  createData(dateString, "Jeremy Kent", "Lorem 2020", "Select"),
  createData(dateString, "Jeremy Kent", "Lorem 2020", "Select"),
  createData(dateString, "Jeremy Kent", "Lorem 2020", "Select"),
  createData(dateString, "Jeremy Kent", "Lorem 2020", "Select"),
  createData(dateString, "Jeremy Kent", "Lorem 2020", "Select"),
  createData(dateString, "Jeremy Kent", "Lorem 2020", "Select"),
  createData(dateString, "Josh Downs", "Lorem 2020", "Select"),
  createData(dateString, "Josh Downs", "Lorem 2020", "Select"),
  createData(dateString, "Josh Downs", "Lorem 2020", "Select"),
  createData(dateString, "Josh Downs", "Lorem 2020", "Select"),
  createData(dateString, "Josh Downs", "Lorem 2020", "Select"),
  createData(dateString, "Michelle Brandon", "Lorem 2020", "Select"),
  createData(dateString, "Michelle Brandon", "Lorem 2020", "Select"),
  createData(dateString, "Michelle Brandon", "Lorem 2020", "Select"),
  createData(dateString, "Michelle Brandon", "Lorem 2020", "Select"),
];

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  configButtons: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-end",
  },
}));

const BudgetUser = () => {
  const classes = useStyles();
  return (
    <>
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
      <MaterialTable
        title="User Budgets"
        columns={[
          { title: "Date", field: "date", filtering: false },
          { title: "User", field: "user" },
          { title: "Business Unit", field: "unit" },
          { title: "Region", field: "region" },
          { title: "Spend", field: "spend", filtering: false },
        ]}
        data={budget}
        options={{
          filtering: true,
          exportButton: true,
          exportAllData: true,
        }}
        icons={tableIcons}
      />
    </>
  );
};

export default BudgetUser;
