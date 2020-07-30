import React, { useState } from "react";

import MaterialTable from "material-table";

import { tableIcons } from "../utility/tableIcons";

const RulesByStateTable = ({ data }) => {
  const [currentData, setCurrentData] = useState(data);

  const columns = [
    {
      title: "State",
      field: "state",
      editable: "never",
      width: "20px",
    },
    { title: "Rule", field: "rule", width: "400px" },
    { title: "Effective Date", field: "effectiveDate", width: "20px" },
    { title: "Notes", field: "notes", filtering: false, width: "400px", render: (rowData) => (
      <div style={{overflowY: "scroll", height: "75px", border: "1px solid black", padding: "5px", borderRadius: "5px"}}>{rowData["notes"]}</div>
    ) },
  ];

  return (
    <>
      <MaterialTable
        title="Rules"
        columns={columns}
        data={currentData}
        options={{
          filtering: true,
          headerStyle: {
            backgroundColor: "#404040",
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
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                setCurrentData([...currentData, newData]);

                resolve();
              }, 1000);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataUpdate = [...currentData];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                setCurrentData([...dataUpdate]);

                resolve();
              }, 1000);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataDelete = [...currentData];
                const index = oldData.tableData.id;
                dataDelete.splice(index, 1);
                setCurrentData([...dataDelete]);

                resolve();
              }, 1000);
            }),
        }}
        icons={tableIcons}
      />
    </>
  );
};

export default RulesByStateTable;
