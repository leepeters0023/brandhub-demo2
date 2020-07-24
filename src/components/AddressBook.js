import React, { useState } from "react";

import MaterialTable from "material-table";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import { tableIcons } from "../utility/tableIcons";

// simulate mock addresses
const createData = (company, code, city, state) => {
  return { company, code, city, state };
};

const billingAddresses = [
  createData(
    "Company Name",
    `(${Math.floor(Math.random() * 1000 + 1000)})`,
    "City Name",
    "VT"
  ),
  createData(
    "Company Name",
    `(${Math.floor(Math.random() * 1000 + 1000)})`,
    "City Name",
    "VT"
  ),
  createData(
    "Company Name",
    `(${Math.floor(Math.random() * 1000 + 1000)})`,
    "City Name",
    "VT"
  ),
  createData(
    "Company Name",
    `(${Math.floor(Math.random() * 1000 + 1000)})`,
    "City Name",
    "VT"
  ),
];

const shippingAddresses = [
  createData(
    "Company Name",
    `(${Math.floor(Math.random() * 1000 + 1000)})`,
    "City Name",
    "VT"
  ),
  createData(
    "Company Name",
    `(${Math.floor(Math.random() * 1000 + 1000)})`,
    "City Name",
    "VT"
  ),
  createData(
    "Company Name",
    `(${Math.floor(Math.random() * 1000 + 1000)})`,
    "City Name",
    "VT"
  ),
  createData(
    "Company Name",
    `(${Math.floor(Math.random() * 1000 + 1000)})`,
    "City Name",
    "VT"
  ),
  createData(
    "Company Name",
    `(${Math.floor(Math.random() * 1000 + 1000)})`,
    "City Name",
    "VT"
  ),
  createData(
    "Company Name",
    `(${Math.floor(Math.random() * 1000 + 1000)})`,
    "City Name",
    "VT"
  ),
  createData(
    "Company Name",
    `(${Math.floor(Math.random() * 1000 + 1000)})`,
    "City Name",
    "VT"
  ),
  createData(
    "Company Name",
    `(${Math.floor(Math.random() * 1000 + 1000)})`,
    "City Name",
    "VT"
  ),
];

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  colHeader: {
    color: "#FFF",
    "&:hover": {
      color: "#ffac33",
    },
  },
}));

const AddressBook = () => {
  const classes = useStyles();

  const [billing, setBilling] = useState(billingAddresses);
  const [shipping, setShipping] = useState(shippingAddresses);

  const columns = [
    {
      title: <h3 className={classes.colHeader}>Company</h3>,
      field: "company",
    },
    {
      title: <h3 className={classes.colHeader}>Code</h3>,
      field: "code",
    },
    { title: <h3 className={classes.colHeader}>City</h3>, field: "city" },
    {
      title: <h3 className={classes.colHeader}>State</h3>,
      field: "state",
    },
  ];

  return (
    <>
      <MaterialTable
        title={
          <Typography className={classes.titleText}>
            Billing Addresses
          </Typography>
        }
        columns={columns}
        data={billing}
        options={{
          filtering: true,
          headerStyle: {
            backgroundColor: "#0d47a1",
            position: "sticky",
            top: 0,
            color: "#FFF",
            "&:hover": {
              color: "#ffac33",
            },
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
      <br/>
      <MaterialTable
        title={
          <Typography className={classes.titleText}>
            Shipping Addresses
          </Typography>
        }
        columns={columns}
        data={shipping}
        options={{
          filtering: true,
          headerStyle: {
            backgroundColor: "#0d47a1",
            position: "sticky",
            top: 0,
            color: "#FFF",
            "&:hover": {
              color: "#ffac33",
            },
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
