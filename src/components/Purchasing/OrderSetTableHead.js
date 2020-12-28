import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { formatMoney, formatDate } from "../../utility/utilityFunctions";
import format from "date-fns/format";

import { useSelector } from "react-redux";

import DistributorSelection from "./DistributorSelection";
import ImageWrapper from "../Utility/ImageWrapper";

import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

import CancelIcon from "@material-ui/icons/Cancel";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import WarningIcon from "@material-ui/icons/Warning";

const TotalItemCell = React.memo(({ itemNumber, classes }) => {
  const value = useSelector((state) =>
    state.orderSet.items.find((item) => item.itemNumber === itemNumber)
  );
  return (
    <TableCell
      classes={{ root: classes.root }}
      style={{ textAlign: "center" }}
      className={classes.borderRightLight}
    >
      <div className={classes.infoCell}>{value ? value.totalItems : "---"}</div>
    </TableCell>
  );
});

const TotalEstCostCell = React.memo(({ itemNumber, classes }) => {
  const value = useSelector((state) =>
    state.orderSet.items.find((item) => item.itemNumber === itemNumber)
  );
  return (
    <TableCell
      classes={{ root: classes.root }}
      style={{ textAlign: "center" }}
      className={classes.borderRightLight}
    >
      <div className={classes.infoCell}>
        {value ? `${formatMoney(value.totalEstCost, false)}` : "---"}
      </div>
    </TableCell>
  );
});

