import React, { useState } from 'react'

import MaterialTable from "material-table";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import { tableIcons } from "../utility/tableIcons";

//mock data

import items from "../assets/mockdata/Items";
import distributors from "../assets/mockdata/distributors";

const createData = (
  orderNum,
  sequenceNum,
  brand,
  distributor,
  state,
  orderDate,
  itemType,
  qty,
  orderName,
  shipDate,
  carrier,
  trackingNum,
) => {
  return {
    orderNum,
  sequenceNum,
  brand,
  distributor,
  state,
  orderDate,
  itemType,
  qty,
  orderName,
  shipDate,
  carrier,
  trackingNum,
  }
}

let date = new Date();
let dateString = date.toLocaleDateString();

const getOrderNum = () => {
  return `${Math.floor(Math.random() * 9999 + 10000)}`;
};

const getSeqNum = () => {
  return `1100${Math.floor(Math.random() * 9999 + 10000)}`;
};

const rows = [
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random()*7+1)].brand,
    distributors[Math.floor(Math.random()*7+1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random()*7+1)].itemType,
    Math.floor(Math.random()*200+5),
    "Name Here",
    dateString,
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random()*7+1)].brand,
    distributors[Math.floor(Math.random()*7+1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random()*7+1)].itemType,
    Math.floor(Math.random()*200+5),
    "Name Here",
    dateString,
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random()*7+1)].brand,
    distributors[Math.floor(Math.random()*7+1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random()*7+1)].itemType,
    Math.floor(Math.random()*200+5),
    "Name Here",
    dateString,
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random()*7+1)].brand,
    distributors[Math.floor(Math.random()*7+1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random()*7+1)].itemType,
    Math.floor(Math.random()*200+5),
    "Name Here",
    dateString,
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random()*7+1)].brand,
    distributors[Math.floor(Math.random()*7+1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random()*7+1)].itemType,
    Math.floor(Math.random()*200+5),
    "Name Here",
    dateString,
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random()*7+1)].brand,
    distributors[Math.floor(Math.random()*7+1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random()*7+1)].itemType,
    Math.floor(Math.random()*200+5),
    "Name Here",
    dateString,
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random()*7+1)].brand,
    distributors[Math.floor(Math.random()*7+1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random()*7+1)].itemType,
    Math.floor(Math.random()*200+5),
    "Name Here",
    dateString,
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random()*7+1)].brand,
    distributors[Math.floor(Math.random()*7+1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random()*7+1)].itemType,
    Math.floor(Math.random()*200+5),
    "Name Here",
    dateString,
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random()*7+1)].brand,
    distributors[Math.floor(Math.random()*7+1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random()*7+1)].itemType,
    Math.floor(Math.random()*200+5),
    "Name Here",
    dateString,
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random()*7+1)].brand,
    distributors[Math.floor(Math.random()*7+1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random()*7+1)].itemType,
    Math.floor(Math.random()*200+5),
    "Name Here",
    dateString,
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random()*7+1)].brand,
    distributors[Math.floor(Math.random()*7+1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random()*7+1)].itemType,
    Math.floor(Math.random()*200+5),
    "Name Here",
    dateString,
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random()*7+1)].brand,
    distributors[Math.floor(Math.random()*7+1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random()*7+1)].itemType,
    Math.floor(Math.random()*200+5),
    "Name Here",
    dateString,
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random()*7+1)].brand,
    distributors[Math.floor(Math.random()*7+1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random()*7+1)].itemType,
    Math.floor(Math.random()*200+5),
    "Name Here",
    dateString,
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random()*7+1)].brand,
    distributors[Math.floor(Math.random()*7+1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random()*7+1)].itemType,
    Math.floor(Math.random()*200+5),
    "Name Here",
    dateString,
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random()*7+1)].brand,
    distributors[Math.floor(Math.random()*7+1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random()*7+1)].itemType,
    Math.floor(Math.random()*200+5),
    "Name Here",
    dateString,
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random()*7+1)].brand,
    distributors[Math.floor(Math.random()*7+1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random()*7+1)].itemType,
    Math.floor(Math.random()*200+5),
    "Name Here",
    dateString,
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random()*7+1)].brand,
    distributors[Math.floor(Math.random()*7+1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random()*7+1)].itemType,
    Math.floor(Math.random()*200+5),
    "Name Here",
    dateString,
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random()*7+1)].brand,
    distributors[Math.floor(Math.random()*7+1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random()*7+1)].itemType,
    Math.floor(Math.random()*200+5),
    "Name Here",
    dateString,
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random()*7+1)].brand,
    distributors[Math.floor(Math.random()*7+1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random()*7+1)].itemType,
    Math.floor(Math.random()*200+5),
    "Name Here",
    dateString,
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random()*7+1)].brand,
    distributors[Math.floor(Math.random()*7+1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random()*7+1)].itemType,
    Math.floor(Math.random()*200+5),
    "Name Here",
    dateString,
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random()*7+1)].brand,
    distributors[Math.floor(Math.random()*7+1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random()*7+1)].itemType,
    Math.floor(Math.random()*200+5),
    "Name Here",
    dateString,
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random()*7+1)].brand,
    distributors[Math.floor(Math.random()*7+1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random()*7+1)].itemType,
    Math.floor(Math.random()*200+5),
    "Name Here",
    dateString,
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random()*7+1)].brand,
    distributors[Math.floor(Math.random()*7+1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random()*7+1)].itemType,
    Math.floor(Math.random()*200+5),
    "Name Here",
    dateString,
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random()*7+1)].brand,
    distributors[Math.floor(Math.random()*7+1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random()*7+1)].itemType,
    Math.floor(Math.random()*200+5),
    "Name Here",
    dateString,
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random()*7+1)].brand,
    distributors[Math.floor(Math.random()*7+1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random()*7+1)].itemType,
    Math.floor(Math.random()*200+5),
    "Name Here",
    dateString,
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random()*7+1)].brand,
    distributors[Math.floor(Math.random()*7+1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random()*7+1)].itemType,
    Math.floor(Math.random()*200+5),
    "Name Here",
    dateString,
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random()*7+1)].brand,
    distributors[Math.floor(Math.random()*7+1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random()*7+1)].itemType,
    Math.floor(Math.random()*200+5),
    "Name Here",
    dateString,
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random()*7+1)].brand,
    distributors[Math.floor(Math.random()*7+1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random()*7+1)].itemType,
    Math.floor(Math.random()*200+5),
    "Name Here",
    dateString,
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random()*7+1)].brand,
    distributors[Math.floor(Math.random()*7+1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random()*7+1)].itemType,
    Math.floor(Math.random()*200+5),
    "Name Here",
    dateString,
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random()*7+1)].brand,
    distributors[Math.floor(Math.random()*7+1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random()*7+1)].itemType,
    Math.floor(Math.random()*200+5),
    "Name Here",
    dateString,
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random()*7+1)].brand,
    distributors[Math.floor(Math.random()*7+1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random()*7+1)].itemType,
    Math.floor(Math.random()*200+5),
    "Name Here",
    dateString,
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random()*7+1)].brand,
    distributors[Math.floor(Math.random()*7+1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random()*7+1)].itemType,
    Math.floor(Math.random()*200+5),
    "Name Here",
    dateString,
    "UPS",
    getSeqNum()
  )
]

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  colHeader: {
    color: "#FFF",
    "&:hover": {
      color: "#ffac33"
    }
  }
}))

