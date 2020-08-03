import React, { useState } from "react";

import MaterialTable from "material-table";

import { tableIcons } from "../../utility/tableIcons";

const createData = (id, name, email, phone, role, regions) => {
  return {
    id, name, email, phone, role, regions
  }
}

const userList = [
  createData(
    Math.floor(Math.random()*10000+1),
    "Firstname Lastname",
    "email@email.com",
    "555-555-5555",
    "Field User Lvl. One",
    "Region 1, Region 2"
  ),
  createData(
    Math.floor(Math.random()*10000+1),
    "Firstname Lastname",
    "email@email.com",
    "555-555-5555",
    "Field User Lvl. One",
    "Region 1, Region 2"
  ),
  createData(
    Math.floor(Math.random()*10000+1),
    "Firstname Lastname",
    "email@email.com",
    "555-555-5555",
    "Field User Lvl. One",
    "Region 1, Region 2"
  ),
  createData(
    Math.floor(Math.random()*10000+1),
    "Firstname Lastname",
    "email@email.com",
    "555-555-5555",
    "Field User Lvl. One",
    "Region 1, Region 2"
  ),
  createData(
    Math.floor(Math.random()*10000+1),
    "Firstname Lastname",
    "email@email.com",
    "555-555-5555",
    "Field User Lvl. One",
    "Region 1, Region 2"
  ),
  createData(
    Math.floor(Math.random()*10000+1),
    "Firstname Lastname",
    "email@email.com",
    "555-555-5555",
    "Field User Lvl. One",
    "Region 1, Region 2"
  ),
  createData(
    Math.floor(Math.random()*10000+1),
    "Firstname Lastname",
    "email@email.com",
    "555-555-5555",
    "Field User Lvl. One",
    "Region 1, Region 2"
  ),
  createData(
    Math.floor(Math.random()*10000+1),
    "Firstname Lastname",
    "email@email.com",
    "555-555-5555",
    "Field User Lvl. One",
    "Region 1, Region 2"
  ),
  createData(
    Math.floor(Math.random()*10000+1),
    "Firstname Lastname",
    "email@email.com",
    "555-555-5555",
    "Field User Lvl. One",
    "Region 1, Region 2"
  ),
  createData(
    Math.floor(Math.random()*10000+1),
    "Firstname Lastname",
    "email@email.com",
    "555-555-5555",
    "Field User Lvl. One",
    "Region 1, Region 2"
  ),
]

const UserTable = ({ handleUserClick }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  return (
    <>
      <MaterialTable
          title="Active Users"
          columns={[
            { title: "Id #", field: "id" },
            { title: "Name", field: "name" },
            { title: "Email", field: "email" },
            { title: "Phone", field: "phone", filtering: false },
            { title: "Role", field: "role" },
            { title: "Regions", field: "regions", filtering: false },
          ]}
          data={userList}
          options={{
            filtering: true,
            rowStyle: rowData => ({
              backgroundColor: (selectedRow === rowData.tableData.id) ? '#EEE' : '#FFF'
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
            exportAllData: true
          }}
          onRowClick={((evt, selectedRow) => {
            setSelectedRow(selectedRow.tableData.id)
            handleUserClick(`${selectedRow.id}`)
          })}
          icons={tableIcons}
        />
    </>
  )
}

export default UserTable