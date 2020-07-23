import React from "react";

import MaterialTable from "material-table";

import { tableIcons } from "../utility/tableIcons";

import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
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
];

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  configButtons: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-end",
  },
}));

const BudgetRegional = () => {
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
        title="Regional Budget"
        columns={[
          { title: "Date", field: "date", filtering: false },
          { title: "Business Unit", field: "unit" },
          { title: "Region", field: "region" },
          { title: "Budget", field: "budget", filtering: false },
          { title: "Spend", field: "spend", filtering: false },
          { title: "Balance", field: "balance", filtering: false },
          {
            title: "Status",
            field: "status",
            render: (rowData) => {
              if (rowData.status === "Approved") {
                return (
                  <div
                    style={{
                      backgroundColor: "#4caf50",
                      color: "#FFF",
                      textAlign: "center",
                      padding: "1px",
                      borderRadius: "5px",
                    }}
                  >
                    <p style={{ fontWeight: "bold" }}>{rowData.status}</p>
                  </div>
                );
              } else if (rowData.status === "Active") {
                return (
                  <div
                    style={{
                      backgroundColor: "#3f51b5",
                      color: "#FFF",
                      textAlign: "center",
                      padding: "1px",
                      borderRadius: "5px",
                    }}
                  >
                    <p style={{ fontWeight: "bold" }}>{rowData.status}</p>
                  </div>
                );
              } else if (rowData.status === "Pending") {
                return (
                  <div
                    style={{
                      backgroundColor: "#ff9800",
                      color: "#FFF",
                      textAlign: "center",
                      padding: "1px",
                      borderRadius: "5px",
                    }}
                  >
                    <p style={{ fontWeight: "bold" }}>{rowData.status}</p>
                  </div>
                );
              } else if (rowData.status === "Canceled") {
                return (
                  <div
                    style={{
                      backgroundColor: "#f44336",
                      color: "#FFF",
                      textAlign: "center",
                      padding: "1px",
                      borderRadius: "5px",
                    }}
                  >
                    <p style={{ fontWeight: "bold" }}>{rowData.status}</p>
                  </div>
                );
              }
            },
          },
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

export default BudgetRegional;
