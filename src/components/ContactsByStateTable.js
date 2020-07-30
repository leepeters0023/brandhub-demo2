import React, { useState } from "react";

import MaterialTable from "material-table";

import { tableIcons } from "../utility/tableIcons";

const ContactsByStateTable = ({ data }) => {
  const [currentContacts, setCurrentContacts] = useState(data);

  const columns = [
    {
      title: "State",
      field: "state",
      editable: "never",
      width: "20px",
    },
    { title: "Name", field: "name" },
    { title: "Address", field: "address" },
    { title: "Email", field: "email" },
    { title: "Phone", field: "phone"}
  ];

  return (
    <>
      <MaterialTable
        title="Contacts"
        columns={columns}
        data={currentContacts}
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
                setCurrentContacts([...currentContacts, newData]);

                resolve();
              }, 1000);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataUpdate = [...currentContacts];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                setCurrentContacts([...dataUpdate]);

                resolve();
              }, 1000);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataDelete = [...currentContacts];
                const index = oldData.tableData.id;
                dataDelete.splice(index, 1);
                setCurrentContacts([...dataDelete]);

                resolve();
              }, 1000);
            }),
        }}
        icons={tableIcons}
      />
    </>
  );
};

export default ContactsByStateTable;