const OrderSetTableHead = ({
  classes,
  orderType,
  orderStatus,
  handleOpenConfirm,
  handleModalOpen,
  setRushModalOpen,
  setCurrentItem,
}) => {
  const [open, setOpen] = useCallback(useState(true));
  const [tableStyle, setTableStyle] = useCallback(useState("tableOpen"));

  const currentItems = useSelector((state) => state.orderSet.items);

  return (
    <TableHead>
      <TableRow>
        <TableCell
          classes={{ root: classes.colRoot }}
          className={classes.borderRight}
          style={{ zIndex: "100" }}
        >
          {orderStatus !== "submitted" && (
            <div className={classes.headerCell}>
              <DistributorSelection />
            </div>
          )}
        </TableCell>
        {currentItems.map((item) => (
          <TableCell
            classes={{ root: classes.root }}
            className={classes.borderRight}
            key={item.id}
          >
            <div className={classes.headerCell}>
              {item.isRush && orderStatus === "submitted" && (
                <Tooltip
                  title={`Standard Delivery: ${format(
                    formatDate(new Date(item.standardDeliveryDate)),
                    "MM/dd/yyyy"
                  )}, Requested Delivery: ${format(
                    formatDate(new Date(item.inMarketDate)),
                    "MM/dd/yyyy"
                  )}, Click to change.`}
                >
                  <IconButton
                    onClick={() => {
                      setCurrentItem(item);
                      setRushModalOpen(true);
                    }}
                    style={{ position: "absolute", top: 0, left: 0 }}
                  >
                    <WarningIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Remove from Order">
                <IconButton
                  onClick={() => {
                    handleOpenConfirm(item.itemNumber, item.id);
                  }}
                  style={{ position: "absolute", top: 0, right: -15 }}
                >
                  <CancelIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <ImageWrapper
                id={item.id}
                imgClass={classes.previewImageFloat}
                alt={item.itemType}
                imgUrl={item.imgUrlThumb}
                handleClick={() => {
                  handleModalOpen(
                    item.imgUrlLg,
                    item.brand,
                    item.itemType,
                    item.itemNumber,
                    item.itemDescription
                  );
                }}
              />
              <Typography className={classes.headerText} variant="h5">
                {item.brand}
              </Typography>
            </div>
          </TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell
          classes={{ root: classes.colRoot }}
          className={classes.borderRight}
          align="right"
          style={{ top: 137, zIndex: "100" }}
        >
          <div className={classes.tableControl}>
            <Typography>Order Details</Typography>
            <IconButton
              aria-label="expand row"
              onClick={() => {
                setOpen(!open);
                !open ? setTableStyle(null) : setTableStyle("tableClosed");
              }}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </div>
        </TableCell>
        {currentItems.map((item) => {
          return (
            <TableCell
              classes={{ root: classes.root }}
              style={{ top: 137, textAlign: "center" }}
              className={classes.borderRight}
              key={item.id}
            >
              <div className={classes.infoCell}>
                <Typography variant="body2" color="textSecondary">
                  {`${item.itemType} | ${item.itemNumber}`}
                </Typography>
              </div>
            </TableCell>
          );
        })}
      </TableRow>
      <TableRow>
        <TableCell
          classes={{ root: classes.root }}
          style={{ padding: 0, top: 197 }}
          colSpan={currentItems.length + 1}
          className={classes[tableStyle]}
        >
          <Collapse in={open} timeout="auto">
            <Box>
              <Table
                size="small"
                className={classes.table}
                aria-label="item-info"
                classes={{ root: classes.tableRoot }}
              >
                <TableBody style={{ position: "relative", zIndex: "10" }}>
                  {orderType !== "pre-order" && (
                    <TableRow className={classes.infoRow}>
                      <TableCell
                        classes={{ root: classes.colRoot }}
                        style={{
                          position: "sticky",
                          left: 0,
                          backgroundColor: "white",
                          zIndex: "100",
                        }}
                        className={classes.borderRight}
                      >
                        <div style={{ zIndex: "100" }}>
                          <Typography className={classes.headerText}>
                            Lead Time
                          </Typography>
                        </div>
                      </TableCell>
                      {currentItems.map((item) => (
                        <TableCell
                          classes={{ root: classes.root }}
                          align="center"
                          key={item.id}
                          className={classes.borderRightLight}
                        >
                          <div className={classes.infoCell}>
                            {item.leadTime ? item.leadTime : "---"}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  )}
                  <TableRow className={classes.infoRow}>
                    <TableCell
                      classes={{ root: classes.colRoot }}
                      style={{
                        position: "sticky",
                        left: 0,
                        backgroundColor: "white",
                        zIndex: "100",
                      }}
                      className={classes.borderRight}
                    >
                      <div style={{ zIndex: "100" }}>
                        <Typography className={classes.headerText}>
                          Items Per Pack
                        </Typography>
                      </div>
                    </TableCell>
                    {currentItems.map((item) => (
                      <TableCell
                        classes={{ root: classes.root }}
                        align="center"
                        key={item.id}
                        className={classes.borderRightLight}
                      >
                        <div className={classes.infoCell}>{item.packSize}</div>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow className={classes.infoRow}>
                    <TableCell
                      classes={{ root: classes.colRoot }}
                      style={{
                        position: "sticky",
                        left: 0,
                        backgroundColor: "white",
                        zIndex: "100",
                      }}
                      className={classes.borderRight}
                    >
                      <div style={{ zIndex: "100" }}>
                        <Typography className={classes.headerText}>
                          Total Qty of Items
                        </Typography>
                      </div>
                    </TableCell>
                    {currentItems.map((item) => (
                      <TotalItemCell
                        itemNumber={item.itemNumber}
                        key={item.id}
                        classes={classes}
                      />
                    ))}
                  </TableRow>
                  <TableRow className={classes.infoRow}>
                    <TableCell
                      classes={{ root: classes.colRoot }}
                      style={{
                        position: "sticky",
                        left: 0,
                        backgroundColor: "white",
                        zIndex: "100",
                      }}
                      className={classes.borderRight}
                    >
                      <div style={{ zIndex: "100" }}>
                        <Typography className={classes.headerText}>
                          Item Est Cost
                        </Typography>
                      </div>
                    </TableCell>
                    {currentItems.map((item) => (
                      <TableCell
                        classes={{ root: classes.root }}
                        align="center"
                        key={item.id}
                        className={classes.borderRightLight}
                      >
                        {`${formatMoney(item.estCost, false)}`}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow className={classes.infoRow}>
                    <TableCell
                      classes={{ root: classes.colRoot }}
                      style={{
                        position: "sticky",
                        left: 0,
                        backgroundColor: "white",
                        zIndex: "100",
                      }}
                      className={classes.borderRight}
                    >
                      <div style={{ zIndex: "100" }}>
                        <Typography className={classes.headerText}>
                          Total Est Cost
                        </Typography>
                      </div>
                    </TableCell>
                    {currentItems.map((item) => (
                      <TotalEstCostCell
                        itemNumber={item.itemNumber}
                        key={item.id}
                        classes={classes}
                      />
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

OrderSetTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  orderType: PropTypes.string.isRequired,
  orderStatus: PropTypes.string.isRequired,
  handleOpenConfirm: PropTypes.func.isRequired,
  handleModalOpen: PropTypes.func.isRequired,
  setRushModalOpen: PropTypes.func.isRequired,
  setCurrentItem: PropTypes.func.isRequired,
};

export default React.memo(
  OrderSetTableHead,
  (prev, next) =>
    prev.currentItems &&
    next.currentItems &&
    prev.currentItems.length === next.currentItems.length
);
