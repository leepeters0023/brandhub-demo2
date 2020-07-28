import React, { useState } from "react";

import MaterialTable from "material-table";

import { tableIcons } from "../utility/tableIcons";

const createData = (
  approvalId,
  date,
  sequenceNum,
  brand,
  lastUpdate,
  lastMod,
  comments
) => {
  return {
    approvalId,
    date,
    sequenceNum,
    brand,
    lastUpdate,
    lastMod,
    comments,
  };
};

let date = new Date();
let dateString = date.toLocaleDateString();

const getId = () => {
  return `${Math.floor(Math.random() * 9999 + 10000)}`;
};

const getSeqNum = () => {
  return `1100${Math.floor(Math.random() * 9999 + 10000)}`;
};

const rows = [
  createData(
    getId(),
    dateString,
    getSeqNum(),
    "Apothic",
    dateString,
    "Josh Downs",
    "Reprehenderit amet ex exercitation voluptate est sunt ad tempor."
  ),
  createData(
    getId(),
    dateString,
    getSeqNum(),
    "Apothic",
    dateString,
    "Josh Downs",
    "Reprehenderit amet ex exercitation voluptate est sunt ad tempor."
  ),
  createData(
    getId(),
    dateString,
    getSeqNum(),
    "Apothic",
    dateString,
    "Josh Downs",
    "Reprehenderit amet ex exercitation voluptate est sunt ad tempor."
  ),
  createData(
    getId(),
    dateString,
    getSeqNum(),
    "Apothic",
    dateString,
    "Josh Downs",
    "Reprehenderit amet ex exercitation voluptate est sunt ad tempor."
  ),
  createData(
    getId(),
    dateString,
    getSeqNum(),
    "Apothic",
    dateString,
    "Josh Downs",
    "Reprehenderit amet ex exercitation voluptate est sunt ad tempor."
  ),
  createData(
    getId(),
    dateString,
    getSeqNum(),
    "Apothic",
    dateString,
    "Josh Downs",
    "Reprehenderit amet ex exercitation voluptate est sunt ad tempor."
  ),
  createData(
    getId(),
    dateString,
    getSeqNum(),
    "Apothic",
    dateString,
    "Josh Downs",
    "Reprehenderit amet ex exercitation voluptate est sunt ad tempor."
  ),
  createData(
    getId(),
    dateString,
    getSeqNum(),
    "Apothic",
    dateString,
    "Josh Downs",
    "Reprehenderit amet ex exercitation voluptate est sunt ad tempor."
  ),
  createData(
    getId(),
    dateString,
    getSeqNum(),
    "Apothic",
    dateString,
    "Josh Downs",
    "Reprehenderit amet ex exercitation voluptate est sunt ad tempor."
  ),
  createData(
    getId(),
    dateString,
    getSeqNum(),
    "Apothic",
    dateString,
    "Josh Downs",
    "Reprehenderit amet ex exercitation voluptate est sunt ad tempor."
  ),
];

const ApprovalPrior = ({ handleModal }) => {
  const [selectedRow, setSelectedRow] = useState(null);

  return (
    <>
      <MaterialTable
        title="Prior Approvals"
        columns={[
          { title: "Approval Id", field: "approvalId" },
          { title: "Entry Date", field: "date", filtering: false },
          { title: "Sequence #", field: "sequenceNum" },
          { title: "Brand", field: "brand" },
          { title: "Last Update", field: "lastUpdate", filtering: false },
          { title: "Last Modified By", field: "lastMod", filtering: false },
          { title: "Comments", field: "comments", filtering: false },
        ]}
        data={rows}
        options={{
          filtering: true,
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
          rowStyle: (rowData) => ({
            backgroundColor:
              selectedRow === rowData.tableData.id ? "#EEE" : "#FFF",
          }),
          exportButton: true,
          exportAllData: true,
        }}
        onRowClick={(evt, selectedRow) => {
          setSelectedRow(selectedRow.tableData.id);
          handleModal(`${selectedRow.approvalId}-${selectedRow.sequenceNum}`);
        }}
        icons={tableIcons}
      />
    </>
  );
};

export default ApprovalPrior;
