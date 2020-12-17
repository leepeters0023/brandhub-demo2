import React from "react";
import PropTypes from "prop-types";

import { formatMoney } from "../../utility/utilityFunctions";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { makeStyles } from "@material-ui/core/styles";

const headCells = [
  { id: "user", label: "Ordered By" },
  { id: "state", label: "Market" },
  { id: "brandCode", label: "Brand" },
  { id: "unit", label: "BU" },
  { id: "inMarketDate", label: "Month in Market" },
  { id: "tactic", label: "Tactic" },
  { id: "supplier", label: "Vendor" },
  { id: "totalEstCost", label: "Estimated Cost" },
  { id: "totalItems", label: "Qty Ordered" },
  { id: "holdType", label: "Hold Type" },
  { id: "itemNumber", label: "Seq #" },
  { id: "program", label: "Program" },
  { id: "orderType", label: "Order Type" },
];

const WrapUpTableHead = ({ classes }) => (
  <TableHead>
    <TableRow>
      {headCells.map((cell) => (
        <TableCell className={classes.headerText} key={cell.id} align="left">
          {cell.label}
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
);

const useStyles = makeStyles((theme) => ({
  ...theme.global,
}));

const WrapUpTable = ({ report, orderTypeMap }) => {
  const classes = useStyles();

  return (
    <TableContainer
      className={classes.tableContainer}
      style={{ maxHeight: "Calc(100vh - 400px)" }}
    >
      <Table className={classes.table} aria-label="wrap-up-report" stickyHeader>
        <WrapUpTableHead classes={classes} />
        <TableBody>
          {report.map((item, index) => (
            <TableRow key={index}>
              <TableCell align="left">{item.user}</TableCell>
              <TableCell align="left">{item.state}</TableCell>
              <TableCell align="left">{item.brandCode}</TableCell>
              <TableCell align="left">{item.unit}</TableCell>
              <TableCell align="left">{"---"}</TableCell>
              <TableCell align="left">{"---"}</TableCell>
              <TableCell align="left">{item.supName}</TableCell>
              <TableCell align="left">{formatMoney(item.totalEstCost)}</TableCell>
              <TableCell align="left">{item.totalItems}</TableCell>
              <TableCell align="left">{"---"}</TableCell>
              <TableCell align="left">{item.itemNumber}</TableCell>
              <TableCell align="left">{item.program}</TableCell>
              <TableCell align="left">{orderTypeMap[item.orderType]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

WrapUpTable.propTypes = {
  report: PropTypes.array,
  orderTypeMap: PropTypes.object.isRequired,
}

export default WrapUpTable;
