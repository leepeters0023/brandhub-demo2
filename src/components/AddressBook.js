import React, { useState } from "react";

import MaterialTable from "material-table";

import { tableIcons } from "../utility/tableIcons";

// simulate mock addresses
const createData = (company, code, city, state) => {
  return { company: company, code: code, city: city, state: state };
};

const billingAddresses = [
  createData(
    "Company Name",
    Math.floor(Math.random() * 1000 + 1000).toString(),
    "City Name",
    "VT"
  ),
  createData(
    "Company Name",
    Math.floor(Math.random() * 1000 + 1000).toString(),
    "City Name",
    "VT"
  ),
  createData(
    "Company Name",
    Math.floor(Math.random() * 1000 + 1000).toString(),
    "City Name",
    "VT"
  ),
  createData(
    "Company Name",
    Math.floor(Math.random() * 1000 + 1000).toString(),
    "City Name",
    "VT"
  ),
];

const shippingAddresses = [
  createData(
    "Company Name",
    Math.floor(Math.random() * 1000 + 1000).toString(),
    "City Name",
    "VT"
  ),
  createData(
    "Company Name",
    Math.floor(Math.random() * 1000 + 1000).toString(),
    "City Name",
    "VT"
  ),
  createData(
    "Company Name",
    Math.floor(Math.random() * 1000 + 1000).toString(),
    "City Name",
    "VT"
  ),
  createData(
    "Company Name",
    Math.floor(Math.random() * 1000 + 1000).toString(),
    "City Name",
    "VT"
  ),
  createData(
    "Company Name",
    Math.floor(Math.random() * 1000 + 1000).toString(),
    "City Name",
    "VT"
  ),
  createData(
    "Company Name",
    Math.floor(Math.random() * 1000 + 1000).toString(),
    "City Name",
    "VT"
  ),
  createData(
    "Company Name",
    Math.floor(Math.random() * 1000 + 1000).toString(),
    "City Name",
    "VT"
  ),
  createData(
    "Company Name",
    Math.floor(Math.random() * 1000 + 1000).toString(),
    "City Name",
    "VT"
  ),
];

const AddressBook = () => {

  const [billing, setBilling] = useState(billingAddresses);
  const [shipping, setShipping] = useState(shippingAddresses);

  const columns = [
    {
      title: "Company",
      field: "company",
    },
    {
      title: "Code",
      field: "code",
    },
    { title: "City", field: "city" },
    {
      title: "State",
      field: "state",
    },
  ];

  return (
    <>
      <MaterialTable
        title="Billing Addresses"
        columns={columns}
        data={billing}
        options={{
          filtering: true,
          headerStyle: {
            backgroundColor: "#0d47a1",
            fontWeight: "600",
            fontSize: "1.1rem",
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
                setBilling([...billing, newData]);

                resolve();
              }, 1000);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataUpdate = [...billing];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                setBilling([...dataUpdate]);

                resolve();
              }, 1000);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataDelete = [...billing];
                const index = oldData.tableData.id;
                dataDelete.splice(index, 1);
                setBilling([...dataDelete]);

                resolve();
              }, 1000);
            }),
        }}
        icons={tableIcons}
      />
      <br />
      <MaterialTable
        title="Shipping Addresses"
        columns={columns}
        data={shipping}
        options={{
          filtering: true,
          headerStyle: {
            backgroundColor: "#0d47a1",
            fontWeight: "600",
            fontSize: "1.1rem",
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
                setShipping([...shipping, newData]);

                resolve();
              }, 1000);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataUpdate = [...shipping];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                setShipping([...dataUpdate]);

                resolve();
              }, 1000);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataDelete = [...shipping];
                const index = oldData.tableData.id;
                dataDelete.splice(index, 1);
                setShipping([...dataDelete]);

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
