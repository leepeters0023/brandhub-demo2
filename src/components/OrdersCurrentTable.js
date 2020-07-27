import React, { useState } from "react";

import MaterialTable from "material-table";

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
  trackingNum
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
  };
};

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
    items[Math.floor(Math.random() * 7 + 1)].brand,
    distributors[Math.floor(Math.random() * 7 + 1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random() * 7 + 1)].itemType,
    Math.floor(Math.random() * 200 + 5),
    "Name Here",
    "TBD",
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random() * 7 + 1)].brand,
    distributors[Math.floor(Math.random() * 7 + 1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random() * 7 + 1)].itemType,
    Math.floor(Math.random() * 200 + 5),
    "Name Here",
    "TBD",
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random() * 7 + 1)].brand,
    distributors[Math.floor(Math.random() * 7 + 1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random() * 7 + 1)].itemType,
    Math.floor(Math.random() * 200 + 5),
    "Name Here",
    "TBD",
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random() * 7 + 1)].brand,
    distributors[Math.floor(Math.random() * 7 + 1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random() * 7 + 1)].itemType,
    Math.floor(Math.random() * 200 + 5),
    "Name Here",
    "TBD",
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random() * 7 + 1)].brand,
    distributors[Math.floor(Math.random() * 7 + 1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random() * 7 + 1)].itemType,
    Math.floor(Math.random() * 200 + 5),
    "Name Here",
    "TBD",
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random() * 7 + 1)].brand,
    distributors[Math.floor(Math.random() * 7 + 1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random() * 7 + 1)].itemType,
    Math.floor(Math.random() * 200 + 5),
    "Name Here",
    "TBD",
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random() * 7 + 1)].brand,
    distributors[Math.floor(Math.random() * 7 + 1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random() * 7 + 1)].itemType,
    Math.floor(Math.random() * 200 + 5),
    "Name Here",
    "TBD",
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random() * 7 + 1)].brand,
    distributors[Math.floor(Math.random() * 7 + 1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random() * 7 + 1)].itemType,
    Math.floor(Math.random() * 200 + 5),
    "Name Here",
    "TBD",
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random() * 7 + 1)].brand,
    distributors[Math.floor(Math.random() * 7 + 1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random() * 7 + 1)].itemType,
    Math.floor(Math.random() * 200 + 5),
    "Name Here",
    "TBD",
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random() * 7 + 1)].brand,
    distributors[Math.floor(Math.random() * 7 + 1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random() * 7 + 1)].itemType,
    Math.floor(Math.random() * 200 + 5),
    "Name Here",
    "TBD",
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random() * 7 + 1)].brand,
    distributors[Math.floor(Math.random() * 7 + 1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random() * 7 + 1)].itemType,
    Math.floor(Math.random() * 200 + 5),
    "Name Here",
    "TBD",
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random() * 7 + 1)].brand,
    distributors[Math.floor(Math.random() * 7 + 1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random() * 7 + 1)].itemType,
    Math.floor(Math.random() * 200 + 5),
    "Name Here",
    "TBD",
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random() * 7 + 1)].brand,
    distributors[Math.floor(Math.random() * 7 + 1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random() * 7 + 1)].itemType,
    Math.floor(Math.random() * 200 + 5),
    "Name Here",
    "TBD",
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random() * 7 + 1)].brand,
    distributors[Math.floor(Math.random() * 7 + 1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random() * 7 + 1)].itemType,
    Math.floor(Math.random() * 200 + 5),
    "Name Here",
    "TBD",
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random() * 7 + 1)].brand,
    distributors[Math.floor(Math.random() * 7 + 1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random() * 7 + 1)].itemType,
    Math.floor(Math.random() * 200 + 5),
    "Name Here",
    "TBD",
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random() * 7 + 1)].brand,
    distributors[Math.floor(Math.random() * 7 + 1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random() * 7 + 1)].itemType,
    Math.floor(Math.random() * 200 + 5),
    "Name Here",
    "TBD",
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random() * 7 + 1)].brand,
    distributors[Math.floor(Math.random() * 7 + 1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random() * 7 + 1)].itemType,
    Math.floor(Math.random() * 200 + 5),
    "Name Here",
    "TBD",
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random() * 7 + 1)].brand,
    distributors[Math.floor(Math.random() * 7 + 1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random() * 7 + 1)].itemType,
    Math.floor(Math.random() * 200 + 5),
    "Name Here",
    "TBD",
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random() * 7 + 1)].brand,
    distributors[Math.floor(Math.random() * 7 + 1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random() * 7 + 1)].itemType,
    Math.floor(Math.random() * 200 + 5),
    "Name Here",
    "TBD",
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random() * 7 + 1)].brand,
    distributors[Math.floor(Math.random() * 7 + 1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random() * 7 + 1)].itemType,
    Math.floor(Math.random() * 200 + 5),
    "Name Here",
    "TBD",
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random() * 7 + 1)].brand,
    distributors[Math.floor(Math.random() * 7 + 1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random() * 7 + 1)].itemType,
    Math.floor(Math.random() * 200 + 5),
    "Name Here",
    "TBD",
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random() * 7 + 1)].brand,
    distributors[Math.floor(Math.random() * 7 + 1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random() * 7 + 1)].itemType,
    Math.floor(Math.random() * 200 + 5),
    "Name Here",
    "TBD",
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random() * 7 + 1)].brand,
    distributors[Math.floor(Math.random() * 7 + 1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random() * 7 + 1)].itemType,
    Math.floor(Math.random() * 200 + 5),
    "Name Here",
    "TBD",
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random() * 7 + 1)].brand,
    distributors[Math.floor(Math.random() * 7 + 1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random() * 7 + 1)].itemType,
    Math.floor(Math.random() * 200 + 5),
    "Name Here",
    "TBD",
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random() * 7 + 1)].brand,
    distributors[Math.floor(Math.random() * 7 + 1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random() * 7 + 1)].itemType,
    Math.floor(Math.random() * 200 + 5),
    "Name Here",
    "TBD",
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random() * 7 + 1)].brand,
    distributors[Math.floor(Math.random() * 7 + 1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random() * 7 + 1)].itemType,
    Math.floor(Math.random() * 200 + 5),
    "Name Here",
    "TBD",
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random() * 7 + 1)].brand,
    distributors[Math.floor(Math.random() * 7 + 1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random() * 7 + 1)].itemType,
    Math.floor(Math.random() * 200 + 5),
    "Name Here",
    "TBD",
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random() * 7 + 1)].brand,
    distributors[Math.floor(Math.random() * 7 + 1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random() * 7 + 1)].itemType,
    Math.floor(Math.random() * 200 + 5),
    "Name Here",
    "TBD",
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random() * 7 + 1)].brand,
    distributors[Math.floor(Math.random() * 7 + 1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random() * 7 + 1)].itemType,
    Math.floor(Math.random() * 200 + 5),
    "Name Here",
    "TBD",
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random() * 7 + 1)].brand,
    distributors[Math.floor(Math.random() * 7 + 1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random() * 7 + 1)].itemType,
    Math.floor(Math.random() * 200 + 5),
    "Name Here",
    "TBD",
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random() * 7 + 1)].brand,
    distributors[Math.floor(Math.random() * 7 + 1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random() * 7 + 1)].itemType,
    Math.floor(Math.random() * 200 + 5),
    "Name Here",
    "TBD",
    "UPS",
    getSeqNum()
  ),
  createData(
    getOrderNum(),
    getSeqNum(),
    items[Math.floor(Math.random() * 7 + 1)].brand,
    distributors[Math.floor(Math.random() * 7 + 1)].name,
    "VT",
    dateString,
    items[Math.floor(Math.random() * 7 + 1)].itemType,
    Math.floor(Math.random() * 200 + 5),
    "Name Here",
    "TBD",
    "UPS",
    getSeqNum()
  ),
];

