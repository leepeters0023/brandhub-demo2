import React, { useState } from "react";

import MaterialTable from "material-table";

import { tableIcons } from "../utility/tableIcons";

// simulate mock addresses
const createData = (name, company, city, state, email, busPhone, cellPhone) => {
  return { name, company, city, state, email, busPhone, cellPhone };
};

const contactsList = [
  createData(
    "Firstname Lastname",
    "Company Name",
    "Burlington",
    "VT",
    "email@email.com",
    "555-555-5555 ext: 5555",
    "999-999-9999"
  ),
  createData(
    "Firstname Lastname",
    "Company Name",
    "Burlington",
    "VT",
    "email@email.com",
    "555-555-5555 ext: 5555",
    "999-999-9999"
  ),
  createData(
    "Firstname Lastname",
    "Company Name",
    "Burlington",
    "VT",
    "email@email.com",
    "555-555-5555 ext: 5555",
    "999-999-9999"
  ),
  createData(
    "Firstname Lastname",
    "Company Name",
    "Burlington",
    "VT",
    "email@email.com",
    "555-555-5555 ext: 5555",
    "999-999-9999"
  ),
  createData(
    "Firstname Lastname",
    "Company Name",
    "Burlington",
    "VT",
    "email@email.com",
    "555-555-5555 ext: 5555",
    "999-999-9999"
  ),
  createData(
    "Firstname Lastname",
    "Company Name",
    "Burlington",
    "VT",
    "email@email.com",
    "555-555-5555 ext: 5555",
    "999-999-9999"
  ),
  createData(
    "Firstname Lastname",
    "Company Name",
    "Burlington",
    "VT",
    "email@email.com",
    "555-555-5555 ext: 5555",
    "999-999-9999"
  ),
  createData(
    "Firstname Lastname",
    "Company Name",
    "Burlington",
    "VT",
    "email@email.com",
    "555-555-5555 ext: 5555",
    "999-999-9999"
  ),
  createData(
    "Firstname Lastname",
    "Company Name",
    "Burlington",
    "VT",
    "email@email.com",
    "555-555-5555 ext: 5555",
    "999-999-9999"
  ),
  createData(
    "Firstname Lastname",
    "Company Name",
    "Burlington",
    "VT",
    "email@email.com",
    "555-555-5555 ext: 5555",
    "999-999-9999"
  ),
  createData(
    "Firstname Lastname",
    "Company Name",
    "Burlington",
    "VT",
    "email@email.com",
    "555-555-5555 ext: 5555",
    "999-999-9999"
  )
]

const AddressBook = () => {

  const [contacts, setContacts] = useState(contactsList)

  const columns = [
    { title: "Name", field: "name" },
    { title: "Company", field: "company" },
    { title: "City", field: "city" },
    { title: "State", field: "state" },
    { title: "Email", field: "email" },
    { title: "Phone (work)", field: "busPhone", filtering: false },
    { title: "Phone (cell)", field: "cellPhone", filtering: false}
  ];

  return (
    <>
      <MaterialTable
        title="Contacts"
        columns={columns}
        data={contacts}
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
                setContacts([...contacts, newData]);

                resolve();
              }, 1000);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataUpdate = [...contacts];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                setContacts([...dataUpdate]);

                resolve();
              }, 1000);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataDelete = [...contacts];
                const index = oldData.tableData.id;
                dataDelete.splice(index, 1);
                setContacts([...dataDelete]);

                resolve();
              }, 1000);
            }),
        }}
        icons={tableIcons}
      />
    </>
  );
};

export default AddressBook;
