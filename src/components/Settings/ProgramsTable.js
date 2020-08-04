import React, { useState } from "react";

import MaterialTable from "material-table";
import { makeStyles } from "@material-ui/core/styles";

import { tableIcons } from "../../utility/tableIcons";

import programs from "../../assets/mockdata/Programs";

const programList = programs.map((prog) => ({
  id: prog.id,
  imgUrl: prog.imgUrl,
  name: prog.name,
  timeframe: prog.timeframe,
  totalItems: Math.floor(Math.random() * 15 + 5),
  status: "Active",
}));

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const ProgrogramsTable = ({ handleProgramClick }) => {
  const classes = useStyles();
  const [selectedRow, setSelectedRow] = useState(null);

  return (
    <>
      <MaterialTable
        title="Current Programs"
        columns={[
          {
            title: "",
            field: "imgUrl",
            render: (rowData) => (
              <img
                src={rowData.imgUrl}
                alt="Preview Thumbnail"
                className={classes.previewImg}
              />
            ),
            filtering: false
          },
          { title: "Id #", field: "id" },
          { title: "Program", field: "name" },
          { title: "Timeframe", field: "timeframe", filtering: false },
          { title: "Total Items", field: "totalItems", filtering: false },
          { title: "Status", field: "status" },
        ]}
        data={programList}
        options={{
          filtering: true,
          rowStyle: (rowData) => ({
            backgroundColor:
              selectedRow === rowData.tableData.id ? "#EEE" : "#FFF",
          }),
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
        onRowClick={(evt, selectedRow) => {
          setSelectedRow(selectedRow.tableData.id);
          handleProgramClick(`${selectedRow.id}`);
        }}
        icons={tableIcons}
      />
    </>
  );
};

export default ProgrogramsTable;