const OrdersCurrentTable = ({ handlePreview }) => {
  const [selectedRow, setSelectedRow] = useState(null);

  return (
    <>
      <MaterialTable
        title="Current Orders"
        columns={[
          { title: "Ord. #", field: "orderNum" },
          { title: "Seq. #", field: "sequenceNum" },
          { title: "Brand", field: "brand" },
          {
            title: "Distributor",
            field: "distributor",
            render: (rowData) => (
              <div style={{ width: "200px" }}>
                <p>{rowData.distributor}</p>
              </div>
            ),
          },
          { title: "State", field: "state" },
          { title: "Order Date", field: "orderDate", filtering: false },
          { title: "Item Type", field: "itemType" },
          { title: "Qty", field: "qty", filtering: false },
          { title: "Order Name", field: "orderName" },
          { title: "Ship Date", field: "shipDate", filtering: false },
          { title: "Carrier", field: "carrier" },
          { title: "Track. #", field: "trackingNum" },
        ]}
        data={rows}
        options={{
          filtering: true,
          rowStyle: (rowData) => ({
            backgroundColor:
              selectedRow === rowData.tableData.id ? "#EEE" : "#FFF",
          }),
          headerStyle: {
            backgroundColor: "#0d47a1",
            fontWeight: "600",
            position: "sticky",
            top: 0,
            color: "#FFF",
          },
          filterCellStyle: {
            position: "sticky",
          },
          maxBodyHeight: "650px",
          pageSizeOptions: [5, 10, 20, 50, 100],
          exportButton: true,
          exportAllData: true,
        }}
        onRowClick={(evt, selectedRow) => {
          setSelectedRow(selectedRow.tableData.id);
          handlePreview(`${selectedRow.orderNum}-${selectedRow.sequenceNum}`);
        }}
        icons={tableIcons}
      />
    </>
  );
};

export default OrdersCurrentTable;