const TrackingTable = ({ handlePreview }) => {
  const classes = useStyles();
  const [selectedRow, setSelectedRow] = useState(null);

  return (
    <>
      <MaterialTable
        title={<Typography className={classes.titleText}>Tracking</Typography>}
        columns={[
          { title: <h4 className={classes.colHeader}>Ord. #</h4>, field: "orderNum" },
          { title: <h4 className={classes.colHeader}>Seq. #</h4>, field: "sequenceNum" },
          { title: <h4 className={classes.colHeader}>Brand</h4>, field: "brand" },
          { title: <h4 className={classes.colHeader}>Distributor</h4>, field: "distributor", render: rowData => <div style={{width: "200px"}}><p>{rowData.distributor}</p></div> },
          { title: <h4 className={classes.colHeader}>State</h4>, field: "state" },
          { title: <h4 className={classes.colHeader}>Order Date</h4>, field: "orderDate", filtering: false },
          { title: <h4 className={classes.colHeader}>Item Type</h4>, field: "itemType" },
          { title: <h4 className={classes.colHeader}>Qty</h4>, field: "qty", filtering: false },
          { title: <h4 className={classes.colHeader}>Order Name</h4>, field: "orderName" },
          { title: <h4 className={classes.colHeader}>Ship Date</h4>, field: "shipDate", filtering: false },
          { title: <h4 className={classes.colHeader}>Carrier</h4>, field: "carrier" },
          { title: <h4 className={classes.colHeader}>Track. #</h4>, field: "trackingNum"}
        ]}
        data={rows}
        options={{
          filtering: true,
          rowStyle: rowData => ({
            backgroundColor: (selectedRow === rowData.tableData.id) ? '#EEE' : '#FFF'
          }),
          headerStyle: {
            backgroundColor: "#0d47a1",
            position: "sticky",
            top: 0,
            color: "#FFF",
            "&:hover": {
              color: "#ffac33"
            },
          },
          filterCellStyle: {
            position: "sticky",
          },
          maxBodyHeight: "650px",
          pageSizeOptions: [5, 10, 20, 50, 100],
          exportButton: true,
          exportAllData: true
        }}
        onRowClick={((evt, selectedRow) => {
          setSelectedRow(selectedRow.tableData.id)
          handlePreview(`${selectedRow.orderNum}-${selectedRow.sequenceNum}`)
        })}
        icons={tableIcons}
      />
    </>
  )
}

export default TrackingTable
