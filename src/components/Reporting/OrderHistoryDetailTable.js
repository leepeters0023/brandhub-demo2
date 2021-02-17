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
  { id: "itemNumber", label: "Seq #" },
  { id: "territoryType", label: "Cart Type" },
  { id: "territoryName", label: "Territory" },
  { id: "orderType", label: "Order Type" },
  { id: "program", label: "Program" },
  { id: "unit", label: "BU" },
  { id: "brandCode", label: "Brand" },
  { id: "itemTypeCode", label: "Item Type Code" },
  { id: "itemType", label: "Item Type" },
  { id: "itemDescription", label: "Item Desc." },
  { id: "supplier", label: "Vendor" },
  { id: "addressOne", label: "Address 1" },
  { id: "addressTwo", label: "Address 2" },
  { id: "city", label: "City" },
  { id: "state", label: "State" },
  { id: "zip", label: "Zip" },
  { id: "distributorName", label: "Distributor Name" },
  { id: "abn", label: "ABN" },
  { id: "tactic", label: "Tactic" },
  { id: "totalItems", label: "Qty Ordered" },
  { id: "estCost", label: "Est. Cost" },
  { id: "totalEstCost", label: "Total Est. Cost" },
  { id: "actCost", label: "Act. Cost" },
  { id: "totalActCost", label: "Total Act. Cost" },
  { id: "user", label: "Ordered By" },
  { id: "complianceStatus", label: "Compliance Status" },
  { id: "inMarketDate", label: "In Market Date" },
  { id: "orderDate", label: "Order Date" },
  { id: "orderNumber", label: "Order Number" },
  { id: "shippedDate", label: "Shipped Date" },
  { id: "status", label: "Order Status" },
];

const OrderHistoryDetailTableHead = ({ classes }) => (
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

const OrderHistoryDetailTable = ({
  report,
  orderTypeMap,
  currentSuppliers,
}) => {
  const classes = useStyles();

  return (
    <TableContainer
      className={classes.tableContainer}
      style={{ maxHeight: "Calc(100vh - 400px)" }}
    >
      <Table className={classes.table} aria-label="wrap-up-report" stickyHeader>
        <OrderHistoryDetailTableHead classes={classes} />
        <TableBody>
          {report.map((item, index) => (
            <TableRow key={index}>
              <TableCell align="left">{item.itemNumber}</TableCell>
              <TableCell align="left">{item.territoryType}</TableCell>
              <TableCell align="left">{item.territoryName}</TableCell>
              <TableCell align="left">{orderTypeMap[item.orderType]}</TableCell>
              <TableCell align="left">{item.program}</TableCell>
              <TableCell align="left">{item.unit}</TableCell>
              <TableCell align="left">{item.brandCode}</TableCell>
              <TableCell align="left">{item.itemTypeCode}</TableCell>
              <TableCell align="left">{item.itemType}</TableCell>
              <TableCell align="left">{item.itemDescription}</TableCell>
              <TableCell align="left">
                {
                  currentSuppliers.find((sup) => sup.id === item.supplierId)
                    .name
                }
              </TableCell>
              <TableCell align="left">{item.addressOne}</TableCell>
              <TableCell align="left">{item.addressTwo}</TableCell>
              <TableCell align="left">{item.city}</TableCell>
              <TableCell align="left">{item.state}</TableCell>
              <TableCell align="left">{item.zip}</TableCell>
              <TableCell align="left">{item.distributor}</TableCell>
              <TableCell align="left">{item.distributorAbn}</TableCell>
              <TableCell align="left">
                {item.isCoupon ? "Coupon" : "POS"}
              </TableCell>
              <TableCell align="left">{item.totalItems}</TableCell>
              <TableCell align="left">{formatMoney(item.estCost)}</TableCell>
              <TableCell align="left">
                {formatMoney(item.totalEstCost)}
              </TableCell>
              <TableCell align="left">
                {item.actCost !== "---" ? formatMoney(item.actCost) : "---"}
              </TableCell>
              <TableCell align="left">
                {item.totalActCost !== "---"
                  ? formatMoney(item.totalActCost)
                  : "---"}
              </TableCell>
              <TableCell align="left">{item.user}</TableCell>
              <TableCell align="left">
                {!item.triggeredRules &&
                !item.triggeredPriorApprovalRules &&
                !item.isComplianceCanceled
                  ? "Ok"
                  : item.isComplianceCanceled
                  ? "Compliance Canceled"
                  : (item.triggeredRules && item.triggeredRules.length > 0) ||
                    (item.triggeredPriorApprovalRules &&
                      item.triggeredPriorApprovalRules.length > 0)
                  ? "On Hold"
                  : "Ok"}
              </TableCell>
              <TableCell align="left">{item.inMarketDate}</TableCell>
              <TableCell align="left">{item.orderDate}</TableCell>
              <TableCell align="left">{item.orderNumber}</TableCell>
              <TableCell align="left">{item.shipDate}</TableCell>
              <TableCell align="left">{item.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

OrderHistoryDetailTable.propTypes = {
  report: PropTypes.array,
  orderTypeMap: PropTypes.object.isRequired,
};

export default OrderHistoryDetailTable;
