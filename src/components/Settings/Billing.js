import React, { useState } from "react";

import MaterialTable from "material-table";

import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import { tableIcons } from "../../utility/tableIcons";

const createData = (company, contactName, code, city, state, zip, billingAdd, shippingAdd) => {
  return {company, contactName, code, city, state, zip, billingAdd, shippingAdd}
}

const data = [
  createData(
    "Company Name",
    "Company Contact",
    Math.floor(Math.random() * 1000 + 1000).toString(),
    "Burlington",
    "VT",
    "05401",
    "555 Some St.",
    "555 Some Other St."
  ),
  createData(
    "Company Name",
    "Company Contact",
    Math.floor(Math.random() * 1000 + 1000).toString(),
    "Burlington",
    "VT",
    "05401",
    "555 Some St.",
    "555 Some Other St."
  ),
  createData(
    "Company Name",
    "Company Contact",
    Math.floor(Math.random() * 1000 + 1000).toString(),
    "Burlington",
    "VT",
    "05401",
    "555 Some St.",
    "555 Some Other St."
  ),
  createData(
    "Company Name",
    "Company Contact",
    Math.floor(Math.random() * 1000 + 1000).toString(),
    "Burlington",
    "VT",
    "05401",
    "555 Some St.",
    "555 Some Other St."
  ),
  createData(
    "Company Name",
    "Company Contact",
    Math.floor(Math.random() * 1000 + 1000).toString(),
    "Burlington",
    "VT",
    "05401",
    "555 Some St.",
    "555 Some Other St."
  ),
  createData(
    "Company Name",
    "Company Contact",
    Math.floor(Math.random() * 1000 + 1000).toString(),
    "Burlington",
    "VT",
    "05401",
    "555 Some St.",
    "555 Some Other St."
  ),
  createData(
    "Company Name",
    "Company Contact",
    Math.floor(Math.random() * 1000 + 1000).toString(),
    "Burlington",
    "VT",
    "05401",
    "555 Some St.",
    "555 Some Other St."
  ),createData(
    "Company Name",
    "Company Contact",
    Math.floor(Math.random() * 1000 + 1000).toString(),
    "Burlington",
    "VT",
    "05401",
    "555 Some St.",
    "555 Some Other St."
  )
]

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  settingsMargin: {
    marginBottom: "15px",
  }
}));

const Billing = () => {
  const classes = useStyles();
  const [shippingInfo, setShippingInfo] = useState(data);

  const columns = [
    { title: "Company", field: "company" },
    { title: "Contact", field: "contactName" },
    { title: "Code", field: "code" },
    { title: "City", field: "city" },
    { title: "State", field: "state" },
    { title: "Zip Code", field: "zip" },
    { title: "Billing Address", field: "billingAdd" },
    { title: "Shipping Address", field: "shippingAdd" }
  ]
  return (
    <>
      <Typography className={classes.titleText}>Update Billing / Shipping Addresses</Typography>
      <br />
      <MaterialTable
        title=""
        columns={columns}
        data={shippingInfo}
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
                setShippingInfo([...shippingInfo, newData]);

                resolve();
              }, 1000);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataUpdate = [...shippingInfo];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                setShippingInfo([...dataUpdate]);

                resolve();
              }, 1000);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataDelete = [...shippingInfo];
                const index = oldData.tableData.id;
                dataDelete.splice(index, 1);
                setShippingInfo([...dataDelete]);

                resolve();
              }, 1000);
            }),
        }}
        icons={tableIcons}
      />
    </>
  )
}

export default Billing;
