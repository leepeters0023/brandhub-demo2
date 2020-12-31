import React from "react";
import PropTypes from "prop-types";

import { formatMoney } from "../../utility/utilityFunctions";

import ImageWrapper from "../Utility/ImageWrapper";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  clickableCell: {
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "#737373",
      color: "white",
    },
  },
}));

const SingleOrderDetailTable = ({ items, handleTrackingClick }) => {
  const classes = useStyles();
  return (
    <>
      <TableContainer className={classes.tableContainer}>
        <Table className={classes.table} aria-label="order-items">
          <TableHead>
            <TableRow>
              <TableCell className={classes.headerText} align="left">
                Preview
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Sequence #
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Program
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Brand
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Item Type
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Qty / Pack
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Est. Cost
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Qty
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Est. Total
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Act. Total
              </TableCell>
              <TableCell className={classes.headerText} align="left">
                Tracking
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.itemNumber}>
                <TableCell align="left">
                  <ImageWrapper
                    id={item.itemNumber}
                    imgClass={classes.previewImg}
                    alt={item.itemType}
                    imgUrl={item.imgUrlThumb}
                  />
                </TableCell>
                <TableCell align="left">{item.itemNumber}</TableCell>
                <TableCell align="left">{item.program}</TableCell>
                <TableCell align="left">{item.brand}</TableCell>
                <TableCell align="left">{item.itemType}</TableCell>
                <TableCell align="left">{item.packSize}</TableCell>
                <TableCell align="left">{`${formatMoney(
                  item.estCost,
                  false
                )}`}</TableCell>
                <TableCell align="left">{item.totalItems}</TableCell>
                <TableCell align="left">{`${formatMoney(
                  item.totalEstCost,
                  false
                )}`}</TableCell>
                <TableCell align="left">{item.actTotal}</TableCell>
                <TableCell
                  align="center"
                  className={
                    item.tracking !== "---" && item.trackingId
                      ? classes.clickableCell
                      : null
                  }
                  onClick={
                    item.tracking !== "---" && item.trackingId
                      ? (evt) => {
                          evt.stopPropagation();
                          handleTrackingClick(item.trackingId);
                        }
                      : null
                  }
                >
                  {item.tracking}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

SingleOrderDetailTable.propTypes = {
  items: PropTypes.array.isRequired,
};

export default SingleOrderDetailTable;
