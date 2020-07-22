import React from "react";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { makeStyles } from "@material-ui/core/styles";

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

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  tableRow: {
    "&:hover": {
      backgroundColor: "lightgray !important",
      cursor: "pointer",
    },
  },
}));

const ApprovalPrior = ({ handleModal }) => {
  const classes = useStyles();

  return (
    <>
      <TableContainer className={classes.tableContainer}>
        <Table className={classes.table} aria-label="prior-approvals">
          <TableHead>
            <TableRow>
              <TableCell className={classes.headerText} align="left">
                Approval ID
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Entry Date
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Sequence #
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Brand
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Last Update
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Last Modified By
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Comments
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.approvalId}
                id={row.approvalId}
                onClick={() => handleModal(row.approvalId)}
                hover={true}
                className={classes.tableRow}
              >
                <TableCell align="left">{row.approvalId}</TableCell>
                <TableCell align="left">{row.date}</TableCell>
                <TableCell align="left">{row.sequenceNum}</TableCell>
                <TableCell align="left">{row.brand}</TableCell>
                <TableCell align="left">{row.lastUpdate}</TableCell>
                <TableCell align="left">{row.lastMod}</TableCell>
                <TableCell align="left">{row.comments}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ApprovalPrior;
