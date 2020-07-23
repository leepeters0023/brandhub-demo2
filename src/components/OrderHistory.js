import React from "react";

import MaterialTable from "material-table";

import { tableIcons } from "../utility/tableIcons";

import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";

import CachedIcon from "@material-ui/icons/Cached";
import GetAppIcon from "@material-ui/icons/GetApp";

// simulate data for mock
const createData = (sequenceNum, date, account, tracking, total) => {
  return { sequenceNum, date, account, tracking, total };
};

let date = new Date();
let dateString = date.toLocaleDateString();

const getSeqNum = () => {
  return `1100${Math.floor(Math.random() * 9999 + 10000)}`;
};

const rows = [
  createData(
    getSeqNum(),
    dateString,
    "Account ABC",
    getSeqNum(),
    (Math.random() * 1000).toFixed(2)
  ),
  createData(
    getSeqNum(),
    dateString,
    "Account ABC",
    getSeqNum(),
    (Math.random() * 1000).toFixed(2)
  ),
  createData(
    getSeqNum(),
    dateString,
    "Account ABC",
    getSeqNum(),
    (Math.random() * 1000).toFixed(2)
  ),
  createData(
    getSeqNum(),
    dateString,
    "Account ABC",
    getSeqNum(),
    (Math.random() * 1000).toFixed(2)
  ),
  createData(
    getSeqNum(),
    dateString,
    "Account ABC",
    getSeqNum(),
    (Math.random() * 1000).toFixed(2)
  ),
  createData(
    getSeqNum(),
    dateString,
    "Account ABC",
    getSeqNum(),
    (Math.random() * 1000).toFixed(2)
  ),
  createData(
    getSeqNum(),
    dateString,
    "Account ABC",
    getSeqNum(),
    (Math.random() * 1000).toFixed(2)
  ),
  createData(
    getSeqNum(),
    dateString,
    "Account ABC",
    getSeqNum(),
    (Math.random() * 1000).toFixed(2)
  ),
];

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  configButtons: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-end",
  },
}));

const OrderHistory = () => {
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
        title="Order History"
        columns={[
          { title: "Sequence #", field: "sequenceNum" },
          { title: "Date", field: "date", filtering: false },
          { title: "Account", field: "account" },
          { title: "Tracking #", field: "tracking" },
          { title: "Total", field: "total", filtering: false },
        ]}
        data={rows}
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

export default OrderHistory;
