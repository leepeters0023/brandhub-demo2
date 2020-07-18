import React from "react";

import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";

import EditIcon from "@material-ui/icons/Edit";
import AddBoxIcon from "@material-ui/icons/AddBox";

// simulate mock addresses
const createData = (company, code, city, state, button) => {
  return { company, code, city, state, button };
};

const billingAddresses = [
  createData(
    "Company Name",
    `(${Math.floor(Math.random() * 1000 + 1000)})`,
    "City Name",
    "VT",
    <Tooltip title="Edit">
      <IconButton>
        <EditIcon />
      </IconButton>
    </Tooltip>
  ),
  createData(
    "Company Name",
    `(${Math.floor(Math.random() * 1000 + 1000)})`,
    "City Name",
    "VT",
    <Tooltip title="Edit">
      <IconButton>
        <EditIcon />
      </IconButton>
    </Tooltip>
  ),
  createData(
    "Company Name",
    `(${Math.floor(Math.random() * 1000 + 1000)})`,
    "City Name",
    "VT",
    <Tooltip title="Edit">
      <IconButton>
        <EditIcon />
      </IconButton>
    </Tooltip>
  ),
  createData(
    "Company Name",
    `(${Math.floor(Math.random() * 1000 + 1000)})`,
    "City Name",
    "VT",
    <Tooltip title="Edit">
      <IconButton>
        <EditIcon />
      </IconButton>
    </Tooltip>
  ),
];

const shippingAddresses = [
  createData(
    "Company Name",
    `(${Math.floor(Math.random() * 1000 + 1000)})`,
    "City Name",
    "VT",
    <Tooltip title="Edit">
      <IconButton>
        <EditIcon />
      </IconButton>
    </Tooltip>
  ),
  createData(
    "Company Name",
    `(${Math.floor(Math.random() * 1000 + 1000)})`,
    "City Name",
    "VT",
    <Tooltip title="Edit">
      <IconButton>
        <EditIcon />
      </IconButton>
    </Tooltip>
  ),
  createData(
    "Company Name",
    `(${Math.floor(Math.random() * 1000 + 1000)})`,
    "City Name",
    "VT",
    <Tooltip title="Edit">
      <IconButton>
        <EditIcon />
      </IconButton>
    </Tooltip>
  ),
  createData(
    "Company Name",
    `(${Math.floor(Math.random() * 1000 + 1000)})`,
    "City Name",
    "VT",
    <Tooltip title="Edit">
      <IconButton>
        <EditIcon />
      </IconButton>
    </Tooltip>
  ),
  createData(
    "Company Name",
    `(${Math.floor(Math.random() * 1000 + 1000)})`,
    "City Name",
    "VT",
    <Tooltip title="Edit">
      <IconButton>
        <EditIcon />
      </IconButton>
    </Tooltip>
  ),
  createData(
    "Company Name",
    `(${Math.floor(Math.random() * 1000 + 1000)})`,
    "City Name",
    "VT",
    <Tooltip title="Edit">
      <IconButton>
        <EditIcon />
      </IconButton>
    </Tooltip>
  ),
  createData(
    "Company Name",
    `(${Math.floor(Math.random() * 1000 + 1000)})`,
    "City Name",
    "VT",
    <Tooltip title="Edit">
      <IconButton>
        <EditIcon />
      </IconButton>
    </Tooltip>
  ),
  createData(
    "Company Name",
    `(${Math.floor(Math.random() * 1000 + 1000)})`,
    "City Name",
    "VT",
    <Tooltip title="Edit">
      <IconButton>
        <EditIcon />
      </IconButton>
    </Tooltip>
  ),
];

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  addressTitleBar: {
    display: "flex",
    justifyContent: "space-between",
  }
}));

const AddressBook = () => {
  const classes = useStyles();
  return (
    <div>
      <Container className={classes.tabContainer}>
        <Typography className={classes.titleText} variant="h5">
          Address Book
        </Typography>
        <Typography variant="body1" color="textSecondary">
          The following addresses are associated with your customer account.
        </Typography>
        <br />
        <TableContainer className={classes.tableContainer}>
          <br />
          <div className={classes.addressTitleBar}>
          <Typography className={classes.titleText} variant="h5">
            Billing Address
          </Typography>
          <Tooltip title="Add New Address">
            <IconButton>
              <AddBoxIcon />
            </IconButton>
          </Tooltip>
          </div>
          <br />
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.headerText}>Company</TableCell>
                <TableCell className={classes.headerText} align="right">
                  Code
                </TableCell>
                <TableCell className={classes.headerText} align="right">
                  City
                </TableCell>
                <TableCell className={classes.headerText} align="right">
                  State
                </TableCell>
                <TableCell
                  className={classes.headerText}
                  align="right"
                ></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {billingAddresses.map((row) => (
                <TableRow key={row.code}>
                  <TableCell component="th" scope="row">
                    {row.company}
                  </TableCell>
                  <TableCell align="right">{row.code}</TableCell>
                  <TableCell align="right">{row.city}</TableCell>
                  <TableCell align="right">{row.state}</TableCell>
                  <TableCell align="right">{row.button}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <br/>
        <hr/>
        <br/>
        <TableContainer className={classes.tableContainer}>
          <br />
          <div className={classes.addressTitleBar}>
          <Typography className={classes.titleText} variant="h5">
            Shipping Address
          </Typography>
          <Tooltip title="Add New Address">
            <IconButton>
              <AddBoxIcon />
            </IconButton>
          </Tooltip>
          </div>
          <br />
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.headerText}>Company</TableCell>
                <TableCell className={classes.headerText} align="right">
                  Code
                </TableCell>
                <TableCell className={classes.headerText} align="right">
                  City
                </TableCell>
                <TableCell className={classes.headerText} align="right">
                  State
                </TableCell>
                <TableCell
                  className={classes.headerText}
                  align="right"
                ></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shippingAddresses.map((row) => (
                <TableRow key={row.code}>
                  <TableCell component="th" scope="row">
                    {row.company}
                  </TableCell>
                  <TableCell align="right">{row.code}</TableCell>
                  <TableCell align="right">{row.city}</TableCell>
                  <TableCell align="right">{row.state}</TableCell>
                  <TableCell align="right">{row.button}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
};

export default AddressBook;
